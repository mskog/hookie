import "~style.css"

import React, { useEffect, useState } from "react"
import { v4 as uuidv4 } from "uuid"

import type { Action } from "./types"
import { ActionType } from "./types"

const validateAction = (action: Action): string[] => {
  const errors: string[] = []
  if (!action.name.trim()) errors.push("Name is required")
  if (!action.url.trim()) errors.push("URL is required")
  if (!action.parameter.trim()) errors.push("Parameter is required")
  if (!action.context) errors.push("Context is required")
  if (!action.type) errors.push("Type is required")
  if (!action.method) errors.push("HTTP Method is required")
  return errors
}

const ActionList: React.FC<{
  actions: Action[]
  onEdit: (action: Action) => void
  onDelete: (action: Action) => void
}> = ({ actions, onEdit, onDelete }) => (
  <div className="space-y-4">
    {actions.map((action) => (
      <div
        key={action.id}
        className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
        <h3 className="text-lg font-semibold text-gray-800">{action.name}</h3>
        <p className="text-sm text-gray-600">URL: {action.url}</p>
        <p className="text-sm text-gray-600">Parameter: {action.parameter}</p>
        <p className="text-sm text-gray-600">Type: {action.type}</p>
        <p className="text-sm text-gray-600">Context: {action.context}</p>
        <p className="text-sm text-gray-600">HTTP Method: {action.method}</p>
        <div className="mt-3 space-x-2">
          <button
            onClick={() => onEdit(action)}
            className="px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
            Edit
          </button>
          <button
            onClick={() => onDelete(action)}
            className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">
            Delete
          </button>
        </div>
      </div>
    ))}
  </div>
)

const ActionForm: React.FC<{
  action: Action
  onSave: (action: Action) => void
  onCancel: () => void
}> = ({ action, onSave, onCancel }) => {
  const [editingAction, setEditingAction] = useState<Action>(action)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setEditingAction((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h3 className="mb-4 text-xl font-bold text-gray-800">
        {action.id ? "Edit Action" : "New Action"}
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Name:</label>
          <input
            type="text"
            name="name"
            value={editingAction.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">URL:</label>
          <input
            type="text"
            name="url"
            value={editingAction.url}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Parameter:</label>
          <input
            type="text"
            name="parameter"
            value={editingAction.parameter}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Type:</label>
          <select
            name="type"
            value={editingAction.type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value={ActionType.Background}>Background</option>
            <option value={ActionType.Redirect}>Redirect</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Context:</label>
          <select
            name="context"
            value={editingAction.context}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="page">Page</option>
            <option value="selection">Selection</option>
            <option value="link">Link</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
            <option value="audio">Audio</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">HTTP Method:</label>
          <select
            name="method"
            value={editingAction.method}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="GET">GET</option>
            <option value="POST">POST</option>
          </select>
        </div>
      </div>
      <div className="mt-6 space-x-2">
        <button
          onClick={() => onSave(editingAction)}
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
          Save Action
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50">
          Cancel
        </button>
      </div>
    </div>
  )
}

const OptionsPage: React.FC = () => {
  const [actions, setActions] = useState<Action[]>([])
  const [status, setStatus] = useState<string>("")
  const [editingAction, setEditingAction] = useState<Action | null>(null)
  const [activeTab, setActiveTab] = useState<"list" | "form">("list")

  useEffect(() => {
    chrome.storage.sync.get({ actions: [] }, (items) => {
      setActions(items.actions)
    })
  }, [])

  const handleAddAction = () => {
    const newAction: Action = {
      id: uuidv4(),
      url: "",
      name: "",
      parameter: "",
      context: "page",
      type: ActionType.Background,
      method: "GET"
    }
    setEditingAction(newAction)
    setActiveTab("form")
  }

  const handleEditAction = (action: Action) => {
    setEditingAction({ ...action })
    setActiveTab("form")
  }

  const handleDeleteAction = (actionToDelete: Action) => {
    const newActions = actions.filter(
      (action) => action.id !== actionToDelete.id
    )
    setActions(newActions)
    chrome.storage.sync.set({ actions: newActions }, () => {
      setStatus("Action deleted and saved successfully!")
      setTimeout(() => setStatus(""), 3000)
    })
  }

  const handleSaveAction = (actionToSave: Action) => {
    const errors = validateAction(actionToSave)
    if (errors.length > 0) {
      setStatus(errors.join(", "))
      setTimeout(() => setStatus(""), 5000)
      return
    }

    const actionIndex = actions.findIndex((a) => a.id === actionToSave.id)
    let newActions: Action[]
    if (actionIndex >= 0) {
      newActions = [...actions]
      newActions[actionIndex] = actionToSave
    } else {
      newActions = [...actions, actionToSave]
    }
    setActions(newActions)
    chrome.storage.sync.set({ actions: newActions }, () => {
      setStatus("Action saved successfully!")
      setTimeout(() => setStatus(""), 3000)
    })
    setEditingAction(null)
    setActiveTab("list")
  }

  const handleCancelEdit = () => {
    setEditingAction(null)
    setActiveTab("list")
  }

  const handleExport = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(actions, null, 2))
    const downloadAnchorNode = document.createElement("a")
    downloadAnchorNode.setAttribute("href", dataStr)
    downloadAnchorNode.setAttribute("download", "actions.json")
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedActions = JSON.parse(e.target?.result as string)
          const confirmImport = window.confirm(
            `Are you sure you want to import ${importedActions.length} actions? This will replace your current actions.`
          )
          if (confirmImport) {
            setActions(importedActions)
            chrome.storage.sync.set({ actions: importedActions }, () => {
              setStatus("Actions imported and saved successfully!")
              setTimeout(() => setStatus(""), 3000)
            })
          } else {
            setStatus("Import cancelled.")
            setTimeout(() => setStatus(""), 3000)
          }
        } catch (error) {
          setStatus("Error importing actions. Please check the file format.")
          setTimeout(() => setStatus(""), 3000)
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-8">
        <h1 className="mb-6 text-3xl font-bold text-gray-800">
          Hookie Options
        </h1>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              className={`flex-1 py-2 px-4 text-center ${
                activeTab === "list"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setActiveTab("list")}>
              Action List
            </button>
            <button
              className={`flex-1 py-2 px-4 text-center ${
                activeTab === "form"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={handleAddAction}>
              {editingAction ? "Edit Action" : "Add Action"}
            </button>
          </div>

          <div className="p-6">
            {activeTab === "list" ? (
              <ActionList
                actions={actions}
                onEdit={handleEditAction}
                onDelete={handleDeleteAction}
              />
            ) : (
              editingAction && (
                <ActionForm
                  action={editingAction}
                  onSave={handleSaveAction}
                  onCancel={handleCancelEdit}
                />
              )
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={handleExport}
            className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
            Export Actions
          </button>
          <label className="px-4 py-2 text-white bg-green-500 rounded-md cursor-pointer hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
            Import Actions
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </div>

        {status && (
          <div className="mt-4 p-2 text-center text-green-700 bg-green-100 border border-green-400 rounded-md">
            {status}
          </div>
        )}
      </div>
    </div>
  )
}

export default OptionsPage
