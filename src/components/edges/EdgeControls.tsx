'use client'

import { useState } from 'react'

interface EdgeControlsProps {
  position: { x: number; y: number }
  label: string
  onLabelChange: (newLabel: string) => void
  onArrowStartChange: (hasArrow: boolean) => void
  onArrowEndChange: (hasArrow: boolean) => void
  hasStartArrow: boolean
  hasEndArrow: boolean
}

export function EdgeControls({
  position,
  label,
  onLabelChange,
  onArrowStartChange,
  onArrowEndChange,
  hasStartArrow,
  hasEndArrow,
}: EdgeControlsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [labelText, setLabelText] = useState(label)

  const handleLabelSubmit = () => {
    onLabelChange(labelText)
    setIsEditing(false)
  }

  return (
    <div
      className="absolute bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-50"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -100%) translateY(-20px)',
      }}
    >
      <div className="flex flex-col gap-2">
        {/* Text controls */}
        <div className="flex items-center gap-2">
          {isEditing ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={labelText}
                onChange={(e) => setLabelText(e.target.value)}
                className="px-2 py-1 border rounded text-sm w-40"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleLabelSubmit()
                  }
                }}
              />
              <button
                onClick={handleLabelSubmit}
                className="px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 flex items-center gap-1"
            >
              <span className="material-icons text-sm">edit</span>
              {label ? 'Edit Text' : 'Add Text'}
            </button>
          )}
        </div>

        {/* Arrow controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onArrowStartChange(!hasStartArrow)}
            className={`px-2 py-1 rounded text-sm flex items-center gap-1 ${
              hasStartArrow ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'
            }`}
          >
            <span className="material-icons text-sm transform rotate-180">arrow_forward</span>
            Start Arrow
          </button>
          <button
            onClick={() => onArrowEndChange(!hasEndArrow)}
            className={`px-2 py-1 rounded text-sm flex items-center gap-1 ${
              hasEndArrow ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'
            }`}
          >
            <span className="material-icons text-sm">arrow_forward</span>
            End Arrow
          </button>
        </div>
      </div>
    </div>
  )
} 