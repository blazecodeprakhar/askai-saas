import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LogIn, UserPlus, Sparkles } from 'lucide-react';

interface GuestLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GuestLimitModal({ isOpen, onClose }: GuestLimitModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl">You've reached the free limit</DialogTitle>
            </div>
          </div>
          <DialogDescription className="text-base pt-2">
            Guest users can send up to 12 messages. Create a free account to continue chatting and save your conversation history!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <div className="rounded-lg border border-border p-4 bg-muted/30">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Benefits of signing up:
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1.5">
              <li>• Unlimited messages</li>
              <li>• Persistent chat history</li>
              <li>• Access on all devices</li>
              <li>• Your current chat will be saved</li>
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <Link to="/auth" className="w-full">
              <Button className="w-full gap-2" size="lg">
                <UserPlus className="w-4 h-4" />
                Create Free Account
              </Button>
            </Link>
            <Link to="/auth" className="w-full">
              <Button variant="outline" className="w-full gap-2" size="lg">
                <LogIn className="w-4 h-4" />
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
