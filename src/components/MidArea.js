import { useContext } from "react";
import React from "react";
import Block from "./Block";
import Icon from "./Icon";
import { ScratchContext } from "../context/ScratchContext";
import { v4 as uuidv4 } from "uuid";

export default function MidArea() {
  const { sprites, selectedSpriteId, deleteSprite, setSprites, clearSpriteScripts } = useContext(ScratchContext);

  const handleUpdateBlock = (spriteId, updatedBlock, index) => {
    setSprites(sprites.map(sprite => {
      if (sprite.id === spriteId) {
        const updatedScripts = [...sprite.scripts];
        updatedScripts[index] = updatedBlock;
        return {
          ...sprite,
          scripts: updatedScripts
        };
      }
      return sprite;
    }));
  };

  const handleDeleteBlock = (spriteId, index) => {
    setSprites(sprites.map(sprite => {
      if (sprite.id === spriteId) {
        const updatedScripts = [...sprite.scripts];
        updatedScripts.splice(index, 1);
        return {
          ...sprite,
          scripts: updatedScripts
        };
      }
      return sprite;
    }));
  };

  // Handle drop event for new blocks from sidebar
  const handleDrop = (e, spriteId) => {
    e.preventDefault();
    
    try {
      // Get the block data from drag event
      const blockData = JSON.parse(e.dataTransfer.getData("application/json"));
      
      if (blockData && blockData.type) {
        // Add block to the specific sprite
        setSprites(sprites.map(sprite => {
          if (sprite.id === spriteId) {
            return {
              ...sprite,
              scripts: [...sprite.scripts, {
                id: uuidv4(),
                type: blockData.type,
                subtype: blockData.subtype,
                ...blockData
              }]
            };
          }
          return sprite;
        }));
      }
    } catch (error) {
      console.error("Error handling drop:", error);
    }
  };

  // Handle drag over event
  const handleDragOver = (e) => {
    e.preventDefault();
    try {
      const data = JSON.parse(e.dataTransfer.getData("application/json"));
      e.dataTransfer.dropEffect = data.action === "reorder" ? "move" : "copy";
    } catch {
      e.dataTransfer.dropEffect = "copy";
    }
  };


  return (
    <div className="flex-1 h-full overflow-auto p-4 flex flex-col">
    {sprites.map(sprite => (
      <div 
        key={sprite.id} 
        className={`mb-4 p-3 rounded-lg ${sprite.id === selectedSpriteId ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 border border-gray-200'}`}
        onDrop={(e) => handleDrop(e, sprite.id)}
        onDragOver={handleDragOver}
      >
        <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold">
        Program Your {sprite.name} 
        </h2>
        <div className="flex space-x-2">
          <button
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded-md text-sm"
            onClick={() => clearSpriteScripts(sprite.id)}
            disabled={sprite.scripts.length === 0}
          >
            Clear
          </button>
          {sprites.length > 1 && (
            <button
              className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md text-sm"
              onClick={() => deleteSprite(sprite.id)}
            >
              Delete
            </button>
          )}
        </div>
      </div>
        
        <div className="space-y-1">
          {sprite.scripts.map((block, index) => (
            <div
            key={block.id || index}
           
            >
              <Block
                block={{...block, id: block.id || uuidv4()}}
                onUpdate={(updatedBlock) => handleUpdateBlock(sprite.id, updatedBlock, index)}
                onDelete={() => handleDeleteBlock(sprite.id, index)}
                isDragging={false}
              />
            </div>
          ))}
          
          {sprite.scripts.length === 0 && (
            <div className="text-gray-500 italic">
              Drag blocks from the sidebar to add actions
            </div>
          )}
        </div>
      </div>
    ))}
  </div>
  );
}
