import { useState, useEffect, useRef, useCallback } from 'react';

interface UseStreamingTextOptions {
  speed?: number; // Characters per frame
  enabled?: boolean;
}

export function useStreamingText(
  targetText: string,
  options: UseStreamingTextOptions = {}
) {
  const { speed = 3, enabled = true } = options;
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const animationRef = useRef<number>();
  const currentIndexRef = useRef(0);
  const targetRef = useRef(targetText);

  // Update target when it changes
  useEffect(() => {
    targetRef.current = targetText;
  }, [targetText]);

  useEffect(() => {
    if (!enabled) {
      setDisplayedText(targetText);
      setIsTyping(false);
      return;
    }

    const animate = () => {
      const target = targetRef.current;
      
      if (currentIndexRef.current < target.length) {
        setIsTyping(true);
        // Add multiple characters per frame for smoother feel
        const nextIndex = Math.min(currentIndexRef.current + speed, target.length);
        currentIndexRef.current = nextIndex;
        setDisplayedText(target.slice(0, nextIndex));
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsTyping(false);
      }
    };

    // Start animation
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [targetText, speed, enabled]);

  // Reset when target changes significantly (new message)
  useEffect(() => {
    if (targetText.length < currentIndexRef.current) {
      currentIndexRef.current = 0;
      setDisplayedText('');
    }
  }, [targetText]);

  return { displayedText, isTyping, isComplete: displayedText === targetText };
}

// Hook for managing multiple streaming messages
export function useStreamingMessage() {
  const [buffer, setBuffer] = useState('');
  const [displayed, setDisplayed] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const frameRef = useRef<number>();
  const indexRef = useRef(0);

  const appendToBuffer = useCallback((chunk: string) => {
    setBuffer(prev => prev + chunk);
  }, []);

  const reset = useCallback(() => {
    setBuffer('');
    setDisplayed('');
    indexRef.current = 0;
    setIsAnimating(false);
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }
  }, []);

  useEffect(() => {
    if (buffer.length === 0) return;

    const animate = () => {
      if (indexRef.current < buffer.length) {
        setIsAnimating(true);
        // Reveal 2-4 characters per frame for smooth typing
        const charsToAdd = Math.min(3, buffer.length - indexRef.current);
        indexRef.current += charsToAdd;
        setDisplayed(buffer.slice(0, indexRef.current));
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    if (!frameRef.current || indexRef.current >= displayed.length) {
      frameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [buffer]);

  return { 
    displayed, 
    isAnimating, 
    appendToBuffer, 
    reset,
    fullText: buffer 
  };
}
