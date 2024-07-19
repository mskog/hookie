export enum ActionType {
  Redirect = "Redirect",
  Background = "Background"
}

export interface Action {
  url: string
  name: string
  parameter: string
  context: chrome.contextMenus.ContextType
  type: ActionType
}
