'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

interface Board {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

export default function Home() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [boards, setBoards] = useState<Board[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await fetch('/api/boards')
        if (!response.ok) {
          throw new Error('Failed to fetch boards')
        }
        const data = await response.json()
        setBoards(data)
      } catch (error) {
        console.error('Error fetching boards:', error)
      } finally {
        setLoading(false)
      }
    }

    if (session) {
      fetchBoards()
    }
  }, [session])

  const handleCreateBoard = () => {
    router.push('/boards/new')
  }

  const handleOpenBoard = (boardId: string) => {
    router.push(`/boards/${boardId}`)
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Your Process Maps</h1>
          <button
            onClick={handleCreateBoard}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Create New Map
          </button>
        </div>

        {boards.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">You haven't created any process maps yet.</p>
            <button
              onClick={handleCreateBoard}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Create Your First Map
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {boards.map((board) => (
              <div
                key={board.id}
                onClick={() => handleOpenBoard(board.id)}
                className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-medium text-gray-900 mb-2">{board.name}</h3>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Created: {new Date(board.createdAt).toLocaleDateString()}</span>
                  <span>Updated: {new Date(board.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
