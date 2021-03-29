import * as vscode from "vscode";
import { getNonce } from "./getNonce";
import { apiBaseURL } from "./constants";
import { TokenManager } from "./TokenManager";
import { authenticate } from "./authenticate";

export class SidebarProvider implements vscode.WebviewViewProvider {
  _view?: vscode.WebviewView;
  _doc?: vscode.TextDocument;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,

      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async (data) => {
      switch (data.type) {
        /* ---------------------------- Show Welcome Page --------------------------- */
        case "show-welcome": {
          await vscode.commands.executeCommand("codebooth.Welcome");
          break;
        }

        /* ------------ Authenticate and Get Token Immediately to Idenify User ----------- */
        case "authenticate": {
          authenticate(() => {
            webviewView.webview.postMessage({
              type: "token",
              value: TokenManager.getToken(),
            });
          });
          break;
        }

        /* --------- Get Token From State and send a 'token' event to svelte -------- */
        case "get-token": {
          webviewView.webview.postMessage({
            type: "token",
            value: TokenManager.getToken(),
          });
          break;
        }

        /* --------------------------------- Logout --------------------------------- */
        case "logout": {
          const logOut = await vscode.window.showInformationMessage(
            "Are you sure you want to logout?",
            "Yes",
            "No"
          );

          if (logOut !== undefined) {
            switch (logOut) {
              case "Yes":
                vscode.window.showInformationMessage(
                  "Please Wait while we log you out..."
                );
                /* ---------------------------- Unset accessToken --------------------------- */
                TokenManager.setToken("");
                vscode.window.showInformationMessage(
                  "LogOut Attempt Successful..."
                );
                /* ------- Send Message to Svelte to Clear User state and accessToken ------- */
                webviewView.webview.postMessage({
                  type: "logged-out",
                  value: undefined,
                });
                break;
              case "No":
                vscode.window.showInformationMessage(
                  "LogOut Attempt Failed..."
                );
                break;
              default:
                vscode.window.showInformationMessage("Invalid Option...");
                break;
            }
          } else {
            vscode.window.showInformationMessage("Invalid Option...");
            return;
          }
          break;
        }

        /* ---------------------------- Show Users Page --------------------------- */
        case "show-users": {
          await vscode.commands.executeCommand("codebooth.Users");
          break;
        }

        /* ---------------------------- Create Flair --------------------------- */
        case "create-flair": {
          await vscode.commands.executeCommand("codebooth.createFlair");
          break;
        }

        /* ---------------------------- Create Team --------------------------- */
        case "create-team": {
          await vscode.commands.executeCommand("codebooth.createTeam");
          break;
        }

        /* ---------------------------- Manage Teams --------------------------- */
        case "manage-teams": {
          await vscode.commands.executeCommand("codebooth.manageTeams");
          break;
        }

        /* ---------------------------- Create Project --------------------------- */
        case "create-project": {
          await vscode.commands.executeCommand("codebooth.createProject");
          break;
        }

        /* ---------------------------- Show Projects Page --------------------------- */
        case "show-projects": {
          await vscode.commands.executeCommand("codebooth.Projects");
          break;
        }

        /* ------------------------ Show Information Message ------------------------ */
        case "onInfo": {
          if (!data.value) {
            return;
          }
          vscode.window.showInformationMessage(data.value);
          break;
        }

        /* ------------------------ Show Error Message ------------------------ */
        case "onError": {
          if (!data.value) {
            return;
          }
          vscode.window.showErrorMessage(data.value);
          break;
        }
      }
    });
  }

  public revive(panel: vscode.WebviewView) {
    this._view = panel;
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const styleResetUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "reset.css")
    );
    const styleVSCodeUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css")
    );
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "out", "compiled", "Sidebar.js")
    );
    const styleMainUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "out", "compiled/Sidebar.css")
    );
    const sideStyleUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "sidebar.css")
    );
    const mainScriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "main.js")
    );

    // Use a nonce to only allow a specific script to be run.
    const nonce = getNonce();

    return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta http-equiv="Content-Security-Policy" content=" ${
          webview.cspSource
        }; script-src 'nonce-${nonce}';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${styleResetUri}" rel="stylesheet">
				<link href="${styleVSCodeUri}" rel="stylesheet">
        <link href="${styleMainUri}" rel="stylesheet">
        <link href="${sideStyleUri}" rel="stylesheet">
        <script nonce="${nonce}">
          const tsvscode = acquireVsCodeApi();
          const apiBaseURL = ${JSON.stringify(apiBaseURL)}
        </script>
			</head>
      <body>
            
        <script nonce="${nonce}" src="${scriptUri}"></script>
        <script nonce="${nonce}" src="${mainScriptUri}"></script>
			</body>
		</html>`;
  }
}
