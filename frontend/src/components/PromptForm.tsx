import { useState, useEffect } from 'react'
import type { Prompt } from '../db/collections'
import { generateId } from '../lib/utils'

interface PromptFormProps {
  prompt?: Prompt
  onSubmit: (prompt: Omit<Prompt, 'created_at' | 'updated_at'> & { created_at?: number; updated_at?: number }) => void
  onCancel: () => void
}

export function PromptForm({ prompt, onSubmit, onCancel }: PromptFormProps) {
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (prompt) {
      setName(prompt.name)
      setText(prompt.text)
    }
  }, [prompt])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !text.trim()) {
      alert('Please fill in all fields')
      return
    }

    setIsLoading(true)
    try {
      const now = Date.now()
      const newPrompt = {
        id: prompt?.id || generateId(),
        name: name.trim(),
        text: text.trim(),
        created_at: prompt?.created_at || now,
        updated_at: now,
      }
      await onSubmit(newPrompt)
      setName('')
      setText('')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {prompt ? 'Edit Prompt' : 'New Prompt'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Product Description"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-1">
              Prompt Text
            </label>
            <textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter your prompt here..."
              rows={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : prompt ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
