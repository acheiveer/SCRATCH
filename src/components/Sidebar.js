import React, { useContext } from "react";
import Icon from "./Icon";
import { ScratchContext } from "../context/ScratchContext";
import SpriteSelectionModal from "./SpriteSelectionModal";

export default function Sidebar() {
const {
  addBlockToSprite,
  addSprite,
  isPlaying,
  togglePlay,
  spriteModalOpen, 
  openSpriteSelector,
  closeSpriteSelector
} = useContext(ScratchContext);


// Motion blocks
const handleAddMotionBlock = (blockType) => {
  switch (blockType) {
    case "move_steps":
      addBlockToSprite("motion", { subtype: "move_steps", steps: 10 });
      break;
    case "turn_left":
      addBlockToSprite("motion", { subtype: "turn_degrees", direction: "left", degrees: 15 });
      break;
    case "turn_right":
      addBlockToSprite("motion", { subtype: "turn_degrees", direction: "right", degrees: 15 });
      break;
    case "goto_xy":
      addBlockToSprite("motion", { subtype: "goto_xy", x: 0, y: 0 });
      break;
    default:
      break;
  }
};

// Looks blocks
const handleAddLooksBlock = (blockType) => {
  switch (blockType) {
    case "say_for_seconds":
      addBlockToSprite("looks", { subtype: "say_for_seconds", message: "Hello!", duration: 2 });
      break;
    case "think_for_seconds":
      addBlockToSprite("looks", { subtype: "think_for_seconds", message: "Hmm...", duration: 2 });
      break;
    default:
      break;
  }
};

// Control blocks
const handleAddControlBlock = (blockType) => {
  switch (blockType) {
    case "repeat":
      addBlockToSprite("control", { subtype: "repeat", times: 10 });
      break;
    default:
      break;
  }
};

// Handle sprite selection
const handleSelectSprite = (spriteType) => {
  addSprite(spriteType);
};

// Handle drag start event
const handleDragStart = (e, blockType, blockSubtype, blockData) => {
  const dragData = {
    type: blockType,
    subtype: blockSubtype,
    ...blockData
  };
  
  // Set drag data as JSON string
  e.dataTransfer.setData("application/json", JSON.stringify(dragData));
  e.dataTransfer.effectAllowed = "copy"; // Show copy cursor
};

  return (
    <div className="w-50 flex-none h-full overflow-y-auto flex flex-col items-start p-2 border-r border-gray-200">
      <div className="font-bold"> {"Events"} </div>
      <button
        className={`w-full min-w-[150px] flex justify-center items-center gap-2 px-4 py-2 my-2 rounded-md font-bold text-base text-white 
    ${isPlaying ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}
        onClick={togglePlay}
      >
        <Icon name="play" size={15} className="text-white mx-2" />
        {isPlaying ? "Stop" : "Play"}
      </button>
      
      <div className="font-bold mt-4"> {"Motion"} </div>
      <div 
        className="w-full min-w-[150px] flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 text-sm rounded-md font-bold cursor-pointer"
        draggable
        onDragStart={(e) => handleDragStart(e, "motion", "move_steps", { steps: 10 })}
        onClick={() => handleAddMotionBlock("move_steps")}
      >
        {"Move __ steps"}
      </div>
      <div 
        className="w-full min-w-[150px] flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 text-sm rounded-md font-bold cursor-pointer"
        draggable
        onDragStart={(e) => handleDragStart(e, "motion", "turn_degrees", { direction: "left", degrees: 15 })}
        onClick={() => handleAddMotionBlock("turn_left")}
      >
        {"Turn "}
        <Icon name="undo" size={15} className="text-white mx-2" />
        {"__ degrees"}
      </div>
      <div 
        className="w-full min-w-[150px] flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 text-sm rounded-md font-bold cursor-pointer"
        draggable
        onDragStart={(e) => handleDragStart(e, "motion", "turn_degrees", { direction: "right", degrees: 15 })}
        onClick={() => handleAddMotionBlock("turn_right")}
      >
        {"Turn "}
        <Icon name="redo" size={15} className="text-white mx-2" />
        {"__ degrees"}
      </div>
      <div 
        className="w-full min-w-[150px]flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 text-sm rounded-md font-bold cursor-pointer"
        draggable
        onDragStart={(e) => handleDragStart(e, "motion", "goto_xy", { x: 0, y: 0 })}
        onClick={() => handleAddMotionBlock("goto_xy")}
      >
        {"Go to x: __ y: __"}
      </div>
      
      <div className="font-bold mt-4"> {"Looks"} </div>
      <div 
        className="w-full min-w-[150px]flex flex-row flex-wrap bg-purple-500 text-white px-2 py-1 my-2 text-sm rounded-md font-bold cursor-pointer"
        draggable
        onDragStart={(e) => handleDragStart(e, "looks", "say_for_seconds", { message: "Hello!", duration: 2 })}
        onClick={() => handleAddLooksBlock("say_for_seconds")}
      >
        {"Say Hello! for 2 seconds"}
      </div>
      <div 
        className="w-full min-w-[150px] flex flex-row flex-wrap bg-purple-500 text-white px-2 py-1 my-2 text-sm rounded-md font-bold cursor-pointer"
        draggable
        onDragStart={(e) => handleDragStart(e, "looks", "think_for_seconds", { message: "Hmm...", duration: 2 })}
        onClick={() => handleAddLooksBlock("think_for_seconds")}
      >
        {"Think Hmm... for 2 seconds"}
      </div>
      
      <div className="font-bold mt-4"> {"Control"} </div>
      <div 
        className="w-full min-w-[150px] flex flex-row flex-wrap bg-yellow-500 text-white px-2 py-1 my-2 text-sm rounded-md font-bold cursor-pointer"
        draggable
        onDragStart={(e) => handleDragStart(e, "control", "repeat", { times: 10 })}
        onClick={() => handleAddControlBlock("repeat")}
      >
        {"Repeat __ times"}
      </div>
      {/* Sprite Selection Modal */}
      <SpriteSelectionModal 
        isOpen={spriteModalOpen} 
        onClose={closeSpriteSelector} 
        onSelectSprite={handleSelectSprite} 
      />
    </div>
  );
}
