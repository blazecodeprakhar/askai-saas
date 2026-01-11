import { Menu, User, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onMenuClick: () => void;
  isLoading?: boolean;
  isSidebarOpen?: boolean;
}

const Header = ({ onMenuClick, isLoading, isSidebarOpen }: HeaderProps) => {
  const { user } = useAuth();
  
  return (
    <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-xl px-3 py-2 sm:px-4 sm:py-3">
      <div className="flex items-center justify-between">
        {/* Left: Menu button - only on mobile, or desktop when sidebar closed */}
        <button
          onClick={onMenuClick}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg hover:bg-muted flex items-center justify-center transition-colors lg:hidden"
        >
          <Menu className="w-5 h-5 text-muted-foreground" />
        </button>
        
        {/* Spacer for desktop when sidebar is open */}
        <div className={`hidden lg:block ${isSidebarOpen ? 'w-0' : 'w-10'}`} />
        
        {/* Center: App name with dropdown style */}
        <div className="flex items-center gap-1 cursor-pointer hover:bg-muted/50 rounded-lg px-2 py-1 transition-colors">
          <span className="font-medium text-foreground text-sm sm:text-base">AskAI Chat</span>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </div>

        {/* Right: User icon */}
        {user ? (
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-muted flex items-center justify-center">
            <User className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
          </div>
        ) : (
          <Link
            to="/auth"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <User className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;