import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

export function useChat() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const streamChat = useCallback(async ({
    messages,
    onDelta,
    onDone,
    onError,
  }: {
    messages: { role: string; content: string }[];
    onDelta: (deltaText: string) => void;
    onDone: () => void;
    onError: (error: string) => void;
  }) => {
    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages }),
      });

      if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({ error: "Request failed" }));
        
        if (resp.status === 429) {
          onError("Rate limit exceeded. Please wait a moment and try again.");
          return;
        }
        if (resp.status === 402) {
          onError("Usage limit reached. Please upgrade your plan.");
          return;
        }
        
        onError(errorData.error || "Failed to get response");
        return;
      }

      if (!resp.body) {
        onError("No response body");
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) onDelta(content);
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Final flush
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) onDelta(content);
          } catch { /* ignore */ }
        }
      }

      onDone();
    } catch (error) {
      console.error("Stream error:", error);
      onError("Connection error. Please try again.");
    }
  }, []);

  const saveMessageToDb = useCallback(async (
    conversationId: string,
    role: 'user' | 'assistant',
    content: string
  ) => {
    if (!user) return;
    
    const { error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        user_id: user.id,
        role,
        content,
      });

    if (error) {
      console.error('Error saving message:', error);
    }
  }, [user]);

  const createConversation = useCallback(async (title: string = 'New Chat') => {
    if (!user) return null;
    
    const { data, error } = await supabase
      .from('conversations')
      .insert({
        user_id: user.id,
        title,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating conversation:', error);
      return null;
    }
    
    return data;
  }, [user]);

  const updateUsage = useCallback(async (messageCount: number = 1, tokenCount: number = 0) => {
    if (!user) return;

    // Check if usage record exists
    const { data: existing } = await supabase
      .from('user_usage')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (existing) {
      await supabase
        .from('user_usage')
        .update({
          message_count: existing.message_count + messageCount,
          token_count: existing.token_count + tokenCount,
        })
        .eq('user_id', user.id);
    } else {
      await supabase
        .from('user_usage')
        .insert({
          user_id: user.id,
          message_count: messageCount,
          token_count: tokenCount,
        });
    }
  }, [user]);

  const convertGuestChats = useCallback(async (
    guestMessages: { role: 'user' | 'assistant'; content: string }[]
  ) => {
    if (!user || guestMessages.length === 0) return null;

    try {
      // Create a new conversation for the guest messages
      const conversation = await createConversation('Continued from Guest');
      if (!conversation) return null;

      // Save all guest messages to the database
      for (const msg of guestMessages) {
        await saveMessageToDb(conversation.id, msg.role, msg.content);
      }

      toast.success('Your chat history has been saved!');
      return conversation;
    } catch (error) {
      console.error('Error converting guest chats:', error);
      toast.error('Failed to save chat history');
      return null;
    }
  }, [user, createConversation, saveMessageToDb]);

  return {
    isLoading,
    setIsLoading,
    streamChat,
    saveMessageToDb,
    createConversation,
    updateUsage,
    convertGuestChats,
  };
}
