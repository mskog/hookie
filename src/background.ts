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
          id: action.url
        })
      })
    })
  })
}

function setupContextMenuListener() {
  chrome.contextMenus.onClicked.addListener((event, tab) => {
    chrome.storage.sync.get({ actions: [] }, (result) => {
      const actions: Action[] = result.actions
      const action = actions.find((action) => action.url === event.menuItemId)

      if (action) {
        let paramValue: string

        switch (action.context) {
          case "selection":
            paramValue = event.selectionText
              ? encodeURIComponent(event.selectionText)
              : event.pageUrl
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

        const url = `${action.url}?${action.parameter}=${paramValue}`

        if (action.type === ActionType.Redirect) {
          chrome.tabs.create({ url })
        } else {
          fetch(url)
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
