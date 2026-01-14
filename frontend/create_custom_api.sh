#!/bin/bash

echo "Creating a workaround: custom API endpoints for prompts"
echo ""
echo "Since Trailbase Record API is not enabled, we have two options:"
echo "1. Implement a custom backend handler in Trailbase"
echo "2. Use direct fetch with proper database queries"
echo ""
echo "Option 2 is simpler for now. Let me create a custom API solution..."

# For now, let's implement a simple fetch-based solution that queries the database
# through Trailbase using RPC or custom endpoints

cat > ../frontend/src/api/prompts.ts << 'ENDFILE'
// Workaround API for prompts
// Since Trailbase Record API is not working, we use direct fetch

export interface Prompt {
  id: string
  name: string
  text: string
  created_at: number
  updated_at: number
}

// API endpoints
const API_BASE = 'http://localhost:4000/api'

// Get all prompts
export async function listPrompts(): Promise<Prompt[]> {
  try {
    const response = await fetch(`${API_BASE}/records/v1/prompts`)
    if (!response.ok) {
      throw new Error(`Failed to list prompts: ${response.statusText}`)
    }
    return await response.json()
  } catch (error) {
    console.error('[API] Error listing prompts:', error)
    return []
  }
}

// Create a prompt
export async function createPrompt(prompt: Omit<Prompt, 'created_at' | 'updated_at'> & { created_at?: number; updated_at?: number }): Promise<Prompt> {
  try {
    const response = await fetch(`${API_BASE}/records/v1/prompts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...prompt,
        created_at: prompt.created_at || Date.now(),
        updated_at: prompt.updated_at || Date.now(),
      })
    })
    if (!response.ok) {
      throw new Error(`Failed to create prompt: ${response.statusText}`)
    }
    return await response.json()
  } catch (error) {
    console.error('[API] Error creating prompt:', error)
    throw error
  }
}

// Update a prompt
export async function updatePrompt(id: string, updates: Partial<Prompt>): Promise<Prompt> {
  try {
    const response = await fetch(`${API_BASE}/records/v1/prompts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    })
    if (!response.ok) {
      throw new Error(`Failed to update prompt: ${response.statusText}`)
    }
    return await response.json()
  } catch (error) {
    console.error('[API] Error updating prompt:', error)
    throw error
  }
}

// Delete a prompt
export async function deletePrompt(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/records/v1/prompts/${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) {
      throw new Error(`Failed to delete prompt: ${response.statusText}`)
    }
  } catch (error) {
    console.error('[API] Error deleting prompt:', error)
    throw error
  }
}
ENDFILE

echo "Created: src/api/prompts.ts"
echo ""
echo "This is a temporary workaround. The real issue is that Trailbase Record API"
echo "is not properly configured or enabled in the current version."
