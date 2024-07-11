export {}

chrome.runtime.onInstalled.addListener(function () {
  interface Action {
    url: string
    name: string
    parameter: string
    context: chrome.contextMenus.ContextType
  }

  chrome.storage.sync.get({ url: "" }, (result) => {
    fetch(result.url)
      .then((response) => response.json())
      .then((actions: Action[]) => {
        actions.forEach((action) => {
          chrome.contextMenus.create({
            title: action.name,
            contexts: ["page"],
            id: action.url
          })
        })

        chrome.contextMenus.onClicked.addListener((event) => {
          const action = actions.find((action) => {
            return action.url == event.menuItemId
          })

          if (action) {
            fetch(`${action.url}?${action.parameter}=${event.pageUrl}`)
          }
        })
      })
  })
})
