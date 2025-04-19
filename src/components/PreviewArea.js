import React, { useContext, useEffect, useRef, useState }  from "react";
import Icon from "./Icon";
import CatSprite from "../sprites/CatSprite";
import BirdSprite from "../sprites/BirdSprite";
import DogSprite from "../sprites/dogSprite";
import FishSprite from "../sprites/FishSprite";
import RobotSprite from "../sprites/RobotSprite";
import { ScratchContext } from "../context/ScratchContext";

export default function PreviewArea() {
  const {
    sprites,
    selectedSpriteId,
    setSelectedSpriteId,
    isPlaying,
    resetSprites,
    updateSpritePosition,
    updateSpriteRotation,
    setSpriteMessage,
    collisionOccurred
  } = useContext(ScratchContext);

  // Track which sprites are currently being animated
  const [animatingSprites, setAnimatingSprites] = useState(new Set());
  
  const dragState = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    spriteId: null
  });


  const renderSpriteComponent = (spriteType) => {
    switch (spriteType) {
      case "cat":
        return <CatSprite />;
      case "dog":
        return <DogSprite />;
      case "bird":
        return <BirdSprite />;
      case "fish":
        return <FishSprite />;
      case "robot":
        return <RobotSprite />;
      default:
        return <CatSprite />;
    }
  };


  const renderSprite = (sprite) => {
    const spriteStyle = {
      position: "absolute",
      left: `calc(50% + ${sprite.x}px)`,
      top: `calc(50% + ${sprite.y}px)`,
      transform: `translate(-50%, -50%) rotate(${sprite.rotation}deg)`,
      cursor: isPlaying ? "default" : "pointer",
      border: sprite.id === selectedSpriteId ? "2px solid blue" : "none",
      transition: isPlaying ? "all 0.3s ease-out" : "none",
      // Debug styling - adds a visible border
      backgroundColor: "rgba(200, 200, 200, 0.1)",
      padding: "5px",
      borderRadius: "5px",
      width: "60px",
      height: "60px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
     
    };

    const speechBubbleStyle = {
      position: "absolute",
      backgroundColor: "white",
      border: "1px solid black",
      borderRadius: sprite.sayText ? "10px" : "50%",
      padding: "5px 10px",
      minWidth: "80px",
      maxWidth: "150px",
      textAlign: "center",
      top: "-60px",
      left: "30px",
      display: sprite.sayText || sprite.thinkText ? "block" : "none"
    };

    // Show running indicator if the sprite is currently animating
    const isAnimating = animatingSprites.has(sprite.id);

    // Display coordinates for debugging collision detection
    const coordsStyle = {
      position: "absolute",
      bottom: "-20px",
      left: "0",
      fontSize: "10px",
      color: "#666",
      whiteSpace: "nowrap"
    };

    return (
      <div
        key={sprite.id}
        style={spriteStyle}
        onMouseDown={(e) => handleMouseDown(e, sprite)}
        onClick={() => !isPlaying && setSelectedSpriteId(sprite.id)}
  
      >
        {isAnimating && (
          <div className="absolute -top-5 -right-5 w-4 h-4 bg-green-500 rounded-full animate-pulse" />
        )}
        <div style={speechBubbleStyle}>
          {sprite.sayText || sprite.thinkText}
        </div>
        {renderSpriteComponent(sprite.type)}
        {/* <CatSprite /> */}
      </div>
    );
  };

  
  return (
    <div className="w-full h-full overflow-hidden p-2 relative">  
      <div className="absolute top-2 right-2 z-10">
        <button
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 my-2 rounded-md font-bold"
          
        >
          Reset
          <Icon name="redo" size={15} className="text-white mx-2" />
        </button>
      </div>
      <div className="w-full h-full relative    rounded-lg">
        {sprites.map(sprite => renderSprite(sprite))}

      </div>
    </div>
  );
}
