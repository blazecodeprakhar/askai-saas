import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

// Helper to categorize by date
function getDateCategory(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);
  const lastMonth = new Date(today);
  lastMonth.setDate(lastMonth.getDate() - 30);

  if (date >= today) return 'Today';
  if (date >= yesterday) return 'Yesterday';
  if (date >= lastWeek) return 'Last 7 Days';
  if (date >= lastMonth) return 'Last 30 Days';
  return 'Older';
}

export function useConversations() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all conversations for the user
  const fetchConversations = useCallback(async () => {
    if (!user) {
      setConversations([]);
      return;
    }

    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching conversations:', error);
      return;
    }

    setConversations(data || []);
  }, [user]);

  // Fetch messages for a specific conversation
  const fetchMessages = useCallback(async (conversationId: string) => {
    if (!user) return;

    setIsLoading(true);
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    setIsLoading(false);

    if (error) {
      console.error('Error fetching messages:', error);
      return;
    }

    setMessages(data?.map(m => ({
      id: m.id,
      role: m.role as 'user' | 'assistant',
      content: m.content,
      created_at: m.created_at,
    })) || []);
  }, [user]);

  // Select a conversation and load its messages
  const selectConversation = useCallback(async (conversationId: string) => {
    setActiveConversationId(conversationId);
    await fetchMessages(conversationId);
  }, [fetchMessages]);

  // Create a new conversation
  const createConversation = useCallback(async (title: string = 'New Chat') => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('conversations')
      .insert({ user_id: user.id, title })
      .select()
      .single();

    if (error) {
      console.error('Error creating conversation:', error);
      return null;
    }

    // Add to local state immediately
    setConversations(prev => [data, ...prev]);
    setActiveConversationId(data.id);
    setMessages([]);
    
    return data;
  }, [user]);

  // Update conversation title
  const updateConversationTitle = useCallback(async (conversationId: string, title: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('conversations')
      .update({ title, updated_at: new Date().toISOString() })
      .eq('id', conversationId);

    if (error) {
      console.error('Error updating conversation title:', error);
      return;
    }

    setConversations(prev =>
      prev.map(c => c.id === conversationId ? { ...c, title, updated_at: new Date().toISOString() } : c)
    );
  }, [user]);

  // Delete a conversation
  const deleteConversation = useCallback(async (conversationId: string) => {
    if (!user) return;

    // First delete all messages in the conversation
    await supabase
      .from('messages')
      .delete()
      .eq('conversation_id', conversationId);

    // Then delete the conversation
    const { error } = await supabase
      .from('conversations')
      .delete()
      .eq('id', conversationId);

    if (error) {
      console.error('Error deleting conversation:', error);
      return;
    }

    setConversations(prev => prev.filter(c => c.id !== conversationId));
    
    if (activeConversationId === conversationId) {
      setActiveConversationId(null);
      setMessages([]);
    }
  }, [user, activeConversationId]);

  // Delete all conversations
  const deleteAllConversations = useCallback(async () => {
    if (!user) return;

    // Get all conversation IDs
    const conversationIds = conversations.map(c => c.id);
    
    if (conversationIds.length === 0) return;

    // Delete all messages first
    for (const id of conversationIds) {
      await supabase.from('messages').delete().eq('conversation_id', id);
    }

    // Delete all conversations
    const { error } = await supabase
      .from('conversations')
      .delete()
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting all conversations:', error);
      return;
    }

    setConversations([]);
    setActiveConversationId(null);
    setMessages([]);
  }, [user, conversations]);

  // Save a message to the database
  const saveMessage = useCallback(async (
    conversationId: string,
    role: 'user' | 'assistant',
    content: string
  ) => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        user_id: user.id,
        role,
        content,
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving message:', error);
      return null;
    }

    // Update conversation's updated_at
    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId);

    return data;
  }, [user]);

  // Start a new chat (clear current state)
  const startNewChat = useCallback(() => {
    setActiveConversationId(null);
    setMessages([]);
  }, []);

  // Group conversations by date
  const groupedConversations = conversations.reduce((acc, conv) => {
    const category = getDateCategory(conv.updated_at);
    if (!acc[category]) acc[category] = [];
    acc[category].push(conv);
    return acc;
  }, {} as Record<string, Conversation[]>);

  // Initial fetch
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Subscribe to realtime updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('conversations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchConversations]);

  return {
    conversations,
    groupedConversations,
    activeConversationId,
    messages,
    isLoading,
    selectConversation,
    createConversation,
    updateConversationTitle,
    deleteConversation,
    deleteAllConversations,
    saveMessage,
    startNewChat,
    fetchConversations,
    setMessages,
    setActiveConversationId,
  };
}
