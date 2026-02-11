import { Copy, Check, FileText, Sparkles, CheckCheck, ThumbsUp, ThumbsDown } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
  type: 'image' | 'document';
}

interface ChatMessageProps {
  role: 'user' | 'ai';
  content: string;
  timestamp?: string;
  isTyping?: boolean;
  isStreaming?: boolean;
  files?: UploadedFile[];
  isDelivered?: boolean;
  isRead?: boolean;
  messageId?: string;
}

// Message reaction component for AI messages
function MessageReactions({ content }: { content: string; messageId?: string }) {
  const [reaction, setReaction] = useState<'up' | 'down' | null>(null);
  const [copied, setCopied] = useState(false);

  const handleReaction = (type: 'up' | 'down') => {
    if (reaction === type) {
      setReaction(null);
    } else {
      setReaction(type);
      if (type === 'up') {
        toast.success('Thanks for the feedback!', { duration: 2000 });
      } else {
        toast('We\'ll try to improve!', { duration: 2000 });
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success('Copied to clipboard!', { duration: 2000 });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-1 mt-2">
      {/* Copy button */}
      <button
        onClick={handleCopy}
        className={cn(
          "p-1.5 rounded-md transition-all duration-150",
          copied
            ? "bg-green-500/20 text-green-500"
            : "hover:bg-muted text-muted-foreground hover:text-foreground"
        )}
        title="Copy message"
      >
        {copied ? (
          <Check className="w-3.5 h-3.5" />
        ) : (
          <Copy className="w-3.5 h-3.5" />
        )}
      </button>

      {/* Divider */}
      <div className="w-px h-4 bg-border/50 mx-0.5" />

      {/* Thumbs up */}
      <button
        onClick={() => handleReaction('up')}
        className={cn(
          "p-1.5 rounded-md transition-all duration-150",
          reaction === 'up'
            ? "bg-green-500/20 text-green-500"
            : "hover:bg-muted text-muted-foreground hover:text-foreground"
        )}
        title="Good response"
      >
        <ThumbsUp className={cn("w-3.5 h-3.5", reaction === 'up' && "fill-current")} />
      </button>

      {/* Thumbs down */}
      <button
        onClick={() => handleReaction('down')}
        className={cn(
          "p-1.5 rounded-md transition-all duration-150",
          reaction === 'down'
            ? "bg-red-500/20 text-red-500"
            : "hover:bg-muted text-muted-foreground hover:text-foreground"
        )}
        title="Bad response"
      >
        <ThumbsDown className={cn("w-3.5 h-3.5", reaction === 'down' && "fill-current")} />
      </button>
    </div>
  );
}

// Enhanced streaming text hook with smooth word-by-word reveal (SDK-style)
function useStreamingText(text: string, isStreaming: boolean) {
  const [displayedText, setDisplayedText] = useState(isStreaming ? '' : text);
  const [isAnimating, setIsAnimating] = useState(false);

  const indexRef = useRef(isStreaming ? 0 : text.length);
  const textRef = useRef(text);
  const frameRef = useRef<number | null>(null);
  const frameCounter = useRef(0);

  // Sync text ref and handle resets
  useEffect(() => {
    // If text shrinks (new conversation or reset), reset index
    if (text.length < indexRef.current) {
      indexRef.current = 0;
      setDisplayedText('');
    }
    textRef.current = text;
  }, [text]);

  useEffect(() => {
    // If not streaming, show full text immediately (history or completion)
    if (!isStreaming) {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      // Ensure we display the full text at the end
      if (text !== displayedText) {
        setDisplayedText(text);
        indexRef.current = text.length;
      }
      setIsAnimating(false);
      return;
    }

    // Animation Loop
    const animate = () => {
      frameCounter.current++;
      // Skip frames to decrease base speed (render every 2 frames)
      if (frameCounter.current % 2 !== 0) {
        frameRef.current = requestAnimationFrame(animate);
        return;
      }

      const currentTarget = textRef.current;
      const currentIndex = indexRef.current;

      if (currentIndex < currentTarget.length) {
        setIsAnimating(true);

        // SDK-style Loading Effect Logic
        const backlog = currentTarget.length - currentIndex;

        // Determine characters to reveal per frame
        // Priority: SMOOTHNESS > Speed.
        // We want a "human-like" or "high-quality AI" feel, which is slightly slower and more deliberate.

        let charsToAdd = 1;

        if (backlog > 200) {
          // If we are REALLY far behind, speed up to catch up
          charsToAdd = 3;
        } else if (backlog > 100) {
          charsToAdd = 2;
        } else {
          // Natural pacing: 
          // Most of the time, add 1 char.
          // Occasionally add 0 (skip a frame) to simulate "thinking" or variable typing speed? 
          // Better: Add 1 char, but maybe skip frames in the loop?
          // Implemented frame skipping logic below via requestAnimationFrame recursion speed.
          charsToAdd = 1;
        }

        const nextIndex = Math.min(currentIndex + charsToAdd, currentTarget.length);
        indexRef.current = nextIndex;
        setDisplayedText(currentTarget.slice(0, nextIndex));

        // Continue loop
        frameRef.current = requestAnimationFrame(animate);
      } else {
        // Finished animating current buffer, but keep loop alive if still streaming?
        // Actually, better to stop and let the dependency 'text' appearing restart if needed?
        // NO. dependency 'text' restarting causes the jitter.
        // We can just stop. The next `useEffect` call or a timer isn't needed
        // because we need to restart the loop if text grows.

        // BUT, since we removed `text` from dependency, who restarts the loop?
        // We need a mechanism to restart the loop if `textRef` changes and we are idle.

        setIsAnimating(false);
        frameRef.current = null;
      }
    };

    // If we are strictly not animating, but we have new text, start!
    if (!frameRef.current && indexRef.current < textRef.current.length) {
      frameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [isStreaming, text]); // Re-introducing text dependency but handling cleanup smarter? 
  // Wait, if I re-introduce 'text', the cleanup runs.

  // Alternative: Do not use `text` in dependency. Use a separate effect to kickstart.

  return { displayedText, isAnimating };
}

function CodeBlock({ code, language }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 rounded-xl overflow-hidden bg-[hsl(0_0%_10%)] border border-border/50 shadow-lg">
      <div className="flex items-center justify-between px-4 py-2.5 bg-[hsl(0_0%_8%)] border-b border-border/30">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="text-xs font-medium text-muted-foreground ml-2">
            {language || 'code'}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-white/5"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-400" />
              <span className="text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto scrollbar-thin text-sm leading-relaxed">
        <code className="font-mono text-foreground/90">{code}</code>
      </pre>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 py-4 animate-fade-in">
      {/* AI Avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary via-primary/80 to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20">
        <Sparkles className="w-4 h-4 text-primary-foreground" />
      </div>

      {/* Typing animation container */}
      <div className="flex flex-col gap-2 pt-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">AskAI</span>
          <span className="text-xs text-muted-foreground">is typing</span>
        </div>

        {/* Animated typing dots */}
        <div className="flex items-center gap-1.5">
          <div className="flex gap-1">
            <span className="w-2 h-2 rounded-full bg-primary/80 typing-dot-pro" />
            <span className="w-2 h-2 rounded-full bg-primary/60 typing-dot-pro" style={{ animationDelay: '0.15s' }} />
            <span className="w-2 h-2 rounded-full bg-primary/40 typing-dot-pro" style={{ animationDelay: '0.3s' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Read receipt component with double checkmarks
function ReadReceipt({ isDelivered, isRead }: { isDelivered?: boolean; isRead?: boolean }) {
  if (!isDelivered && !isRead) return null;

  return (
    <span className="inline-flex items-center ml-1.5">
      {isRead ? (
        <CheckCheck className="w-3.5 h-3.5 text-primary" />
      ) : (
        <CheckCheck className="w-3.5 h-3.5 text-muted-foreground/60" />
      )}
    </span>
  );
}

// Professional blinking cursor like ChatGPT
function StreamingCursor() {
  return (
    <span className="inline-block w-[2px] h-[1.1em] bg-primary ml-0.5 align-middle rounded-full animate-cursor-blink" />
  );
}

// Diamond bullet icon
function DiamondIcon() {
  return (
    <span className="text-primary/60 mr-2.5 text-xs flex-shrink-0 mt-1">◆</span>
  );
}

// Format inline text (bold, italic, code, links)
function formatInlineText(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  // Match URLs, bold (**text**) and inline code (`text`)
  const regex = /(https?:\/\/[^\s<>"{}|\\^`\[\]]+)|(\*\*(.*?)\*\*)|(`([^`]+)`)/g;
  let lastIndex = 0;
  let match;
  let keyIndex = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    if (match[1]) {
      // URL - make it clickable
      const url = match[1];
      parts.push(
        <a
          key={keyIndex++}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
        >
          {url}
        </a>
      );
    } else if (match[2]) {
      // Bold text
      parts.push(
        <strong key={keyIndex++} className="font-semibold text-foreground">
          {match[3]}
        </strong>
      );
    } else if (match[4]) {
      // Inline code
      parts.push(
        <code key={keyIndex++} className="px-1.5 py-0.5 rounded bg-muted text-sm font-mono text-foreground/90">
          {match[5]}
        </code>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length ? parts : [text];
}

// Parse markdown-style formatting including lists and headers
function formatText(text: string): React.ReactNode[] {
  const lines = text.split('\n');
  const result: React.ReactNode[] = [];

  lines.forEach((line, lineIndex) => {
    // Check for headers
    const h3Match = line.match(/^###\s+(.*)$/);
    const h2Match = line.match(/^##\s+(.*)$/);
    const h1Match = line.match(/^#\s+(.*)$/);
    // Check for numbered list items
    const numberedMatch = line.match(/^(\d+)\.\s+(.*)$/);
    // Check for bullet points
    const bulletMatch = line.match(/^[-•*]\s+(.*)$/);

    if (h1Match) {
      result.push(
        <h2 key={lineIndex} className="text-lg font-semibold text-foreground mt-4 mb-2 first:mt-0">
          {formatInlineText(h1Match[1])}
        </h2>
      );
    } else if (h2Match) {
      result.push(
        <h3 key={lineIndex} className="text-base font-semibold text-foreground mt-3 mb-1.5 first:mt-0">
          {formatInlineText(h2Match[1])}
        </h3>
      );
    } else if (h3Match) {
      result.push(
        <h4 key={lineIndex} className="text-sm font-semibold text-foreground mt-2 mb-1 first:mt-0">
          {formatInlineText(h3Match[1])}
        </h4>
      );
    } else if (numberedMatch) {
      result.push(
        <div key={lineIndex} className="flex items-start my-1.5 pl-1">
          <DiamondIcon />
          <span className="flex-1 text-foreground/90">{formatInlineText(numberedMatch[2])}</span>
        </div>
      );
    } else if (bulletMatch) {
      result.push(
        <div key={lineIndex} className="flex items-start my-1.5 pl-1">
          <DiamondIcon />
          <span className="flex-1 text-foreground/90">{formatInlineText(bulletMatch[1])}</span>
        </div>
      );
    } else if (line.trim() === '') {
      result.push(<div key={lineIndex} className="h-2" />);
    } else {
      result.push(
        <p key={lineIndex} className="text-foreground/90 my-0.5">
          {formatInlineText(line)}
        </p>
      );
    }
  });

  return result;
}

function parseContent(content: string) {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const parts: Array<{ type: 'text' | 'code'; content: string; language?: string }> = [];
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: content.slice(lastIndex, match.index) });
    }
    parts.push({ type: 'code', content: match[2].trim(), language: match[1] });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push({ type: 'text', content: content.slice(lastIndex) });
  }

  return parts.length ? parts : [{ type: 'text' as const, content }];
}

// AI message content with streaming effect
function AIMessageContent({
  content,
  isStreaming,
  files
}: {
  content: string;
  isStreaming: boolean;
  files?: UploadedFile[];
}) {
  const { displayedText, isAnimating } = useStreamingText(content, isStreaming);
  const parts = parseContent(displayedText);
  const showCursor = isStreaming || isAnimating;

  if (!content && isStreaming) {
    return <TypingIndicator />;
  }

  return (
    <div className="space-y-1">
      {files && files.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {files.map((file) => (
            <div key={file.id} className="rounded-lg overflow-hidden border border-border/50 shadow-sm">
              {file.type === 'image' && file.preview ? (
                <img
                  src={file.preview}
                  alt={file.file.name}
                  className="max-w-[200px] max-h-[150px] object-cover"
                />
              ) : (
                <div className="flex items-center gap-2 px-3 py-2 bg-muted/30">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs truncate max-w-[120px]">{file.file.name}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <div className="text-sm leading-relaxed">
        {displayedText && parts.map((part, index) =>
          part.type === 'code' ? (
            <CodeBlock key={index} code={part.content} language={part.language} />
          ) : (
            <div key={index}>
              {formatText(part.content)}
              {showCursor && index === parts.length - 1 && part.type === 'text' && (
                <StreamingCursor />
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}

function ChatMessage({ role, content, timestamp, isTyping, isStreaming, files, isDelivered = true, isRead = true, messageId }: ChatMessageProps) {
  const isUser = role === 'user';

  return (
    <div
      className={cn(
        "flex gap-3 w-full message-appear group",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[90%] sm:max-w-[80%] lg:max-w-[75%] min-w-0"
        )}
      >
        {isUser ? (
          // User message - clean pill style
          <div className="flex justify-end">
            <div className="inline-block rounded-2xl px-4 py-2.5 bg-card text-foreground border border-border/50 shadow-sm">
              {files && files.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {files.map((file) => (
                    <div key={file.id} className="rounded-lg overflow-hidden border border-border/30">
                      {file.type === 'image' && file.preview ? (
                        <img
                          src={file.preview}
                          alt={file.file.name}
                          className="max-w-[200px] max-h-[150px] object-cover"
                        />
                      ) : (
                        <div className="flex items-center gap-2 px-3 py-2 bg-muted/30">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          <span className="text-xs truncate max-w-[120px]">{file.file.name}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <p className="text-sm whitespace-pre-wrap">{content}</p>
            </div>
          </div>
        ) : (
          // AI message - professional streaming style
          <div className="text-foreground pl-1">
            {isTyping && !content ? (
              <TypingIndicator />
            ) : (
              <>
                <AIMessageContent
                  content={content}
                  isStreaming={isStreaming || false}
                  files={files}
                />
                {/* Show reactions only when not streaming and has content */}
                {!isStreaming && content && (
                  <MessageReactions content={content} messageId={messageId} />
                )}
              </>
            )}
          </div>
        )}
        {/* Timestamp and read receipt row */}
        {timestamp && !isStreaming && (
          <div
            className={cn(
              "flex items-center gap-1 mt-1.5",
              isUser ? "justify-end pr-1" : "justify-start pl-1"
            )}
          >
            <span className="text-[10px] sm:text-xs text-muted-foreground/70">
              {timestamp}
            </span>
            {isUser && <ReadReceipt isDelivered={isDelivered} isRead={isRead} />}
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatMessage;
