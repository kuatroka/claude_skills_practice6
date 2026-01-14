import { useState } from 'react'
import { Copy, Edit2, Trash2, CheckCircle } from 'lucide-react'
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

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-lg text-gray-900 flex-1">{prompt.name}</h3>
        <div className="flex gap-2 ml-4">
          <button
            onClick={handleCopy}
            className="p-2 text-blue-500 hover:bg-blue-50 rounded transition-colors"
            title="Copy to clipboard"
          >
            {copied ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <Copy className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={() => onEdit(prompt)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
            title="Edit prompt"
          >
            <Edit2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(prompt.id)}
            className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
            title="Delete prompt"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
      <p className="text-gray-700 text-sm whitespace-pre-wrap line-clamp-3 mb-3">
        {prompt.text}
      </p>
      <p className="text-xs text-gray-500">{formatDate(prompt.created_at)}</p>
    </div>
  )
}
