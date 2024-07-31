import React, { useState } from "react"
import { Action, ActionType } from "../types"

interface ActionFormProps {
  action: Action
  onSave: (action: Action) => void
  onCancel: () => void
}

const validateAction = (action: Action): { [key: string]: string } => {
  const errors: { [key: string]: string } = {}
  if (!action.name.trim()) errors.name = "Name is required"
  if (!action.url.trim()) {
    errors.url = "URL is required"
  } else {
    try {
      new URL(action.url)
    } catch (_) {
      errors.url = "Invalid URL format"
    }
  }
  if (!action.parameter.trim()) errors.parameter = "Parameter is required"
  if (!action.context) errors.context = "Context is required"
  if (!action.type) errors.type = "Type is required"
  if (!action.method) errors.method = "HTTP Method is required"
  return errors
}

const ActionForm: React.FC<ActionFormProps> = ({ action, onSave, onCancel }) => {
  const [editingAction, setEditingAction] = useState<Action>(action)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setEditingAction((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const handleSave = () => {
    const validationErrors = validateAction(editingAction)
    if (Object.keys(validationErrors).length === 0) {
      onSave(editingAction)
    } else {
      setErrors(validationErrors)
    }
  }

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h3 className="mb-4 text-xl font-bold text-gray-800">
        {action.id ? "Edit Action" : "New Action"}
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Name:
          </label>
          <input
            type="text"
            name="name"
            value={editingAction.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
          )}
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            URL:
          </label>
          <input
            type="text"
            name="url"
            value={editingAction.url}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.url ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.url && (
            <p className="mt-1 text-sm text-red-500">{errors.url}</p>
          )}
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Parameter:
          </label>
          <input
            type="text"
            name="parameter"
            value={editingAction.parameter}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.parameter ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.parameter && (
            <p className="mt-1 text-sm text-red-500">{errors.parameter}</p>
          )}
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Type:
          </label>
          <select
            name="type"
            value={editingAction.type}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.type ? "border-red-500" : "border-gray-300"
            }`}>
            <option value={ActionType.Background}>Background</option>
            <option value={ActionType.Redirect}>Redirect</option>
          </select>
          {errors.type && (
            <p className="mt-1 text-sm text-red-500">{errors.type}</p>
          )}
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Context:
          </label>
          <select
            name="context"
            value={editingAction.context}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.context ? "border-red-500" : "border-gray-300"
            }`}>
            <option value="page">Page</option>
            <option value="selection">Selection</option>
            <option value="link">Link</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
            <option value="audio">Audio</option>
          </select>
          {errors.context && (
            <p className="mt-1 text-sm text-red-500">{errors.context}</p>
          )}
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            HTTP Method:
          </label>
          <select
            name="method"
            value={editingAction.method}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.method ? "border-red-500" : "border-gray-300"
            }`}>
            <option value="GET">GET</option>
            <option value="POST">POST</option>
          </select>
          {errors.method && (
            <p className="mt-1 text-sm text-red-500">{errors.method}</p>
          )}
        </div>
      </div>
      <div className="mt-6 space-x-2">
        <button
          onClick={handleSave}
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

export default ActionForm
