import * as vscode from "vscode";
const SINGLEUSERNAMEKEY = "singleusername";
const SINGLEUSERIDKEY = "singleuserid";

export class BoothState {
  static globalState: vscode.Memento;

  static setSingleUserName(name: any) {
    return this.globalState.update(SINGLEUSERNAMEKEY, name);
  }

  static setSingleUserId(id: any) {
    return this.globalState.update(SINGLEUSERIDKEY, id);
  }

  static getSingleUserName(): any | undefined {
    return this.globalState.get(SINGLEUSERNAMEKEY);
  }

  static getSingleUserId(): any | undefined {
    return this.globalState.get(SINGLEUSERIDKEY);
  }
}
