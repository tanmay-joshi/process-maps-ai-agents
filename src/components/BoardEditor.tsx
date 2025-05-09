'use client'

import dynamic from 'next/dynamic'
import { useCallback, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Connection,
  Edge,
  Node,
  DefaultEdgeOptions,
  applyNodeChanges,
  applyEdgeChanges,
  Background,
  Controls,
  MiniMap,
} from 'reactflow'
import { RectangleNode, DiamondNode, CircleNode, StickyNote } from '@/components/nodes/CustomNodes'
import { CustomEdge } from '@/components/edges/CustomEdge'
import 'reactflow/dist/style.css'

// Dynamically import ReactFlow with no SSR
const ReactFlow = dynamic(
  async () => {
    const { default: ReactFlow } = await import('reactflow')
    return ReactFlow
  },
  { ssr: false }
)

// Dynamically import ReactFlow components
const ReactFlowBackground = dynamic(() => import('reactflow').then((mod) => mod.Background), { ssr: false })
const ReactFlowControls = dynamic(() => import('reactflow').then((mod) => mod.Controls), { ssr: false })
const ReactFlowMiniMap = dynamic(() => import('reactflow').then((mod) => mod.MiniMap), { ssr: false })

const nodeTypes = {
  rectangle: RectangleNode,
  diamond: DiamondNode,
  circle: CircleNode,
  sticky: StickyNote,
}

const edgeTypes = {
  custom: CustomEdge,
}

interface BoardEditorProps {
  id: string
}

export function BoardEditor({ id }: BoardEditorProps) {
  const router = useRouter()
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [aiPrompt, setAiPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [boardName, setBoardName] = useState('')

  // Load board data
  useEffect(() => {
    const loadBoard = async () => {
      try {
        const response = await fetch(`/api/boards/${id}`)
        if (!response.ok) {
          throw new Error('Failed to load board')
        }
        const data = await response.json()
        setBoardName(data.name)
        
        // Add onLabelChange to each node's data
        const nodesWithCallback = data.nodes.map((node: Node) => ({
          ...node,
          data: {
            ...node.data,
            onLabelChange: handleLabelChange,
          },
        }))
        
        setNodes(nodesWithCallback)
        setEdges(data.edges)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while loading the board')
      } finally {
        setIsLoading(false)
      }
    }

    loadBoard()
  }, [id])

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => [...eds, params as Edge]),
    []
  )

  const onNodesChange = useCallback(
    (changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  )

  const onEdgesChange = useCallback(
    (changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  )

  const handleLabelChange = useCallback((nodeId: string, label: string) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              label,
            },
          }
        }
        return node
      })
    )
  }, [])

  const addShape = (type: string) => {
    const newNode: Node = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      position: { x: 100, y: 100 },
      data: { 
        label: type === 'sticky' ? 'Type your note here...' : 'New Shape',
        onLabelChange: handleLabelChange,
      },
      draggable: true,
    }
    setNodes((nds) => [...nds, newNode])
  }

  const handleSave = async () => {
    setIsSaving(true)
    setError(null)
    try {
      const response = await fetch(`/api/boards/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nodes, edges }),
      })

      if (!response.ok) {
        throw new Error('Failed to save board')
      }

      // Show success state briefly before navigating
      setTimeout(() => {
        router.push('/')
      }, 500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while saving')
    } finally {
      setIsSaving(false)
    }
  }

  const handleExit = () => {
    router.push('/')
  }

  const handleAiGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!aiPrompt.trim()) return

    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: aiPrompt }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate diagram')
      }

      const data = await response.json()

      // Add onLabelChange to each node's data
      const nodesWithCallback = data.nodes.map((node: Node) => ({
        ...node,
        draggable: true,
        data: {
          ...node.data,
          onLabelChange: handleLabelChange,
        },
      }))

      // Add generated nodes and edges to the board
      setNodes((nds) => [...nds, ...nodesWithCallback])
      setEdges((eds) => [...eds, ...data.edges])

      // Clear the input
      setAiPrompt('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while generating diagram')
    } finally {
      setIsGenerating(false)
    }
  }

  const defaultEdgeOptions: DefaultEdgeOptions = {
    type: 'custom',
    style: { stroke: '#6366f1', strokeWidth: 2 },
    animated: false,
    markerEnd: 'url(#edge-arrow)',
  }

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-semibold text-gray-900">{boardName}</h1>
            <div className="flex gap-4">
              <button
                onClick={() => addShape('rectangle')}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add Rectangle
              </button>
              <button
                onClick={() => addShape('diamond')}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add Diamond
              </button>
              <button
                onClick={() => addShape('circle')}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add Circle
              </button>
              <button
                onClick={() => addShape('sticky')}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Add Sticky Note
              </button>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            {error && <span className="text-red-500">{error}</span>}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed ${
                isSaving ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSaving ? 'Saving...' : 'Save & Exit'}
            </button>
            <button
              onClick={handleExit}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Exit Without Saving
            </button>
          </div>
        </div>
      </div>
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          snapToGrid={true}
          snapGrid={[20, 20]}
        >
          <ReactFlowBackground gap={20} size={1} />
          <ReactFlowControls />
          <ReactFlowMiniMap />
          
          {/* Add SVG definitions for edge markers */}
          <svg style={{ position: 'absolute', height: 0 }}>
            <defs>
              <marker
                id="edge-arrow"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#6366f1" />
              </marker>
            </defs>
          </svg>
        </ReactFlow>
        
        {/* AI Input Box */}
        <div className="absolute bottom-8 left-8 w-96 bg-white p-4 rounded-lg shadow-lg">
          <form onSubmit={handleAiGenerate} className="flex flex-col gap-2">
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Describe the process flow you want to create..."
              className="w-full p-2 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              disabled={isGenerating}
            />
            <button
              type="submit"
              disabled={isGenerating || !aiPrompt.trim()}
              className={`w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed ${
                isGenerating ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isGenerating ? 'Generating...' : 'Generate Flow'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
} 