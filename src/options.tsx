import "~style.css"

import React, { useEffect, useState } from "react"

const OptionsPage: React.FC = () => {
  const [url, setUrl] = useState<string>("")
  const [status, setStatus] = useState<string>("")

  useEffect(() => {
    chrome.storage.sync.get({ url: "" }, (items) => {
      setUrl(items.url)
    })
  }, [])

  const handleSave = () => {
    chrome.storage.sync.set({ url }, () => {
      setStatus("Options saved successfully!")
      setTimeout(() => setStatus(""), 3000)
    })
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="mb-6 text-3xl font-bold text-gray-800">
          Hookie Options
        </h1>
        <div className="mb-6">
          <label
            htmlFor="url"
            className="block mb-2 text-sm font-medium text-gray-700">
            n8n URL
          </label>
          <input
            type="text"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter URL here"
          />
        </div>
        <button
          onClick={handleSave}
          className="w-full px-4 py-2 text-white transition-colors duration-300 bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          Save Options
        </button>
        {status && (
          <div className="p-2 mt-4 text-center text-green-700 bg-green-100 border border-green-400 rounded-md">
            {status}
          </div>
        )}
      </div>
    </div>
  )
}

export default OptionsPage
