import { useState } from 'react'
import { Copy, Edit2, Trash2, Check } from 'lucide-react'
import type { Prompt } from '../db/collections'
import { copyToClipboard, formatDate } from '../lib/utils'

interface PromptCardProps {
  prompt: Prompt
  onEdit: (prompt: Prompt) => void
  onDelete: (id: string) => void
}

export function PromptCard({ prompt, onEdit, onDelete }: PromptCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const success = await copyToClipboard(prompt.text)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDelete = () => {
    if (window.confirm(`Delete "${prompt.name}"?`)) {
      onDelete(prompt.id)
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-gray-900 truncate flex-1">
          {prompt.name}
        </h3>
        <div className="flex gap-1 ml-2">
          <button
            onClick={handleCopy}
            className="p-1.5 rounded hover:bg-gray-100 transition-colors"
            title="Copy to clipboard"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4 text-gray-500" />
            )}
          </button>
          <button
            onClick={() => onEdit(prompt)}
            className="p-1.5 rounded hover:bg-gray-100 transition-colors"
            title="Edit"
          >
            <Edit2 className="w-4 h-4 text-gray-500" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 rounded hover:bg-red-50 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-500" />
          </button>
        </div>
      </div>
      <p className="text-gray-600 text-sm line-clamp-3 mb-3">{prompt.text}</p>
      <p className="text-xs text-gray-400">
        {formatDate(prompt.updated_at)}
      </p>
    </div>
  )
}
