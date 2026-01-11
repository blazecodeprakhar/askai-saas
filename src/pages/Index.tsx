import { useState, useRef, useEffect } from 'react';
import Sidebar from '@/components/chat/Sidebar';
import Header from '@/components/chat/Header';
import ChatMessage from '@/components/chat/ChatMessage';
import WelcomeScreen from '@/components/chat/WelcomeScreen';
import ChatInput from '@/components/chat/ChatInput';
import { GuestLimitModal } from '@/components/chat/GuestLimitModal';
import { useAuth } from '@/contexts/AuthContext';
import { useGuestSession } from '@/hooks/useGuestSession';
import { useChat } from '@/hooks/useChat';
import { useConversations } from '@/hooks/useConversations';
import { toast } from 'sonner';
import { processMultipleFiles } from '@/lib/documentProcessor';

interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
  type: 'image' | 'document';
}

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: string;
  files?: UploadedFile[];
}

// Generate a smart, short title like ChatGPT
function generateSmartTitle(content: string): string {
  // Remove extra whitespace
  const cleaned = content.trim().replace(/\s+/g, ' ');

  // If it's a question, try to extract the key topic
  const questionWords = ['what', 'how', 'why', 'when', 'where', 'who', 'which', 'can', 'could', 'would', 'should', 'is', 'are', 'do', 'does'];
  const words = cleaned.toLowerCase().split(' ');

  // Check if starts with a question word
  const isQuestion = questionWords.some(qw => words[0] === qw);

  // For questions, try to get the subject
  if (isQuestion && words.length > 2) {
    // Skip common filler words to find the key topic
    const fillerWords = ['i', 'me', 'my', 'you', 'your', 'the', 'a', 'an', 'to', 'for', 'in', 'on', 'at', 'of', 'with', 'about', 'please', 'help'];
    let startIdx = 1;

    // Find first meaningful word after question word
    while (startIdx < words.length && fillerWords.includes(words[startIdx])) {
      startIdx++;
    }

    // Take the key phrase
    const keyWords = cleaned.split(' ').slice(startIdx, startIdx + 4).join(' ');
    if (keyWords.length > 3) {
      const title = keyWords.charAt(0).toUpperCase() + keyWords.slice(1);
      return title.length > 30 ? title.substring(0, 30) + '...' : title;
    }
  }

  // For statements or code requests, capitalize first word and truncate
  const firstSentence = cleaned.split(/[.!?\n]/)[0];

  // Remove common starting phrases
  const starters = ['can you ', 'could you ', 'please ', 'i want ', 'i need ', 'help me ', 'write ', 'create ', 'make '];
  let title = firstSentence;
  for (const starter of starters) {
    if (title.toLowerCase().startsWith(starter)) {
      title = title.substring(starter.length);
      break;
    }
  }

  // Capitalize and truncate
  title = title.charAt(0).toUpperCase() + title.slice(1);

  // Smart truncation - try to end at a word boundary
  if (title.length > 30) {
    const truncated = title.substring(0, 30);
    const lastSpace = truncated.lastIndexOf(' ');
    if (lastSpace > 20) {
      return truncated.substring(0, lastSpace) + '...';
    }
    return truncated + '...';
  }

  return title || 'New Chat';
}

const Index = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const isAutoScrolling = useRef(true);

  const {
    messages: guestMessages,
    isLimitReached,
    addMessage: addGuestMessage,
    updateLastAssistantMessage: updateGuestAssistant,
    clearSession: clearGuestSession,
    remainingPrompts,
    GUEST_LIMIT,
  } = useGuestSession();

  const { streamChat } = useChat();

  const {
    conversations,
    groupedConversations,
    activeConversationId,
    messages: dbMessages,
    selectConversation,
    createConversation,
    updateConversationTitle,
    deleteConversation,
    deleteAllConversations,
    saveMessage,
    startNewChat,
    setActiveConversationId,
  } = useConversations();

  // Smooth scroll to bottom with requestAnimationFrame for better performance
  const scrollToBottom = (force = false) => {
    if (!isAutoScrolling.current && !force) return;

    requestAnimationFrame(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    });
  };

  // Check if user is near bottom (within 100px)
  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    isAutoScrolling.current = isNearBottom;
  };

  // Scroll on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Continuous scroll during streaming
  useEffect(() => {
    if (isStreaming) {
      const interval = setInterval(() => scrollToBottom(), 100);
      return () => clearInterval(interval);
    }
  }, [isStreaming]);

  useEffect(() => {
    document.documentElement.classList.toggle('light', !isDarkMode);
  }, [isDarkMode]);

  // Sync guest messages to display messages when not logged in
  useEffect(() => {
    if (!user && guestMessages.length > 0) {
      const displayMessages: Message[] = guestMessages.map(msg => ({
        id: msg.id,
        role: msg.role === 'user' ? 'user' : 'ai',
        content: msg.content,
        timestamp: msg.timestamp,
      }));
      setMessages(displayMessages);
    }
  }, [user, guestMessages]);

  // Sync database messages when logged in and conversation selected
  useEffect(() => {
    if (user && dbMessages.length > 0) {
      const displayMessages: Message[] = dbMessages.map(msg => ({
        id: msg.id,
        role: msg.role === 'user' ? 'user' : 'ai',
        content: msg.content,
        timestamp: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }));
      setMessages(displayMessages);
      setCurrentConversationId(activeConversationId);
    }
  }, [user, dbMessages, activeConversationId]);

  // Clear messages when starting new chat
  useEffect(() => {
    if (user && !activeConversationId) {
      setMessages([]);
      setCurrentConversationId(null);
    }
  }, [user, activeConversationId]);

  const handleNewChat = () => {
    setMessages([]);
    setCurrentConversationId(null);
    if (!user) {
      clearGuestSession();
    } else {
      startNewChat();
    }
    setSidebarOpen(false);
  };

  const handleSelectConversation = async (id: string) => {
    await selectConversation(id);
    setSidebarOpen(false);
  };

  const handleDeleteAllChats = async () => {
    setMessages([]);
    setCurrentConversationId(null);
    if (!user) {
      clearGuestSession();
    } else {
      await deleteAllConversations();
    }
  };

  const handleSendMessage = async (content: string, files?: UploadedFile[]) => {
    // Check guest limit before sending
    if (!user && isLimitReached) {
      setShowLimitModal(true);
      return;
    }

    // ═══════════════════════════════════════════════════════════════
    // DOCUMENT PROCESSING PIPELINE
    // Extracts text from uploaded files (PDF, Images, Text) before sending to AI
    // ═══════════════════════════════════════════════════════════════
    let extractedText = '';
    let processingError = false;

    if (files && files.length > 0) {
      toast.info('Processing uploaded files...');

      try {
        // Step 1: Extract text from all uploaded files
        // Uses processMultipleFiles from documentProcessor.ts which handles OCR and text extraction
        const fileObjects = files.map(f => f.file);
        const { combinedText, results, allSuccessful } = await processMultipleFiles(fileObjects);

        extractedText = combinedText;

        // Step 2: Show processing results to user
        const successCount = results.filter(r => r.success).length;
        const failCount = results.length - successCount;

        if (allSuccessful) {
          toast.success(`Successfully processed ${results.length} file(s)`);
        } else if (successCount > 0) {
          toast.warning(`Processed ${successCount} file(s), ${failCount} failed`);
        } else {
          toast.error('Failed to process uploaded files');
          processingError = true;
        }

        // Log individual errors
        results.forEach(result => {
          if (!result.success && result.error) {
            console.error(`Error processing ${result.fileName}:`, result.error);
          }
        });

      } catch (error) {
        console.error('Document processing error:', error);
        toast.error('Failed to process documents. Please try again.');
        processingError = true;
      }
    }

    // Don't proceed if processing failed and there's no text content
    if (processingError && !content.trim()) {
      return;
    }

    // ═══════════════════════════════════════════════════════════════
    // PREPARE USER MESSAGE WITH EXTRACTED TEXT
    // ═══════════════════════════════════════════════════════════════

    // Combine user message with extracted text
    let finalContent = content.trim();

    if (extractedText) {
      if (finalContent) {
        // User provided both message and files
        finalContent = `${finalContent}\n\n[Uploaded Documents Content]:\n${extractedText}`;
      } else {
        // User only uploaded files without message
        finalContent = `[Uploaded Documents Content]:\n${extractedText}`;
      }
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content || (files ? `Sent ${files.length} file(s)` : ''),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      files,
    };

    setMessages((prev) => [...prev, userMessage]);

    // Handle logged-in user: create conversation if needed and save message
    let conversationId = currentConversationId;
    if (user) {
      if (!conversationId) {
        // Create a smart, short title like ChatGPT
        const title = generateSmartTitle(content || 'Document Analysis');
        const conversation = await createConversation(title);
        if (conversation) {
          conversationId = conversation.id;
          setCurrentConversationId(conversationId);
          setActiveConversationId(conversationId);
        }
      }
      if (conversationId) {
        await saveMessage(conversationId, 'user', userMessage.content);
      }
    } else {
      // Guest user - save to session
      addGuestMessage({
        id: userMessage.id,
        role: 'user',
        content: userMessage.content,
        timestamp: userMessage.timestamp,
      }, true);
    }

    setIsLoading(true);

    // ═══════════════════════════════════════════════════════════════
    // PREPARE MESSAGES FOR AI - ONLY SEND EXTRACTED TEXT
    // ═══════════════════════════════════════════════════════════════
    const chatHistory = messages.map(m => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.content,
    }));

    // Create placeholder for AI response
    const aiMessageId = (Date.now() + 1).toString();
    let aiContent = '';

    const aiMessage: Message = {
      id: aiMessageId,
      role: 'ai',
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, aiMessage]);

    if (!user) {
      addGuestMessage({
        id: aiMessageId,
        role: 'assistant',
        content: '',
        timestamp: aiMessage.timestamp,
      }, false);
    }

    setIsStreaming(true);
    isAutoScrolling.current = true; // Force auto-scroll when sending message

    // ═══════════════════════════════════════════════════════════════
    // SEND TO AI API - ONLY TEXT, NO BINARY DATA
    // ═══════════════════════════════════════════════════════════════
    await streamChat({
      messages: [
        ...chatHistory,
        { role: 'user', content: finalContent }, // Send extracted text, not raw files
      ],
      onDelta: (chunk) => {
        aiContent += chunk;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === aiMessageId ? { ...m, content: aiContent } : m
          )
        );
        if (!user) {
          updateGuestAssistant(aiContent);
        }
      },
      onDone: async () => {
        setIsLoading(false);
        setIsStreaming(false);

        // Save assistant message to database for logged-in users
        if (user && conversationId && aiContent) {
          await saveMessage(conversationId, 'assistant', aiContent);
        }

        // Show remaining prompts warning for guests
        if (!user && remainingPrompts <= 3 && remainingPrompts > 0) {
          toast.info(`${remainingPrompts - 1} messages remaining. Sign up to continue!`);
        }
      },
      onError: (error) => {
        setIsLoading(false);
        setIsStreaming(false);
        toast.error(error);
        // Remove the empty AI message on error
        setMessages((prev) => prev.filter((m) => m.id !== aiMessageId));
      },
    });
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onNewChat={handleNewChat}
        isDarkMode={isDarkMode}
        onThemeToggle={() => setIsDarkMode(!isDarkMode)}
        onDeleteAllChats={handleDeleteAllChats}
        conversations={conversations}
        groupedConversations={groupedConversations}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={deleteConversation}
        onRenameConversation={updateConversationTitle}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          isLoading={isLoading}
          isSidebarOpen={sidebarOpen}
        />

        {/* Chat Area */}
        <main
          ref={chatContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto scrollbar-thin flex flex-col scroll-smooth"
        >
          {messages.length === 0 && !isLoading ? (
            <WelcomeScreen
              onSuggestionClick={handleSendMessage}
              guestLimit={GUEST_LIMIT}
            />
          ) : (
            /* Chat messages */
            <div className="max-w-4xl mx-auto w-full px-3 sm:px-4 py-4 sm:py-6">
              <div className="space-y-4 sm:space-y-6">
                {messages.map((message, index) => {
                  const isLastMessage = index === messages.length - 1;
                  const isAiStreaming = isStreaming && isLastMessage && message.role === 'ai';

                  return (
                    <ChatMessage
                      key={message.id}
                      role={message.role}
                      content={message.content}
                      timestamp={message.timestamp}
                      files={message.files}
                      isStreaming={isAiStreaming}
                    />
                  );
                })}
                {isLoading && messages[messages.length - 1]?.role !== 'ai' && (
                  <ChatMessage role="ai" content="" isTyping />
                )}
                <div ref={messagesEndRef} className="h-4" />
              </div>
            </div>
          )}
        </main>

        <ChatInput
          onSend={handleSendMessage}
          isLoading={isLoading}
          disabled={!user && isLimitReached}
        />
      </div>

      <GuestLimitModal
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
      />
    </div>
  );
};

export default Index;
