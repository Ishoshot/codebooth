import * as vscode from "vscode";
import * as polka from "polka";
import { apiBaseURL } from "./constants";
import { TokenManager } from "./TokenManager";

export const authenticate = (fn: () => void) => {
  const app = polka();

  app.get(`/auth/:token`, async (req: any, res: any) => {
    const { token } = req.params;
    res.setHeader("Content-type", "text/html");
    if (!token) {
      res.end(
        "<div style='max-width: 90vw;margin: auto;'> <img src='https://res.cloudinary.com/oluwatobi/image/upload/v1614896413/codebooth/icon_visl0u.png' alt='CodeBooth'> <h1 style='margin-top:5%'>Oops! Something Went Wrong...</h1>  </div>"
      );
      return;
    } else {
      await TokenManager.setToken(token);

      fn();

      res.end(
        "<div style='max-width: 90vw;margin: auto;'> <img src='https://res.cloudinary.com/oluwatobi/image/upload/v1614896413/codebooth/icon_visl0u.png' alt='CodeBooth'> <h1 style='margin-top:5%'>Yay! Authentication Successful, You can close this now.</h1>  </div>"
      );

      (app as any).server.close();
    }
  });

  app.listen(54321, (err: Error) => {
    if (err) {
      vscode.window.showErrorMessage(err.message);
    } else {
      vscode.commands.executeCommand(
        "vscode.open",
        vscode.Uri.parse(`${apiBaseURL}/auth/github`)
      );
    }
  });
};
