import React from 'react'

export default function Block() {
  return (
   
      <div className="flex justify-between items-center">
        <div className="flex-1">{renderBlockContent()}</div>
        <button
          className="ml-2 text-xs bg-red-600 hover:bg-red-700 text-white px-1 rounded"
          onClick={onDelete}
        >
          ✕
        </button>
      </div>
    
  )
}

