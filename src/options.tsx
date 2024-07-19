import "~style.css"

import React, { useEffect, useState } from "react"

import type { Action } from "./types"
import { ActionType } from "./types"

const OptionsPage: React.FC = () => {
  const [actions, setActions] = useState<Action[]>([])
  const [status, setStatus] = useState<string>("")
  const [editingAction, setEditingAction] = useState<Action | null>(null)

  useEffect(() => {
    chrome.storage.sync.get({ actions: [] }, (items) => {
      setActions(items.actions)
    })
  }, [])

  const handleSave = () => {
    chrome.storage.sync.set({ actions }, () => {
      setStatus("Options saved successfully!")
      setTimeout(() => setStatus(""), 3000)
    })
  }

  const handleAddAction = () => {
    const newAction: Action = {
      url: "",
      name: "",
      parameter: "",
      context: "page",
      type: ActionType.Background
    }
    setEditingAction(newAction)
  }

  const handleEditAction = (action: Action) => {
    setEditingAction({ ...action })
  }

  const handleDeleteAction = (actionToDelete: Action) => {
    setActions(actions.filter((action) => action !== actionToDelete))
  }

  const handleSaveAction = () => {
    if (editingAction) {
      const actionIndex = actions.findIndex((a) => a.url === editingAction.url)
      if (actionIndex >= 0) {
        // Update existing action
        const newActions = [...actions]
        newActions[actionIndex] = editingAction
        setActions(newActions)
      } else {
        // Add new action
        setActions([...actions, editingAction])
      }
      setEditingAction(null)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-2xl p-8 bg-white rounded-lg shadow-md">
        <h1 className="mb-6 text-3xl font-bold text-gray-800">
          Hookie Options
        </h1>

        <h2 className="mt-8 mb-4 text-2xl font-bold text-gray-800">Actions</h2>
        {actions.map((action, index) => (
          <div
            key={index}
            className="p-4 mb-4 border border-gray-300 rounded-md">
            <h3 className="text-lg font-semibold">{action.name}</h3>
            <p>URL: {action.url}</p>
            <p>Parameter: {action.parameter}</p>
            <p>Type: {action.type}</p>
            <p>Context: {action.context}</p>
            <div className="mt-2">
              <button
                onClick={() => handleEditAction(action)}
                className="px-3 py-1 mr-2 text-white bg-blue-500 rounded">
                Edit
              </button>
              <button
                onClick={() => handleDeleteAction(action)}
                className="px-3 py-1 text-white bg-red-500 rounded">
                Delete
              </button>
            </div>
          </div>
        ))}

        <button
          onClick={handleAddAction}
          className="px-4 py-2 mt-4 text-white bg-green-500 rounded">
          Add Action
        </button>

        {editingAction && (
          <div className="p-4 mt-8 border border-gray-300 rounded-md">
            <h3 className="mb-4 text-xl font-bold">
              {editingAction.url ? "Edit Action" : "New Action"}
            </h3>
            <div className="mb-4">
              <label className="block mb-2">Name:</label>
              <input
                type="text"
                value={editingAction.name}
                onChange={(e) =>
                  setEditingAction({ ...editingAction, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">URL:</label>
              <input
                type="text"
                value={editingAction.url}
                onChange={(e) =>
                  setEditingAction({ ...editingAction, url: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Parameter:</label>
              <input
                type="text"
                value={editingAction.parameter}
                onChange={(e) =>
                  setEditingAction({
                    ...editingAction,
                    parameter: e.target.value
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Type:</label>
              <select
                value={editingAction.type}
                onChange={(e) =>
                  setEditingAction({
                    ...editingAction,
                    type: e.target.value as ActionType
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option value={ActionType.Background}>Background</option>
                <option value={ActionType.Redirect}>Redirect</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-2">Context:</label>
              <select
                value={editingAction.context}
                onChange={(e) =>
                  setEditingAction({
                    ...editingAction,
                    context: e.target.value as chrome.contextMenus.ContextType
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option value="page">Page</option>
                <option value="selection">Selection</option>
                <option value="link">Link</option>
                <option value="image">Image</option>
                <option value="video">Video</option>
                <option value="audio">Audio</option>
              </select>
            </div>
            <button
              onClick={handleSaveAction}
              className="px-4 py-2 text-white bg-indigo-500 rounded">
              Save Action
            </button>
          </div>
        )}

        <button
          onClick={handleSave}
          className="w-full px-4 py-2 mt-8 text-white transition-colors duration-300 bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          Save All Actions
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
