import { useState } from 'react'
import { Plus } from 'lucide-react'
import type { Prompt } from './db/collections'
import { SearchBar } from './components/SearchBar'
import { PromptList } from './components/PromptList'
import { PromptForm } from './components/PromptForm'
import { promptsCollection } from './db/collections'
import './index.css'

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [editingPrompt, setEditingPrompt] = useState<Prompt | undefined>()
  const [showForm, setShowForm] = useState(false)

  const handleCreateNew = () => {
    setEditingPrompt(undefined)
    setShowForm(true)
  }

  const handleEdit = (prompt: Prompt) => {
    setEditingPrompt(prompt)
    setShowForm(true)
  }

  const handleFormSubmit = async (
    prompt: Omit<Prompt, 'created_at' | 'updated_at'> & {
      created_at?: number
      updated_at?: number
    }
  ) => {
    console.log('[APP] Form submit handler called with prompt:', prompt)
    try {
      const fullPrompt: Prompt = {
        ...prompt,
        created_at: prompt.created_at || Date.now(),
        updated_at: prompt.updated_at || Date.now(),
      } as Prompt
      console.log('[APP] Full prompt object prepared:', fullPrompt)

      if (editingPrompt) {
        console.log('[APP] Updating existing prompt:', fullPrompt.id)
        await promptsCollection.update(fullPrompt.id, (draft) => {
          Object.assign(draft, fullPrompt)
        })
        console.log('[APP] Prompt updated successfully')
      } else {
        console.log('[APP] Inserting new prompt into collection:', fullPrompt)
        await promptsCollection.insert(fullPrompt)
        console.log('[APP] Prompt inserted successfully')
      }
      console.log('[APP] Form submission completed, closing form and reloading...')
      setShowForm(false)
      setEditingPrompt(undefined)
      // Trigger a refresh (in a real app, you'd use a state management solution)
      window.location.reload()
    } catch (error) {
      console.error('[APP] Failed to save prompt:', error)
      alert('Failed to save prompt')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await promptsCollection.delete(id)
      window.location.reload()
    } catch (error) {
      console.error('Failed to delete prompt:', error)
      alert('Failed to delete prompt')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Prompt Library</h1>
              <p className="text-gray-600 mt-1">
                Build and manage your reusable prompts
              </p>
            </div>
            <button
              onClick={handleCreateNew}
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              New Prompt
            </button>
          </div>

          <div className="w-full max-w-md">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PromptList
          searchQuery={searchQuery}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </main>

      {/* Form Modal */}
      {showForm && (
        <PromptForm
          prompt={editingPrompt}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false)
            setEditingPrompt(undefined)
          }}
        />
      )}
    </div>
  )
}

export default App
