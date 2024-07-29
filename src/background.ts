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
          if (action.method === "GET") {
            let url = `${action.url}?${action.parameter}=${paramValue}`
            if (action.context === "selection") {
              url += `&url=${encodeURIComponent(additionalParams.url)}`
            }
            fetch(url)
          } else if (action.method === "POST") {
            let body: { [key: string]: string } = {
              [action.parameter]: paramValue
            }
            if (action.context === "selection") {
              body.url = additionalParams.url
            }
            fetch(action.url, {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(body)
            })
          }
        }
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
