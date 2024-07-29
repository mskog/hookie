export enum ActionType {
  Redirect = "Redirect",
  Background = "Background"
}

export interface Action {
  id: string
  url: string
  name: string
  parameter: string
  context: chrome.contextMenus.ContextType
  type: ActionType
  method: "GET" | "POST"
}
