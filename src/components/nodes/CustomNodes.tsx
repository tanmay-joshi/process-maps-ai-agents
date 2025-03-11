'use client'

import { useState, useCallback } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'

interface NodeData {
  label: string
  onLabelChange?: (id: string, label: string) => void
}

const handleStyle = {
  width: '8px',
  height: '8px',
  background: '#fff',
  border: '2px solid #6366f1',
  borderRadius: '50%',
  zIndex: 1,
}

const commonNodeStyles = {
  padding: '16px 24px',
  border: '1px solid #e2e8f0',
  background: '#ffffff',
  color: '#1f2937',
  fontFamily: 'system-ui, sans-serif',
  fontSize: '14px',
  borderRadius: '8px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  minWidth: '150px',
  minHeight: '50px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const TextInput = ({ value, onChange, onBlur }: { value: string; onChange: (value: string) => void; onBlur: () => void }) => (
  <textarea
    value={value}
    onChange={(e) => onChange(e.target.value)}
    onBlur={onBlur}
    className="w-full h-full bg-transparent text-gray-800 text-center resize-none outline-none font-sans"
    autoFocus
  />
)

export function RectangleNode({ id, data }: NodeProps<NodeData>) {
  const [isEditing, setIsEditing] = useState(false)
  const [labelText, setLabelText] = useState(data.label)

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true)
  }, [])
  
  const handleBlur = useCallback(() => {
    setIsEditing(false)
    data.onLabelChange?.(id, labelText)
  }, [data.onLabelChange, id, labelText])

  return (
    <div
      onDoubleClick={handleDoubleClick}
      className="relative group"
      style={{
        ...commonNodeStyles,
        borderColor: '#e5e7eb',
        background: '#ffffff',
      }}
    >
      <Handle type="target" position={Position.Top} style={handleStyle} />
      <Handle type="target" position={Position.Left} style={handleStyle} />
      <Handle type="source" position={Position.Right} style={handleStyle} />
      <Handle type="source" position={Position.Bottom} style={handleStyle} />
      
      {isEditing ? (
        <TextInput value={labelText} onChange={setLabelText} onBlur={handleBlur} />
      ) : (
        <div className="font-sans">
          {labelText}
        </div>
      )}
      
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gray-50 transition-opacity rounded-lg" />
    </div>
  )
}

export function DiamondNode({ id, data }: NodeProps<NodeData>) {
  const [isEditing, setIsEditing] = useState(false)
  const [labelText, setLabelText] = useState(data.label)

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true)
  }, [])
  
  const handleBlur = useCallback(() => {
    setIsEditing(false)
    data.onLabelChange?.(id, labelText)
  }, [data.onLabelChange, id, labelText])

  const diamondStyle = {
    ...commonNodeStyles,
    width: '140px',
    height: '140px',
    clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
    borderColor: '#e5e7eb',
    background: '#ffffff',
    transform: 'none',
  }

  return (
    <div
      onDoubleClick={handleDoubleClick}
      className="relative group"
      style={diamondStyle}
    >
      <Handle type="target" position={Position.Top} style={handleStyle} />
      <Handle type="target" position={Position.Left} style={handleStyle} />
      <Handle type="source" position={Position.Right} style={handleStyle} />
      <Handle type="source" position={Position.Bottom} style={handleStyle} />
      
      {isEditing ? (
        <TextInput value={labelText} onChange={setLabelText} onBlur={handleBlur} />
      ) : (
        <div className="font-sans">
          {labelText}
        </div>
      )}
      
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gray-50 transition-opacity" />
    </div>
  )
}

export function CircleNode({ id, data }: NodeProps<NodeData>) {
  const [isEditing, setIsEditing] = useState(false)
  const [labelText, setLabelText] = useState(data.label)

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true)
  }, [])
  
  const handleBlur = useCallback(() => {
    setIsEditing(false)
    data.onLabelChange?.(id, labelText)
  }, [data.onLabelChange, id, labelText])

  return (
    <div
      onDoubleClick={handleDoubleClick}
      className="relative group"
      style={{
        ...commonNodeStyles,
        borderRadius: '8px',
        borderColor: '#e5e7eb',
        background: '#ffffff',
      }}
    >
      <Handle type="target" position={Position.Top} style={handleStyle} />
      <Handle type="target" position={Position.Left} style={handleStyle} />
      <Handle type="source" position={Position.Right} style={handleStyle} />
      <Handle type="source" position={Position.Bottom} style={handleStyle} />
      
      {isEditing ? (
        <TextInput value={labelText} onChange={setLabelText} onBlur={handleBlur} />
      ) : (
        <div className="font-sans">
          {labelText}
        </div>
      )}
      
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gray-50 transition-opacity rounded-lg" />
    </div>
  )
}

export function StickyNote({ id, data }: NodeProps<NodeData>) {
  const [isEditing, setIsEditing] = useState(false)
  const [labelText, setLabelText] = useState(data.label)

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true)
  }, [])

  const handleBlur = useCallback(() => {
    setIsEditing(false)
    data.onLabelChange?.(id, labelText)
  }, [data.onLabelChange, id, labelText])

  return (
    <div
      onDoubleClick={handleDoubleClick}
      className="relative group"
      style={{
        ...commonNodeStyles,
        borderColor: '#fef3c7',
        background: '#fffbeb',
        minHeight: '100px',
      }}
    >
      <Handle type="target" position={Position.Top} style={handleStyle} />
      <Handle type="target" position={Position.Left} style={handleStyle} />
      <Handle type="source" position={Position.Right} style={handleStyle} />
      <Handle type="source" position={Position.Bottom} style={handleStyle} />
      
      {isEditing ? (
        <TextInput value={labelText} onChange={setLabelText} onBlur={handleBlur} />
      ) : (
        <div className="font-sans">
          {labelText}
        </div>
      )}
      
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-yellow-50/50 transition-opacity rounded-lg" />
    </div>
  )
} 