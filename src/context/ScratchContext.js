import React, { createContext, useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

export const ScratchContext = createContext();

export const ScratchProvider = ({ children }) => {
    const [sprites, setSprites] = useState([
        {
            id: uuidv4(),
            name: "Cat",
            x: 0,
            y: 0,
            type: "cat", 
            scripts: [],
            isExecuting: false,
            sayText: "",
            thinkText: "",
            messageTimer: null,
            rotation: 0
        }
    ]);

    const [selectedSpriteId, setSelectedSpriteId] = useState(sprites[0].id);
    const [isPlaying, setIsPlaying] = useState(false);

    // State to control sprite selection modal visibility
    const [spriteModalOpen, setSpriteModalOpen] = useState(false);

    
    const swappedPairs = useRef(new Set());

    const addBlockToSprite = (blockType, blockData) => {
        if (!selectedSpriteId) return;

        setSprites(sprites.map(sprite => {
            if (sprite.id === selectedSpriteId) {
                return {
                    ...sprite,
                    scripts: [...sprite.scripts, {
                        id: uuidv4(),
                        type: blockType,
                        ...blockData
                    }]
                };
            }
            return sprite;
        }));
    };

    const deleteSprite = (spriteId) => {
        // Don't delete if it's the last sprite
        if (sprites.length <= 1) {
            return;
        }

        // Filter out the sprite to be deleted
        const updatedSprites = sprites.filter(sprite => sprite.id !== spriteId);
        setSprites(updatedSprites);

        // If the deleted sprite was selected, select another sprite
        if (selectedSpriteId === spriteId) {
            setSelectedSpriteId(updatedSprites[0]?.id);
        }
    };

    const clearSpriteScripts = (spriteId) => {
        setSprites(sprites.map(sprite => {
          if (sprite.id === spriteId) {
            return {
              ...sprite,
              scripts: [] // Clear all scripts
            };
          }
          return sprite;
        }));
    };


    function capitalizeFirstLetterForSprite(str) {
        if (!str) return "";
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    const addSprite = (spriteType = "cat") => {
        const randomX = Math.floor(Math.random() * 300 - 150); // -150 to +150
        const randomY = Math.floor(Math.random() * 300 - 150);
        const newSprite = {
            id: uuidv4(),
            // name: `Sprite ${sprites.length + 1}`,
            name: `${capitalizeFirstLetterForSprite(spriteType)}`,
            x: randomX,
            y: randomY,
            type: spriteType, // Use the selected sprite type
            scripts: [],
            isExecuting: false,
            sayText: "",
            thinkText: "",
            messageTimer: null,
            rotation: 0
        };
        setSprites([...sprites, newSprite]);
        setSelectedSpriteId(newSprite.id);
    };

    const togglePlay = () => {
        if (isPlaying) {
            setSprites(sprites.map(sprite => ({
                ...sprite,
                isExecuting: false,
                sayText: "",
                thinkText: ""
            })));
        } else {
            setSprites(sprites.map(sprite => ({
                ...sprite,
                isExecuting: true
            })));
        }
        setIsPlaying(!isPlaying);
    };

    // Open sprite selection modal
    const openSpriteSelector = () => {
        setSpriteModalOpen(true);
    };

    // Close sprite selection modal
    const closeSpriteSelector = () => {
        setSpriteModalOpen(false);
    };

    const updateSpritePosition = (id, x, y) => {
        // First update the sprite position
        setSprites(prevSprites => {
            const newSprites = prevSprites.map(sprite => {
                if (sprite.id === id) {
                    return { ...sprite, x, y };
                }
                return sprite;
            });

            return newSprites;
        });
    };

   
    return (
        <ScratchContext.Provider
            value={{  
                sprites, 
                setSprites,
                selectedSpriteId,
                setSelectedSpriteId,
                addBlockToSprite,
                clearSpriteScripts,
                deleteSprite,
                addSprite,
                updateSpritePosition,
                isPlaying,
                togglePlay,
                spriteModalOpen, 
                openSpriteSelector,
                closeSpriteSelector
            }}
        >
            {children}
        </ScratchContext.Provider>
    );
};