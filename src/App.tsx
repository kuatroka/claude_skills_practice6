import { useState } from 'react'
import { Plus } from 'lucide-react'
import { SearchInput } from './components/SearchInput'
import { PromptList } from './components/PromptList'
import { PromptForm } from './components/PromptForm'
import { useSearch } from './hooks/useSearch'
import { useDebounce } from './hooks/useDebounce'
import { promptsCollection, type Prompt } from './db/collections'
import { generateId } from './lib/utils'

export function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null)

  const debouncedQuery = useDebounce(searchQuery, 200)
  const { prompts, isLoading } = useSearch(debouncedQuery)

  const handleCreate = (data: { name: string; text: string }) => {
    const now = new Date()
    promptsCollection.insert({
      id: generateId(),
      name: data.name,
      text: data.text,
      created_at: now,
      updated_at: now,
    })
    setShowForm(false)
  }

  const handleUpdate = (data: { name: string; text: string }) => {
    if (!editingPrompt) return
    promptsCollection.update(editingPrompt.id, (draft) => {
      draft.name = data.name
      draft.text = data.text
      draft.updated_at = new Date()
    })
    setEditingPrompt(null)
  }

  const handleDelete = (id: string) => {
    promptsCollection.delete(id)
  }

  const handleEdit = (prompt: Prompt) => {
    setEditingPrompt(prompt)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingPrompt(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-xl font-bold text-gray-900">Prompt Library</h1>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Prompt</span>
            </button>
          </div>
          <div className="mt-4">
            <SearchInput value={searchQuery} onChange={setSearchQuery} />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <PromptList
          prompts={prompts}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </main>

      {(showForm || editingPrompt) && (
        <PromptForm
          prompt={editingPrompt}
          onSubmit={editingPrompt ? handleUpdate : handleCreate}
          onClose={handleCloseForm}
        />
      )}
    </div>
  )
}
