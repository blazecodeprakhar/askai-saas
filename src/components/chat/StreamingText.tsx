import { useState, useEffect, useRef, memo } from 'react';
import { cn } from '@/lib/utils';

interface StreamingTextProps {
  text: string;
  isStreaming?: boolean;
  speed?: number;
  className?: string;
  onComplete?: () => void;
  children?: (displayedText: string, isTyping: boolean) => React.ReactNode;
}

const StreamingText = memo(({ 
  text, 
  isStreaming = false, 
  speed = 2,
  className,
  onComplete,
  children 
}: StreamingTextProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const indexRef = useRef(0);
  const frameRef = useRef<number>();
  const lastTextRef = useRef('');

  useEffect(() => {
    // If text shrinks (new message), reset
    if (text.length < lastTextRef.current.length) {
      indexRef.current = 0;
      setDisplayedText('');
    }
    lastTextRef.current = text;

    if (!isStreaming && text) {
      // If not streaming, show full text immediately
      setDisplayedText(text);
      indexRef.current = text.length;
      setIsTyping(false);
      return;
    }

    if (!text) {
      setDisplayedText('');
      indexRef.current = 0;
      return;
    }

    const animate = () => {
      if (indexRef.current < text.length) {
        setIsTyping(true);
        // Adaptive speed: faster for longer backlogs
        const backlog = text.length - indexRef.current;
        const adaptiveSpeed = backlog > 50 ? Math.min(speed * 3, 8) : speed;
        
        indexRef.current = Math.min(indexRef.current + adaptiveSpeed, text.length);
        setDisplayedText(text.slice(0, indexRef.current));
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setIsTyping(false);
        onComplete?.();
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [text, isStreaming, speed, onComplete]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  if (children) {
    return <>{children(displayedText, isTyping)}</>;
  }

  return (
    <span className={cn("transition-opacity", className)}>
      {displayedText}
      {isTyping && isStreaming && (
        <span className="inline-block w-[2px] h-[1em] bg-foreground/70 ml-0.5 align-middle animate-pulse" />
      )}
    </span>
  );
});

StreamingText.displayName = 'StreamingText';

export default StreamingText;
