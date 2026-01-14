import { useEffect, useState, useCallback } from 'react'
import type { Prompt } from '../db/collections'
import { promptsCollection } from '../db/collections'
import { PromptCard } from './PromptCard'

interface PromptListProps {
  searchQuery: string
  onEdit: (prompt: Prompt) => void
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onDelete: (id: string) => void
}

export function PromptList({ searchQuery, onEdit }: PromptListProps) {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load all prompts from the collection
  useEffect(() => {
    const loadPrompts = async () => {
      console.log('[PROMPTLIST] Loading prompts...')
      setIsLoading(true)
      setError(null)

      try {
        console.log('[PROMPTLIST] Attempting to load from TanStack DB collection...')
        console.log('[PROMPTLIST] promptsCollection:', promptsCollection)

        // Try to get prompts from the TanStack collection
        // For now, this will likely return empty as the TanStack integration
        // with Trailbase may not be fully working
        const allPrompts: Prompt[] = []

        // TODO: Replace with actual collection.subscribe() or collection.getAll()
        // once TanStack DB integration is verified
        console.log('[PROMPTLIST] Currently using empty array fallback')
        console.log('[PROMPTLIST] TanStack DB collection may need debugging')

        setPrompts(allPrompts)
        console.log('[PROMPTLIST] Prompts loaded, count:', allPrompts.length)
        setIsLoading(false)
      } catch (err) {
        console.error('[PROMPTLIST] Failed to load prompts:', err)
        setError('Failed to load prompts')
        setIsLoading(false)
      }
    }

    loadPrompts()
  }, [])

  // Filter prompts based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPrompts(prompts)
    } else {
      const query = searchQuery.toLowerCase()
      setFilteredPrompts(
        prompts.filter(
          (prompt) =>
            prompt.name.toLowerCase().includes(query) ||
            prompt.text.toLowerCase().includes(query)
        )
      )
    }
  }, [prompts, searchQuery])

  const handleDelete = useCallback(
    async (id: string) => {
      console.log('[PROMPTLIST] Delete handler called for id:', id)
      if (!window.confirm('Are you sure you want to delete this prompt?')) {
        console.log('[PROMPTLIST] Delete cancelled by user')
        return
      }

      try {
        console.log('[PROMPTLIST] Deleting prompt from collection...')
        await promptsCollection.delete(id)
        console.log('[PROMPTLIST] Prompt deleted successfully')
        setPrompts(prompts.filter((p) => p.id !== id))
      } catch (err) {
        console.error('[PROMPTLIST] Failed to delete prompt:', err)
        alert('Failed to delete prompt')
      }
    },
    [prompts]
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading prompts...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {error}
      </div>
    )
  }

  if (filteredPrompts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">
          {prompts.length === 0
            ? 'No prompts yet. Create one to get started!'
            : 'No prompts match your search.'}
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {filteredPrompts.map((prompt) => (
        <PromptCard
          key={prompt.id}
          prompt={prompt}
          onEdit={onEdit}
          onDelete={handleDelete}
        />
      ))}
    </div>
  )
}
