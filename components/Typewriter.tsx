'use client';

import React, { useState, useEffect } from 'react';

interface TypewriterPart {
    text: string;
    className?: string;
}

interface TypewriterProps {
    parts: TypewriterPart[];
    speed?: number; // ms per character
    pauseDuration?: number; // ms to pause after finishing
    loop?: boolean;
    className?: string;
    as?: React.ElementType;
}

const Typewriter: React.FC<TypewriterProps> = ({
    parts,
    speed = 50,
    pauseDuration = 3000,
    loop = true,
    className = '',
    as: Component = 'span'
}) => {
    // Flatten parts into a single character sequence with part index
    const allChars = parts.flatMap((part, partIdx) =>
        part.text.split('').map(char => ({ char, className: part.className, partIdx }))
    );

    const [visibleCount, setVisibleCount] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (isPaused) {
            const timeout = setTimeout(() => {
                if (loop) {
                    setVisibleCount(0);
                    setIsPaused(false);
                }
            }, pauseDuration);
            return () => clearTimeout(timeout);
        }

        if (visibleCount < allChars.length) {
            const timeout = setTimeout(() => {
                setVisibleCount(prev => prev + 1);
            }, speed);
            return () => clearTimeout(timeout);
        } else {
            setIsPaused(true);
        }
    }, [visibleCount, isPaused, allChars.length, speed, pauseDuration, loop]);

    const renderVisibleContent = () => {
        const result: React.ReactNode[] = [];
        let currentWord: React.ReactNode[] = [];
        let wordKey = 0;

        allChars.slice(0, visibleCount).forEach((item, index) => {
            if (item.char === ' ' || item.char === '\n') {
                if (currentWord.length > 0) {
                    result.push(
                        <span key={`word-${wordKey++}`} className="inline-block whitespace-nowrap">
                            {currentWord}
                        </span>
                    );
                    currentWord = [];
                }

                if (item.char === '\n') {
                    result.push(<br key={`br-${index}`} />);
                } else {
                    result.push(
                        <span key={`space-${index}`} style={{ whiteSpace: 'pre' }}>
                            {item.char}
                        </span>
                    );
                }
            } else {
                currentWord.push(
                    <span
                        key={`char-${index}`}
                        className={`${item.className || ''} animate-typing`}
                        style={{ whiteSpace: 'pre' }}
                    >
                        {item.char}
                    </span>
                );
            }
        });

        if (currentWord.length > 0) {
            result.push(
                <span key={`word-${wordKey++}`} className="inline-block whitespace-nowrap">
                    {currentWord}
                </span>
            );
        }

        return result;
    };

    return (
        <Component className={className}>
            {renderVisibleContent()}
            {/* Blinking cursor effect (optional, adding for premium feel) */}
            <span className="animate-pulse border-r-4 border-primary ml-1" />
        </Component>
    );
};

export default Typewriter;
