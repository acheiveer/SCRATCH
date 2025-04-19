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

    // State to control collison
    const [collisionOccurred, setCollisionOccurred] = useState(false); 

    
    const swappedPairs = useRef(new Set());
    // Effect to check for collisions while playing
    useEffect(() => {
        if (isPlaying) {
            return () => {
                // Clear swapped pairs when play state changes
                swappedPairs.current.clear();
                setCollisionOccurred(false);
            }
        }
    }, [isPlaying]);

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
        swappedPairs.current.clear(); // Clear swapped pairs on reset
        setCollisionOccurred(false); // Reset collision state
    };

    const resetSprites = () => {
        const newSprites = sprites.map((sprite) => {
            const randomX = Math.floor(Math.random() * 300 - 150);
            const randomY = Math.floor(Math.random() * 300 - 150);
            return {
                ...sprite,
                x: randomX,
                y: randomY,
                rotation: 0,
                sayText: "",
                thinkText: "",
                isExecuting: false,
                scripts: [] // Clear all scripts for each sprite
            };
        });
        setSprites(newSprites);
        setIsPlaying(false); // stop animation if running
        setCollisionOccurred(false); // reset collision state
        
        // Also clear the swapped pairs tracking
        swappedPairs.current.clear();
    };

    const togglePlay = () => {
        if (isPlaying) {
            setSprites(sprites.map(sprite => ({
                ...sprite,
                isExecuting: false,
                sayText: "",
                thinkText: ""
            })));
            swappedPairs.current.clear(); // Clear swapped pairs when stopping
            setCollisionOccurred(false); // Reset collision state
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

            // Then check for collisions with the updated positions
            if (isPlaying) {
                setTimeout(() => {
                    checkCollisionsForSprite(id, x, y, newSprites);
                }, 0);
            }

            return newSprites;
        });
    };

    //Add a new function to check collisions just for a specific sprite
    const checkCollisionsForSprite = (movedSpriteId, x, y, currentSprites) => {
        // Skip if not playing
        if (!isPlaying) return false;

        // Get the sprite that just moved
        const movedSprite = currentSprites.find(s => s.id === movedSpriteId);
        if (!movedSprite || movedSprite.scripts.length === 0) return false;

        // Check for collisions with other sprites
        let collisionDetected = false;

        currentSprites.forEach(otherSprite => {
            // Skip self-collision or sprites without scripts
            if (otherSprite.id === movedSpriteId || otherSprite.scripts.length === 0) {
                return;
            }

            // Generate unique pair key for these sprites
            const pairKey = movedSpriteId < otherSprite.id ?
                `${movedSpriteId}-${otherSprite.id}` :
                `${otherSprite.id}-${movedSpriteId}`;

            // Skip if these sprites have already collided
            if (swappedPairs.current.has(pairKey)) {
                return;
            }

            // Calculate distance between sprites - actual coordinate-based collision detection
            const dx = x - otherSprite.x;
            const dy = y - otherSprite.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Collision threshold - adjust this value based on your sprite sizes
            const collisionThreshold = 50;

            // If sprites are close enough, it's a collision
            if (distance < collisionThreshold) {
                // Visual feedback - make the sprites say something
                setSpriteMessage(movedSpriteId, "say", "Collision!", 1);
                setSpriteMessage(otherSprite.id, "say", "Ouch!", 1);

                // Swap scripts between the two sprites
                const movedSpriteScripts = [...movedSprite.scripts];

                // Update state with the swapped scripts
                setSprites(prevSprites =>
                    prevSprites.map(s => {
                        if (s.id === movedSpriteId) {
                            return {
                                ...s,
                                scripts: [...otherSprite.scripts],
                                isExecuting: false // Reset execution state to trigger animation restart
                            };
                        } else if (s.id === otherSprite.id) {
                            return {
                                ...s,
                                scripts: movedSpriteScripts,
                                isExecuting: false // Reset execution state to trigger animation restart
                            };
                        }
                        return s;
                    })
                );

                // Mark this pair as having swapped
                swappedPairs.current.add(pairKey);

                // Show collision notification
                setCollisionOccurred(true);

                // Reset sprites to executing after a short delay (to re-trigger animations)
                setTimeout(() => {
                    setSprites(prevSprites =>
                        prevSprites.map(s => {
                            if (s.id === movedSpriteId || s.id === otherSprite.id) {
                                return {
                                    ...s,
                                    isExecuting: true // Restart execution with new scripts
                                };
                            }
                            return s;
                        })
                    );

                    // Hide collision notification after delay
                    setTimeout(() => {
                        setCollisionOccurred(false);
                    }, 800); // Show feedback a bit longer
                }, 100);

                collisionDetected = true;
            }
        });

        return collisionDetected;
    };

    const updateSpriteRotation = (id, rotation) => {
        setSprites(prevSprites => prevSprites.map(sprite => {
            if (sprite.id === id) {
                return { ...sprite, rotation };
            }
            return sprite;
        }));
    };

    const setSpriteMessage = (id, type, text, duration) => {
        setSprites(prevSprites => prevSprites.map(sprite => {
            if (sprite.id === id) {
                // Clear any existing message timer
                if (sprite.messageTimer) {
                    clearTimeout(sprite.messageTimer);
                }

                // Set the new message
                let updates = {};
                if (type === "say") {
                    updates = { sayText: text, thinkText: "" };
                } else {
                    updates = { sayText: "", thinkText: text };
                }

                // Set a timer to clear the message after duration (if specified)
                let messageTimer = null;
                if (duration) {
                    messageTimer = setTimeout(() => {
                        setSprites(currentSprites =>
                            currentSprites.map(s =>
                                s.id === id ? { ...s, sayText: "", thinkText: "", messageTimer: null } : s
                            )
                        );
                    }, duration * 1000);
                }

                return { ...sprite, ...updates, messageTimer };
            }
            return sprite;
        }));
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
                setSpriteMessage,
                updateSpriteRotation,
                resetSprites,
                isPlaying,
                togglePlay,
                spriteModalOpen, 
                openSpriteSelector,
                closeSpriteSelector,
                collisionOccurred
            }}
        >
            {children}
        </ScratchContext.Provider>
    );
};