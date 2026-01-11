import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface StorageStats {
  totalConversations: number;
  totalMessages: number;
  userMessages: number;
  assistantMessages: number;
  estimatedStorageKB: number;
  averageMessageLength: number;
  averageMessagesPerChat: number;
  oldestConversation: string | null;
  newestConversation: string | null;
  accountCreatedAt: string | null;
  totalTokensUsed: number;
}

const DEFAULT_STATS: StorageStats = {
  totalConversations: 0,
  totalMessages: 0,
  userMessages: 0,
  assistantMessages: 0,
  estimatedStorageKB: 0,
  averageMessageLength: 0,
  averageMessagesPerChat: 0,
  oldestConversation: null,
  newestConversation: null,
  accountCreatedAt: null,
  totalTokensUsed: 0,
};

// Estimate storage: ~1 byte per character, plus overhead
function estimateStorageKB(totalChars: number, messageCount: number): number {
  // Each message has overhead (id, timestamps, role, etc) ~200 bytes
  const overhead = messageCount * 200;
  const contentBytes = totalChars;
  return Math.round((overhead + contentBytes) / 1024 * 100) / 100;
}

export function useStorageStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<StorageStats>(DEFAULT_STATS);
  const [isLoading, setIsLoading] = useState(false);

  const fetchStats = useCallback(async () => {
    if (!user) {
      setStats(DEFAULT_STATS);
      return;
    }

    setIsLoading(true);

    try {
      // Fetch conversations, user_usage, and profile in parallel
      const [conversationsResult, usageResult, profileResult] = await Promise.all([
        supabase
          .from('conversations')
          .select('id, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true }),
        supabase
          .from('user_usage')
          .select('token_count')
          .eq('user_id', user.id)
          .maybeSingle(),
        supabase
          .from('profiles')
          .select('created_at')
          .eq('user_id', user.id)
          .maybeSingle(),
      ]);

      if (conversationsResult.error) {
        console.error('Error fetching conversations:', conversationsResult.error);
        setIsLoading(false);
        return;
      }

      const conversations = conversationsResult.data;
      const conversationIds = conversations?.map(c => c.id) || [];
      const totalConversations = conversations?.length || 0;
      const oldestConversation = conversations?.[0]?.created_at || null;
      const newestConversation = conversations?.[conversations.length - 1]?.created_at || null;
      const accountCreatedAt = profileResult.data?.created_at || null;
      const totalTokensUsed = usageResult.data?.token_count || 0;

      if (conversationIds.length === 0) {
        setStats({
          ...DEFAULT_STATS,
          oldestConversation,
          newestConversation,
          accountCreatedAt,
          totalTokensUsed,
        });
        setIsLoading(false);
        return;
      }

      // Fetch all messages for these conversations
      const { data: messages, error: msgError } = await supabase
        .from('messages')
        .select('role, content')
        .in('conversation_id', conversationIds);

      if (msgError) {
        console.error('Error fetching messages:', msgError);
        setIsLoading(false);
        return;
      }

      const totalMessages = messages?.length || 0;
      const userMessages = messages?.filter(m => m.role === 'user').length || 0;
      const assistantMessages = messages?.filter(m => m.role === 'assistant').length || 0;
      
      // Calculate total characters for storage estimation
      const totalChars = messages?.reduce((sum, m) => sum + (m.content?.length || 0), 0) || 0;
      const averageMessageLength = totalMessages > 0 ? Math.round(totalChars / totalMessages) : 0;
      const averageMessagesPerChat = totalConversations > 0 ? Math.round((totalMessages / totalConversations) * 10) / 10 : 0;
      const estimatedStorageKB = estimateStorageKB(totalChars, totalMessages);

      setStats({
        totalConversations,
        totalMessages,
        userMessages,
        assistantMessages,
        estimatedStorageKB,
        averageMessageLength,
        averageMessagesPerChat,
        oldestConversation,
        newestConversation,
        accountCreatedAt,
        totalTokensUsed,
      });
    } catch (error) {
      console.error('Error fetching storage stats:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Initial fetch
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Subscribe to realtime updates for messages
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('storage-stats-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
        },
        () => {
          fetchStats();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchStats]);

  // Format storage for display
  const formatStorage = (kb: number): string => {
    if (kb < 1) return '< 1 KB';
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    if (mb < 1024) return `${mb.toFixed(2)} MB`;
    const gb = mb / 1024;
    return `${gb.toFixed(2)} GB`;
  };

  return {
    stats,
    isLoading,
    fetchStats,
    formatStorage,
  };
}
