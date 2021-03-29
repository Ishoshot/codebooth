import * as _vscode from "vscode";
import { apiBaseURL } from "../src/constants";

declare global {
  const tsvscode: {
    postMessage: ({ type: string, value: any }) => void;
    getState: () => any;
    setState: (state: any) => void;
  };
  const apiBaseURL: string;
}
