import { useAuth } from '@/contexts/AuthContext';
import { Gamepad2, Brain, MessageCircle, Music, Film, Zap, HelpCircle, Smile, Shuffle } from 'lucide-react';
import { useState } from 'react';

interface WelcomeScreenProps {
  onSuggestionClick: (suggestion: string) => void;
  guestLimit?: number;
}

const suggestions = [
  { label: 'Write anything', prompt: 'Help me write something creative' },
  { label: 'Summarize something', prompt: 'Help me summarize a document or text' },
  { label: 'Code help', prompt: 'Help me with a coding problem' },
];

const games = [
  { icon: HelpCircle, label: 'Guess the Object', prompt: "Let's play Guess the Object! Give me clues and I'll try to guess what you're thinking of.", category: 'guessing' },
  { icon: Film, label: 'Dialog Guess', prompt: "Let's play Dialog Guess! Show me a famous movie dialogue and I'll guess which movie it's from.", category: 'movies' },
  { icon: MessageCircle, label: 'Actor by Clues', prompt: "Let's play Actor by Clues! Give me hints and I'll try to guess the actor's name.", category: 'guessing' },
  { icon: Music, label: 'Song from One Line', prompt: "Let's play Song from One Line! Give me one line of lyrics and I'll guess the song.", category: 'music' },
  { icon: Smile, label: 'Movie in 5 Emojis', prompt: "Let's play Movie in 5 Emojis! Show me 5 emojis that represent a movie and give me a small hint, then I'll try to guess the movie!", category: 'movies' },
  { icon: Zap, label: 'This or That', prompt: "Let's play This or That! I'll give you two options and you pick one.", category: 'choices' },
  { icon: Brain, label: 'Would You Rather', prompt: "Let's play Would You Rather! I'll give you tough choices to pick from.", category: 'choices' },
  { icon: Zap, label: 'Rapid Fire', prompt: "Let's play Rapid Fire! I'll ask quick questions and you answer fast!", category: 'quick' },
  { icon: Brain, label: 'Logic Puzzle', prompt: "Let's play Logic Puzzle! I'll give you a brain teaser to solve.", category: 'brain' },
  { icon: HelpCircle, label: 'True or Fake', prompt: "Let's play True or Fake! I'll tell you a fact and you guess if it's real or made up.", category: 'brain' },
  { icon: Smile, label: 'Emoji Guessing', prompt: "Let's play Emoji Guessing! I'll show you emojis and you guess what movie they represent.", category: 'movies' },
  { icon: MessageCircle, label: '20 Questions', prompt: "Let's play 20 Questions! Think of something and I'll try to guess it in 20 yes/no questions.", category: 'guessing' },
];

const WelcomeScreen = ({ onSuggestionClick, guestLimit }: WelcomeScreenProps) => {
  const { user, profile } = useAuth();
  const [showGames, setShowGames] = useState(false);
  
  const getFirstName = () => {
    if (profile?.display_name) {
      return profile.display_name.split(' ')[0];
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return null;
  };

  const firstName = getFirstName();

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 animate-fade-in overflow-y-auto py-8">
      <div className="max-w-2xl w-full text-center space-y-6">
        {/* Personalized Greeting */}
        {firstName && (
          <p className="text-sm text-muted-foreground">
            Hi {firstName}
          </p>
        )}
        
        {/* Main Question */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground leading-tight">
          Where should we start?
        </h2>

        {/* Suggestion Chips - Centered */}
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.label}
              onClick={() => onSuggestionClick(suggestion.prompt)}
              className="px-4 py-2 rounded-full bg-muted/50 hover:bg-muted text-sm text-foreground/80 hover:text-foreground transition-colors border border-border/50 hover:border-border"
            >
              {suggestion.label}
            </button>
          ))}
          <button
            onClick={() => setShowGames(!showGames)}
            className={`px-4 py-2 rounded-full text-sm transition-colors border flex items-center gap-2 ${
              showGames 
                ? 'bg-primary text-primary-foreground border-primary' 
                : 'bg-muted/50 hover:bg-muted text-foreground/80 hover:text-foreground border-border/50 hover:border-border'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            Play a Game
          </button>
        </div>

        {/* Games Section */}
        {showGames && (
          <div className="pt-4 animate-fade-in text-left">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-foreground">Choose a game to play</h3>
              <button
                onClick={() => {
                  const randomGame = games[Math.floor(Math.random() * games.length)];
                  onSuggestionClick(randomGame.prompt);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium transition-colors"
              >
                <Shuffle className="w-3.5 h-3.5" />
                Random
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {games.map((game) => (
                <button
                  key={game.label}
                  onClick={() => onSuggestionClick(game.prompt)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-muted/30 hover:bg-muted text-left text-sm text-foreground/80 hover:text-foreground transition-colors border border-border/30 hover:border-border group"
                >
                  <game.icon className="w-4 h-4 text-primary/70 group-hover:text-primary flex-shrink-0" />
                  <span className="truncate">{game.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Guest message limit */}
        {!user && guestLimit && (
          <p className="text-sm text-muted-foreground pt-2">
            {guestLimit} free messages • <span className="text-primary hover:underline cursor-pointer">Sign up for unlimited</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default WelcomeScreen;