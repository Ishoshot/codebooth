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
        "<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8' /><meta http-equiv='X-UA-Compatible' content='IE=edge' /><meta name='viewport' content='width=device-width, initial-scale=1.0' /><link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css' integrity='sha384-B0vP5xmATw1+K9KRQjQERJvTumQW0nPEzvF6L/Z6nronJ3oUOFUFpCjEUQouq2+l' crossorigin='anonymous'/><link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css' integrity='sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w==' crossorigin='anonymous' referrerpolicy='no-referrer'/><title>CodeBooth Authentication</title></head><body><div class='container-fluid min-vh-100'><div class='row min-vh-100 justify-content-center align-items-center'><div class='container text-center'> <img class='img-fluid' src='https://res.cloudinary.com/oluwatobi/image/upload/v1626728708/codebooth/CodeBooth_Logo_-_Trans_bg_eqq4za.png' alt='CodeBooth'/><h2>Oops! <i class='fa fa-user-times text-danger' aria-hidden='true'></i> Something Went Wrong...</h2></div></div></div></body></html>"
      );
    } else {
      await TokenManager.setToken(token);

      fn();

      res.end(
        "<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8' /><meta http-equiv='X-UA-Compatible' content='IE=edge' /><meta name='viewport' content='width=device-width, initial-scale=1.0' /><link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css' integrity='sha384-B0vP5xmATw1+K9KRQjQERJvTumQW0nPEzvF6L/Z6nronJ3oUOFUFpCjEUQouq2+l' crossorigin='anonymous'/><link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css' integrity='sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w==' crossorigin='anonymous' referrerpolicy='no-referrer'/><title>CodeBooth Authentication</title></head><body><div class='container-fluid min-vh-100'><div class='row min-vh-100 justify-content-center align-items-center'><div class='container text-center'> <img class='img-fluid' src='https://res.cloudinary.com/oluwatobi/image/upload/v1626728708/codebooth/CodeBooth_Logo_-_Trans_bg_eqq4za.png' alt='CodeBooth'/><h2>Yay! <i class='fas fa-user-lock text-primary'></i> Authentication Successful, You can close this now.</h2></div></div></div></body></html>"
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
