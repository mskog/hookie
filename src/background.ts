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
  chrome.contextMenus.onClicked.addListener((event) => {
    chrome.storage.sync.get({ actions: [] }, (result) => {
      const actions: Action[] = result.actions
      const action = actions.find((action) => action.url === event.menuItemId)

      if (action) {
        if (action.type === ActionType.Redirect) {
          chrome.tabs.create({
            url: `${action.url}?${action.parameter}=${event.pageUrl}`
          })
        } else {
          fetch(`${action.url}?${action.parameter}=${event.pageUrl}`)
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
