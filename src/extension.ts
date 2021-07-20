import * as vscode from "vscode";
import { WelcomePanel } from "./WelcomePanel";
import { SidebarProvider } from "./SidebarProvider";
// import { authenticate } from "./authenticate";
import { TokenManager } from "./TokenManager";
import { UserPanel } from "./UserPanel";
import { TeamPanel } from "./TeamPanel";
import { apiBaseURL } from "./constants";
import fetch from "node-fetch";
import { ProjectPanel } from "./ProjectPanel";

export function activate(context: vscode.ExtensionContext) {
  TokenManager.globalState = context.globalState;
  TokenManager.setToken("");
  console.log("Token Value is: " + TokenManager.getToken());

  /* --------------------------------- SideBar Starts-------------------------------- */
  const sidebarProvider = new SidebarProvider(context.extensionUri);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "codebooth-sidebar",
      sidebarProvider
    )
  );

  /* --------------------------------- SideBar Ends-------------------------------- */

  /* ------------------------------ Welcome Panel Starts----------------------------- */
  context.subscriptions.push(
    vscode.commands.registerCommand("codebooth.Welcome", () => {
      WelcomePanel.createOrShow(context.extensionUri);
    })
  );
  /* ------------------------------ Welcome Panel Ends----------------------------- */

  /* ------------------------------ Users Panel Starts----------------------------- */
  context.subscriptions.push(
    vscode.commands.registerCommand("codebooth.Users", () => {
      UserPanel.createOrShow(context.extensionUri);
    })
  );
  /* ------------------------------ User Panel Ends----------------------------- */

  /* ------------------------------ Create Flair Starts----------------------------- */
  context.subscriptions.push(
    vscode.commands.registerCommand("codebooth.createFlair", () => {
      let options: vscode.InputBoxOptions = {
        prompt: "Create Flair - ",
        placeHolder: "Enter Flair here... e.g php || html || java || react",
      };

      vscode.window.showInputBox(options).then((value) => {
        if (!value) return;
        vscode.window.showInformationMessage("Creating Flair: " + value);

        sidebarProvider._view?.webview.postMessage({
          type: "new-flair",
          value: value,
        });
        return;
      });
    })
  );
  /* ------------------------------ Create Flair Ends----------------------------- */

  /* ------------------------------ Logout----------------------------- */
  context.subscriptions.push(
    vscode.commands.registerCommand("codebooth.logout", () => {
      sidebarProvider._view?.webview.postMessage({
        type: "logout",
        value: undefined,
      });
      return;
    })
  );

  /* ------------------------------Logout----------------------------- */

  /* ------------------------------ Create Team Starts----------------------------- */
  context.subscriptions.push(
    vscode.commands.registerCommand("codebooth.createTeam", () => {
      let teamName: string = "";
      let teamDesc: string = "";

      // Name
      let TeamNameOptions: vscode.InputBoxOptions = {
        prompt: "Create Team - ",
        placeHolder: "Enter Team's Name here...",
      };

      // Descrption
      let TeamDescOptions: vscode.InputBoxOptions = {
        prompt: "Enter Description - ",
        placeHolder: "Enter Team's Description here...",
      };

      vscode.window.showInputBox(TeamNameOptions).then((name) => {
        if (!name) return;
        teamName = name;
        vscode.window.showInputBox(TeamDescOptions).then((desc) => {
          if (!desc) return;
          teamDesc = desc;

          const data = {
            teamName: teamName,
            teamDesc: teamDesc,
          };

          vscode.window.showInformationMessage("Creating Team: " + teamName);

          sidebarProvider._view?.webview.postMessage({
            type: "new-team",
            value: data,
          });
        });
      });
    })
  );

  /* ------------------------------ Create Team Ends----------------------------- */

  /* ------------------------------ ManageTeam Panel Starts----------------------------- */
  context.subscriptions.push(
    vscode.commands.registerCommand("codebooth.manageTeams", () => {
      TeamPanel.createOrShow(context.extensionUri);
    })
  );
  /* ------------------------------ ManageTeam Panel Ends----------------------------- */

  /* ------------------------------ Create Project Starts----------------------------- */
  context.subscriptions.push(
    vscode.commands.registerCommand("codebooth.createProject", () => {
      let projectName: string = "";
      let projectDesc: string = "";
      let projectTeam: any;
      let ready: boolean = false;

      // Name
      let ProjectOptions: vscode.InputBoxOptions = {
        prompt: "Create Project - ",
        placeHolder: "Enter Project's Name here...",
      };

      // Descrption
      let ProjectOptions3: vscode.InputBoxOptions = {
        prompt: "Enter Description - ",
        placeHolder: "Enter Project's Description here...",
      };

      // Team || Personal
      let ProjectOptions2: vscode.InputBoxOptions = {
        prompt: "Personal?",
        placeHolder:
          "Enter 'Yes' If this project is personal, and 'No' if otherwise to select a Team",
      };

      vscode.window.showInputBox(ProjectOptions).then((name) => {
        if (!name) return;
        projectName = name;
        vscode.window.showInputBox(ProjectOptions3).then((desc) => {
          if (!desc) return;
          projectDesc = desc;
          vscode.window.showInputBox(ProjectOptions2).then(async (personal) => {
            if (!personal) return;

            if (personal === "No") {
              const response = await fetch(`${apiBaseURL}/teams`, {
                method: "GET",
                headers: {
                  "content-type": "application/json",
                  authorization: `Bearer ${TokenManager.getToken()}`,
                },
              });
              const data = await response.json();

              if (!data) {
                vscode.window.showInformationMessage(
                  "Error Encountered, Please try Agian"
                );
                return;
              }

              const quickPick = vscode.window.createQuickPick();
              const teams = data.teams;
              quickPick.placeholder = "Select a Team";
              quickPick.items = teams.map((x: any) => ({
                label: x.name,
                value: x.id,
              }));
              quickPick.onDidChangeSelection(([item]) => {
                if (item) {
                  projectTeam = item;
                  vscode.window.showInformationMessage(
                    "Selected Team: " + item.label
                  );
                  //
                  const data = {
                    name: projectName,
                    desc: projectDesc,
                    team:
                      projectTeam !== null || undefined
                        ? projectTeam.value
                        : null,
                  };

                  console.log(data);

                  vscode.window.showInformationMessage(
                    "Creating Project: " + projectName
                  );

                  sidebarProvider._view?.webview.postMessage({
                    type: "new-project",
                    value: data,
                  });
                  //
                  quickPick.dispose();
                }
              });
              quickPick.onDidHide(() => quickPick.dispose());
              quickPick.show();
            } else if (personal === "Yes") {
              projectTeam = null;
              //
              const data = {
                name: projectName,
                desc: projectDesc,
                team:
                  projectTeam !== null || undefined ? projectTeam.value : null,
              };

              console.log(data);

              vscode.window.showInformationMessage(
                "Creating Project: " + projectName
              );

              sidebarProvider._view?.webview.postMessage({
                type: "new-project",
                value: data,
              });
              //
            } else {
              vscode.window.showErrorMessage("Invalid Input");
              return;
            }

            // P
          });
        });
      });
    })
  );
  /* ------------------------------ Create Project Ends----------------------------- */

  /* ------------------------------ Projects Panel Starts----------------------------- */
  context.subscriptions.push(
    vscode.commands.registerCommand("codebooth.Projects", () => {
      ProjectPanel.createOrShow(context.extensionUri);
    })
  );
  /* ------------------------------ Projects Panel Ends----------------------------- */
  const item = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right
  );

  item.text = "$(file-code) Add Todo";
  item.command = "vstodo.addTodo";
  item.show();

  context.subscriptions.push(
    vscode.commands.registerCommand("vstodo.addTodo", () => {
      const activeTextEditor = vscode.window.activeTextEditor;

      if (!activeTextEditor) {
        return vscode.window.showInformationMessage("No Active text Editor");
      } else {
        const text = activeTextEditor.document.getText(
          activeTextEditor.selection
        );

        vscode.window.showInformationMessage("Text: " + text);

        sidebarProvider._view?.webview.postMessage({
          type: "new-todo",
          value: text,
        });

        return;
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("vstodo.refresh", async () => {
      // HelloWorldPanel.kill();
      // HelloWorldPanel.createOrShow(context.extensionUri);

      await vscode.commands.executeCommand("workbench.action.closeSidebar");
      await vscode.commands.executeCommand(
        "workbench.view.extension.codebooth-sidebar-view"
      );

      setTimeout(() => {
        vscode.commands.executeCommand(
          "workbench.action.webview.openDeveloperTools"
        );
      }, 500);
    })
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
