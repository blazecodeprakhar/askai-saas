import { useState, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Plus, MessageSquare, Settings, Trash2, Sun, Moon, LogOut, LogIn, Search, PanelLeftClose, PanelLeft, Info, Database, Loader2, Calendar, TrendingUp, Clock, Pencil, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Progress } from '@/components/ui/progress';
import type { Conversation } from '@/hooks/useConversations';
import { useStorageStats } from '@/hooks/useStorageStats';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onNewChat: () => void;
  isDarkMode: boolean;
  onThemeToggle: () => void;
  onDeleteAllChats: () => void;
  conversations: Conversation[];
  groupedConversations: Record<string, Conversation[]>;
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (id: string, newTitle: string) => void;
}

// Free tier storage limit in KB (10 MB for demo)
const STORAGE_LIMIT_KB = 10 * 1024;

const Sidebar = ({ 
  isOpen, 
  onToggle, 
  onNewChat, 
  isDarkMode, 
  onThemeToggle, 
  onDeleteAllChats,
  conversations,
  groupedConversations,
  activeConversationId,
  onSelectConversation,
  onDeleteConversation,
  onRenameConversation,
}: SidebarProps) => {
  const [showSettings, setShowSettings] = useState(false);
  const [settingsClosing, setSettingsClosing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dataControlsOpen, setDataControlsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const editInputRef = useRef<HTMLInputElement>(null);
  const { user, profile, signOut } = useAuth();
  const { stats, isLoading: statsLoading, fetchStats, formatStorage } = useStorageStats();

  // Helper to close settings with animation
  const closeSettings = () => {
    if (!showSettings) return;
    setSettingsClosing(true);
    setTimeout(() => {
      setShowSettings(false);
      setSettingsClosing(false);
    }, 200);
  };

  // Close settings and data controls when sidebar closes
  useEffect(() => {
    if (!isOpen) {
      setShowSettings(false);
      setSettingsClosing(false);
      setDataControlsOpen(false);
    }
  }, [isOpen]);

  // Close data controls when settings menu closes
  useEffect(() => {
    if (!showSettings) {
      setDataControlsOpen(false);
    }
  }, [showSettings]);

  // Refresh stats when dialog opens
  useEffect(() => {
    if (dataControlsOpen && user) {
      fetchStats();
    }
  }, [dataControlsOpen, user, fetchStats]);

  // Escape key to close settings
  useEffect(() => {
    if (!showSettings) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeSettings();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showSettings]);

  // Settings only closes when clicking Settings button again or when sidebar closes

  // Filter conversations based on search query
  const filteredGroupedConversations = useMemo(() => {
    if (!searchQuery.trim()) return groupedConversations;
    
    const filtered: Record<string, Conversation[]> = {};
    Object.entries(groupedConversations).forEach(([period, convs]) => {
      const matching = convs.filter(c => 
        c.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (matching.length > 0) {
        filtered[period] = matching;
      }
    });
    return filtered;
  }, [groupedConversations, searchQuery]);

  const handleLogout = async () => {
    await signOut();
    setShowSettings(false);
    window.location.reload();
  };

  const handleDeleteAllChats = () => {
    onDeleteAllChats();
    setDataControlsOpen(false);
    setShowSettings(false);
  };

  const isGuest = !user;
  const displayName = profile?.display_name || user?.email?.split('@')[0] || 'Guest';
  const initials = isGuest ? 'G' : displayName.slice(0, 2).toUpperCase();

  // Calculate storage usage
  const usagePercent = Math.min((stats.estimatedStorageKB / STORAGE_LIMIT_KB) * 100, 100);
  const remainingKB = Math.max(STORAGE_LIMIT_KB - stats.estimatedStorageKB, 0);

  // Order for date categories
  const categoryOrder = ['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'Older'];
  const sortedCategories = Object.keys(filteredGroupedConversations).sort(
    (a, b) => categoryOrder.indexOf(a) - categoryOrder.indexOf(b)
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={onToggle}
        />
      )}

      {/* Sidebar - Fixed on desktop, overlay on mobile */}
      <aside
        className={cn(
          "fixed lg:relative z-50 h-full bg-sidebar flex flex-col transition-all duration-300 ease-in-out",
          // Mobile: slide in/out
          isOpen ? "w-72 translate-x-0" : "-translate-x-full lg:translate-x-0",
          // Desktop: show/hide width
          isOpen ? "lg:w-64" : "lg:w-0 lg:overflow-hidden"
        )}
      >
        <div className="flex flex-col h-full min-w-[256px]">
          {/* Top area: New Chat + Toggle */}
          <div className="flex items-center gap-2 p-3">
            <button
              onClick={onNewChat}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition-colors flex-1"
            >
              <Plus className="w-5 h-5" />
              <span className="text-sm font-medium">New chat</span>
            </button>
            <button
              onClick={onToggle}
              className="hidden lg:flex w-9 h-9 items-center justify-center rounded-lg hover:bg-sidebar-accent text-muted-foreground transition-colors"
              title="Close sidebar"
            >
              <PanelLeftClose className="w-5 h-5" />
            </button>
          </div>

          {/* Search */}
          <div className="px-3 pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search chats"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-sidebar-accent/50 border-0 rounded-lg pl-9 pr-3 py-2 text-sm text-sidebar-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-sidebar-ring"
              />
            </div>
          </div>

          {/* Chat History */}
          <nav className="flex-1 overflow-y-auto scrollbar-thin px-2 space-y-4">
            {isGuest ? (
              <div className="px-3 py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Sign in to save your chat history
                </p>
              </div>
            ) : sortedCategories.length === 0 ? (
              <div className="px-3 py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No conversations yet
                </p>
              </div>
            ) : (
              sortedCategories.map((period) => (
                <div key={period}>
                  <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 mb-1">
                    {period}
                  </h3>
                  <ul className="space-y-0.5">
                    {filteredGroupedConversations[period].map((conv) => (
                      <li key={conv.id} className="group relative">
                        {editingId === conv.id ? (
                          // Inline editing mode
                          <div className="flex items-center gap-1 px-2 py-1.5">
                            <input
                              ref={editInputRef}
                              type="text"
                              value={editingTitle}
                              onChange={(e) => setEditingTitle(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  if (editingTitle.trim()) {
                                    onRenameConversation(conv.id, editingTitle.trim());
                                  }
                                  setEditingId(null);
                                } else if (e.key === 'Escape') {
                                  setEditingId(null);
                                }
                              }}
                              className="flex-1 bg-sidebar-accent border border-sidebar-ring rounded px-2 py-1 text-sm text-sidebar-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                              autoFocus
                            />
                            <button
                              onClick={() => {
                                if (editingTitle.trim()) {
                                  onRenameConversation(conv.id, editingTitle.trim());
                                }
                                setEditingId(null);
                              }}
                              className="p-1 rounded hover:bg-green-500/20 text-green-500"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-1 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          // Normal display mode
                          <>
                            <button
                              onClick={() => onSelectConversation(conv.id)}
                              onDoubleClick={() => {
                                setEditingId(conv.id);
                                setEditingTitle(conv.title);
                              }}
                              className={cn(
                                "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors",
                                activeConversationId === conv.id
                                  ? "bg-sidebar-accent text-sidebar-foreground"
                                  : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                              )}
                            >
                              <MessageSquare className="w-4 h-4 flex-shrink-0" />
                              <span className="truncate text-sm flex-1">{conv.title}</span>
                            </button>
                            <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-sidebar/90 backdrop-blur-sm rounded-md px-1 py-0.5">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingId(conv.id);
                                  setEditingTitle(conv.title);
                                }}
                                className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:bg-blue-500 hover:text-white transition-all duration-150"
                                title="Rename"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteConversation(conv.id);
                                }}
                                className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:bg-red-500 hover:text-white transition-all duration-150"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </nav>

          {/* Bottom: User Profile + Settings */}
          <div className="p-3 border-t border-sidebar-border space-y-1 relative">
            {/* Settings Button */}
            <button
              data-settings-trigger
              onClick={() => showSettings ? closeSettings() : setShowSettings(true)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors text-sm",
                showSettings && "bg-sidebar-accent text-sidebar-foreground"
              )}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>

            {/* Settings Menu */}
            {showSettings && (
              <>
                <div 
                  onClick={closeSettings}
                  className={cn(
                    "fixed inset-0 bg-background/40 backdrop-blur-sm z-40 cursor-pointer",
                    settingsClosing ? "animate-fade-out" : "animate-fade-in"
                  )}
                />
                <div 
                  data-settings-menu 
                  className={cn(
                    "absolute bottom-full left-3 right-3 mb-2 bg-card/95 backdrop-blur-md border border-border rounded-xl shadow-2xl overflow-hidden z-50",
                    settingsClosing ? "animate-slide-down" : "animate-slide-up"
                  )}
                >
                <div className="p-2 space-y-1">
                  <button
                    onClick={() => {
                      onThemeToggle();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
                  >
                    {isDarkMode ? (
                      <Sun className="w-5 h-5" />
                    ) : (
                      <Moon className="w-5 h-5" />
                    )}
                    <span className="text-sm">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                  </button>

                  <Dialog open={dataControlsOpen} onOpenChange={setDataControlsOpen}>
                    <DialogTrigger asChild>
                      <button
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
                      >
                        <Database className="w-5 h-5" />
                        <span className="text-sm">Data Controls</span>
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-sm">
                      <DialogHeader className="pb-2">
                        <DialogTitle className="text-base flex items-center gap-2">
                          Data Controls
                          {statsLoading && <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />}
                        </DialogTitle>
                        <DialogDescription className="text-xs">
                          Manage your storage and chat data
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-3 py-2">
                        {isGuest ? (
                          <div className="text-center py-4">
                            <Database className="w-10 h-10 mx-auto text-muted-foreground/50 mb-2" />
                            <p className="text-xs text-muted-foreground">
                              Sign in to track your storage usage
                            </p>
                          </div>
                        ) : (
                          <>
                            {/* Storage Usage */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-foreground">Storage</span>
                                <span className="text-xs text-muted-foreground">
                                  {formatStorage(stats.estimatedStorageKB)} / {formatStorage(STORAGE_LIMIT_KB)}
                                </span>
                              </div>
                              <Progress value={usagePercent} className="h-2" />
                            </div>

                            {/* Statistics */}
                            <div className="rounded-lg border border-border p-3 space-y-2">
                              <h4 className="text-xs font-medium text-foreground flex items-center gap-1.5">
                                <TrendingUp className="w-3 h-3" />
                                Statistics
                              </h4>
                              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Chats</span>
                                  <span className="font-medium">{stats.totalConversations}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Messages</span>
                                  <span className="font-medium">{stats.totalMessages}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Yours</span>
                                  <span className="font-medium">{stats.userMessages}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">AI</span>
                                  <span className="font-medium">{stats.assistantMessages}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Avg/Chat</span>
                                  <span className="font-medium">{stats.averageMessagesPerChat}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Avg Length</span>
                                  <span className="font-medium">{stats.averageMessageLength}</span>
                                </div>
                              </div>
                            </div>

                            {/* Activity Timeline */}
                            <div className="rounded-lg border border-border p-3 space-y-2">
                              <h4 className="text-xs font-medium text-foreground flex items-center gap-1.5">
                                <Calendar className="w-3 h-3" />
                                Activity
                              </h4>
                              <div className="space-y-1.5 text-xs">
                                {stats.accountCreatedAt && (
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Member since</span>
                                    <span className="font-medium">
                                      {new Date(stats.accountCreatedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                    </span>
                                  </div>
                                )}
                                {stats.oldestConversation && (
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">First chat</span>
                                    <span className="font-medium">
                                      {new Date(stats.oldestConversation).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </span>
                                  </div>
                                )}
                                {stats.newestConversation && (
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Last chat</span>
                                    <span className="font-medium">
                                      {new Date(stats.newestConversation).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </span>
                                  </div>
                                )}
                                {stats.totalTokensUsed > 0 && (
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Tokens used</span>
                                    <span className="font-medium">{stats.totalTokensUsed.toLocaleString()}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Delete All Chats - Danger Zone */}
                            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 space-y-2.5">
                              <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
                                <h4 className="text-xs font-semibold text-destructive">Danger Zone</h4>
                              </div>
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                Permanently delete all conversations and messages.
                              </p>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-destructive/10 border border-destructive/40 text-destructive font-medium text-xs cursor-pointer transition-all duration-200 ease-in-out hover:bg-red-600 hover:text-white hover:border-red-600 hover:shadow-md hover:shadow-red-600/25 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2 focus:ring-offset-background">
                                    <Trash2 className="w-4 h-4" />
                                    Delete All Chats
                                  </button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="sm:max-w-sm">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle className="text-base flex items-center gap-2">
                                      <Trash2 className="w-4 h-4 text-destructive" />
                                      Delete all chats?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription className="text-xs">
                                      This will permanently delete all your chat history. This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter className="gap-2 sm:gap-2">
                                    <AlertDialogCancel className="text-xs h-9 px-4">Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={handleDeleteAllChats}
                                      className="bg-destructive text-white hover:bg-red-600 text-xs h-9 px-4 cursor-pointer transition-all duration-200 ease-in-out hover:shadow-md hover:shadow-destructive/25 active:scale-[0.98] focus:ring-2 focus:ring-destructive/50 focus:ring-offset-2"
                                    >
                                      Delete All
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Link
                    to="/about"
                    onClick={() => setShowSettings(false)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
                  >
                    <Info className="w-5 h-5" />
                    <span className="text-sm">About</span>
                  </Link>

                  <div className="border-t border-border my-1" />

                  {isGuest ? (
                    <Link
                      to="/auth"
                      onClick={() => setShowSettings(false)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200"
                    >
                      <LogIn className="w-5 h-5" />
                      <span className="text-sm">Sign In / Sign Up</span>
                    </Link>
                  ) : (
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="text-sm">Logout</span>
                    </button>
                  )}
                </div>
              </div>
              </>
            )}

            {/* User Profile */}
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-accent transition-colors cursor-pointer">
              <Avatar className="w-8 h-8 border border-border">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-sidebar-foreground truncate flex-1">{displayName}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Desktop Toggle Button - Shows when sidebar is closed */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="hidden lg:flex fixed top-3 left-3 z-50 w-9 h-9 items-center justify-center rounded-lg hover:bg-muted text-muted-foreground transition-colors"
          title="Open sidebar"
        >
          <PanelLeft className="w-5 h-5" />
        </button>
      )}
    </>
  );
};

export default Sidebar;
