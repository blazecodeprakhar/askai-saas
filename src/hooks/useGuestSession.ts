import { useState, useEffect, useCallback } from 'react';

const GUEST_LIMIT = 12; // 10-15 as specified
const GUEST_SESSION_KEY = 'askai_guest_session';

export interface GuestMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface GuestSession {
  messages: GuestMessage[];
  promptCount: number;
  sessionId: string;
}

export function useGuestSession() {
  const [session, setSession] = useState<GuestSession | null>(null);
  const [isLimitReached, setIsLimitReached] = useState(false);

  // Initialize session from sessionStorage (cleared on tab close)
  useEffect(() => {
    const stored = sessionStorage.getItem(GUEST_SESSION_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as GuestSession;
        setSession(parsed);
        setIsLimitReached(parsed.promptCount >= GUEST_LIMIT);
      } catch {
        // Invalid session, create new one
        createNewSession();
      }
    } else {
      createNewSession();
    }
  }, []);

  const createNewSession = useCallback(() => {
    const newSession: GuestSession = {
      messages: [],
      promptCount: 0,
      sessionId: crypto.randomUUID(),
    };
    setSession(newSession);
    setIsLimitReached(false);
    sessionStorage.setItem(GUEST_SESSION_KEY, JSON.stringify(newSession));
  }, []);

  const addMessage = useCallback((message: GuestMessage, isUserMessage: boolean) => {
    setSession(prev => {
      if (!prev) return prev;
      
      const newPromptCount = isUserMessage ? prev.promptCount + 1 : prev.promptCount;
      const updated: GuestSession = {
        ...prev,
        messages: [...prev.messages, message],
        promptCount: newPromptCount,
      };
      
      sessionStorage.setItem(GUEST_SESSION_KEY, JSON.stringify(updated));
      
      if (newPromptCount >= GUEST_LIMIT) {
        setIsLimitReached(true);
      }
      
      return updated;
    });
  }, []);

  const updateLastAssistantMessage = useCallback((content: string) => {
    setSession(prev => {
      if (!prev) return prev;
      
      const messages = [...prev.messages];
      const lastIndex = messages.length - 1;
      
      if (lastIndex >= 0 && messages[lastIndex].role === 'assistant') {
        messages[lastIndex] = { ...messages[lastIndex], content };
      }
      
      const updated: GuestSession = { ...prev, messages };
      sessionStorage.setItem(GUEST_SESSION_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearSession = useCallback(() => {
    sessionStorage.removeItem(GUEST_SESSION_KEY);
    createNewSession();
  }, [createNewSession]);

  const getMessagesForConversion = useCallback(() => {
    return session?.messages || [];
  }, [session]);

  const remainingPrompts = session ? GUEST_LIMIT - session.promptCount : GUEST_LIMIT;

  return {
    messages: session?.messages || [],
    promptCount: session?.promptCount || 0,
    remainingPrompts,
    isLimitReached,
    addMessage,
    updateLastAssistantMessage,
    clearSession,
    getMessagesForConversion,
    GUEST_LIMIT,
  };
}
