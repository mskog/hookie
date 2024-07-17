export {}

enum ActionType {
  Redirect = "Redirect",
  Background = "Background"
}

interface Action {
  url: string
  name: string
  parameter: string
  context: chrome.contextMenus.ContextType
  type: ActionType
}

chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.get({ url: "" }, (result) => {
    fetch(result.url)
      .then((response) => response.json())
      .then((data: any[]) => {
        return data.map(
          (item): Action => ({
            url: item.url,
            name: item.name,
            parameter: item.parameter,
            context: item.context,
            type: (item.type as ActionType) || ActionType.Background
          })
        )
      })
      .then((actions: Action[]) => {
        actions.forEach((action) => {
          chrome.contextMenus.create({
            title: action.name,
            contexts: ["page"],
            id: action.url
          })
        })

        chrome.contextMenus.onClicked.addListener((event) => {
          const action = actions.find(
            (action) => action.url === event.menuItemId
          )

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
  })
})
