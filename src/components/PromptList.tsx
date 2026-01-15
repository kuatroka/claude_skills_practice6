import { PromptCard } from './PromptCard'
import type { Prompt } from '../db/collections'

interface PromptListProps {
  prompts: Prompt[]
  isLoading: boolean
  onEdit: (prompt: Prompt) => void
  onDelete: (id: string) => void
}

export function PromptList({
  prompts,
  isLoading,
  onEdit,
  onDelete,
}: PromptListProps) {
  // Show skeleton cards during initial load when no cached data exists
  if (isLoading && prompts.length === 0) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="animate-pulse rounded-lg border border-gray-200 bg-white p-4 h-40"
          >
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
            <div className="h-4 bg-gray-100 rounded w-full mb-2" />
            <div className="h-4 bg-gray-100 rounded w-5/6 mb-2" />
            <div className="h-3 bg-gray-50 rounded w-1/3 mt-4" />
          </div>
        ))}
      </div>
    )
  }

  if (prompts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No prompts found</p>
        <p className="text-sm text-gray-400 mt-1">
          Create your first prompt to get started
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {prompts.map((prompt) => (
        <PromptCard
          key={prompt.id}
          prompt={prompt}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
