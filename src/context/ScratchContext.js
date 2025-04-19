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
    
    const swappedPairs = useRef(new Set());

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

   
    return (
        <ScratchContext.Provider
            value={{   
                setSprites,
                setSelectedSpriteId,
                addSprite,
                isPlaying,
                togglePlay,
            }}
        >
            {children}
        </ScratchContext.Provider>
    );
};