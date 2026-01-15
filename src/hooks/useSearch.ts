import { useLiveQuery, or, ilike } from '@tanstack/react-db'
import { promptsCollection, type Prompt } from '../db/collections'

export function useSearch(searchTerm: string) {
  const term = searchTerm.trim()

  const { data, isLoading } = useLiveQuery(
    (q) => {
      let query = q.from({ prompt: promptsCollection })

      if (term) {
        const pattern = `%${term}%`
        query = query.where(({ prompt }) =>
          or(
            ilike(prompt.name, pattern),
            ilike(prompt.text, pattern)
          )
        )
      }

      return query.orderBy(({ prompt }) => prompt.updated_at, 'desc')
    },
    [term]
  )

  return {
    prompts: (data ?? []) as Prompt[],
    isLoading,
  }
}
