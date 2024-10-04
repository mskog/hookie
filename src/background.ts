import type { Action } from "./types"
import { ActionType } from "./types"

export {}

function setupContextMenu() {
  chrome.storage.sync.get({ actions: [] }, (result) => {
    const actions: Action[] = result.actions

    chrome.contextMenus.removeAll(() => {
      actions.forEach((action) => {
        chrome.contextMenus.create({
          title: action.name,
          contexts: [action.context],
          id: action.id
        })
      })
    })
  })
}

function setupContextMenuListener() {
  chrome.contextMenus.onClicked.addListener((event, tab) => {
    chrome.storage.sync.get({ actions: [] }, (result) => {
      const actions: Action[] = result.actions
      const action = actions.find((action) => action.id === event.menuItemId)

      if (action) {
        let paramValue: string
        let additionalParams: { [key: string]: string } = {}

        switch (action.context) {
          case "selection":
            paramValue = event.selectionText
              ? encodeURIComponent(event.selectionText)
              : event.pageUrl
            additionalParams.url = event.pageUrl // Add the current page URL
            break
          case "link":
            paramValue = event.linkUrl || event.pageUrl
            break
          case "image":
            paramValue = event.srcUrl || event.pageUrl
            break
          default:
            paramValue = event.pageUrl
        }

        if (action.type === ActionType.Redirect) {
          let url = `${action.url}?${action.parameter}=${paramValue}`
          if (action.context === "selection") {
            url += `&url=${encodeURIComponent(additionalParams.url)}`
          }
          chrome.tabs.create({ url })
        } else {
          const requestOptions: RequestInit = {
            method: action.method,
            headers: {
              "Content-Type": "application/json"
            }
          }

          if (action.method === "POST") {
            requestOptions.body = JSON.stringify({
              [action.parameter]: paramValue,
              ...(action.context === "selection" && { url: additionalParams.url })
            })
          }

          const url = `${action.url}?${action.parameter}=${paramValue}${
            action.context === "selection" ? `&url=${encodeURIComponent(additionalParams.url)}` : ""
          }`

          fetch(url, requestOptions)
        }

        chrome.notifications.create({
          type: "basic",
          iconUrl: "assets/icon.png",
          title: "Action Executed",
          message: `The action "${action.name}" was executed successfully.`
        })
      }
    })
  })
}

setupContextMenu()
setupContextMenuListener()

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === "sync" && changes.actions) {
    setupContextMenu()
  }
})

chrome.runtime.onInstalled.addListener(setupContextMenu)
chrome.runtime.onStartup.addListener(setupContextMenu)
