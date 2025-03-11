'use client'

import { useState, useCallback } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'

interface NodeData {
  label: string
  onLabelChange?: (id: string, label: string) => void
}

function TextInput({ value, onChange, onBlur }: { 
  value: string, 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  onBlur: () => void 
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      className="bg-transparent text-center focus:outline-none w-full"
    />
  )
}

export function RectangleNode({ id, data }: NodeProps<NodeData>) {
  const [isEditing, setIsEditing] = useState(false)
  const [labelText, setLabelText] = useState(data.label)

  const handleDoubleClick = () => setIsEditing(true)
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLabelText(e.target.value)
  }

  const handleBlur = () => {
    setIsEditing(false)
    data.onLabelChange?.(id, labelText)
  }

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <Handle type="target" position={Position.Left} />
      <div 
        className="px-4 py-2 border-2 border-gray-600 rounded bg-white min-w-[150px] min-h-[50px] flex items-center justify-center"
        onDoubleClick={handleDoubleClick}
      >
        {isEditing ? (
          <TextInput value={labelText} onChange={handleChange} onBlur={handleBlur} />
        ) : (
          <span>{labelText}</span>
        )}
      </div>
      <Handle type="source" position={Position.Right} />
      <Handle type="source" position={Position.Bottom} />
    </>
  )
}

export function DiamondNode({ id, data }: NodeProps<NodeData>) {
  const [isEditing, setIsEditing] = useState(false)
  const [labelText, setLabelText] = useState(data.label)

  const handleDoubleClick = () => setIsEditing(true)
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLabelText(e.target.value)
  }

  const handleBlur = () => {
    setIsEditing(false)
    data.onLabelChange?.(id, labelText)
  }

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <Handle type="target" position={Position.Left} />
      <div 
        className="px-4 py-2 border-2 border-gray-600 bg-white min-w-[100px] min-h-[100px] flex items-center justify-center rotate-45"
        onDoubleClick={handleDoubleClick}
      >
        <div className="-rotate-45">
          {isEditing ? (
            <TextInput value={labelText} onChange={handleChange} onBlur={handleBlur} />
          ) : (
            <span>{labelText}</span>
          )}
        </div>
      </div>
      <Handle type="source" position={Position.Right} />
      <Handle type="source" position={Position.Bottom} />
    </>
  )
}

export function CircleNode({ id, data }: NodeProps<NodeData>) {
  const [isEditing, setIsEditing] = useState(false)
  const [labelText, setLabelText] = useState(data.label)

  const handleDoubleClick = () => setIsEditing(true)
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLabelText(e.target.value)
  }

  const handleBlur = () => {
    setIsEditing(false)
    data.onLabelChange?.(id, labelText)
  }

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <Handle type="target" position={Position.Left} />
      <div 
        className="px-4 py-2 border-2 border-gray-600 rounded-full bg-white min-w-[100px] min-h-[100px] flex items-center justify-center"
        onDoubleClick={handleDoubleClick}
      >
        {isEditing ? (
          <TextInput value={labelText} onChange={handleChange} onBlur={handleBlur} />
        ) : (
          <span>{labelText}</span>
        )}
      </div>
      <Handle type="source" position={Position.Right} />
      <Handle type="source" position={Position.Bottom} />
    </>
  )
}

export function StickyNote({ id, data }: NodeProps<NodeData>) {
  const [labelText, setLabelText] = useState(data.label)

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value
    setLabelText(newText)
    data.onLabelChange?.(id, newText)
  }, [id, data])

  return (
    <div className="bg-yellow-100 p-4 rounded shadow-lg min-w-[200px] min-h-[100px] border-b-4 border-yellow-200">
      <textarea
        value={labelText}
        onChange={handleChange}
        className="w-full h-full bg-transparent resize-none focus:outline-none"
        placeholder="Type your note here..."
      />
      <Handle type="source" position={Position.Bottom} />
      <Handle type="target" position={Position.Top} />
    </div>
  )
} 