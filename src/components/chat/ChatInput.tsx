import { useState, useRef, useEffect } from 'react';
import { Send, Plus, Loader2, X, FileText, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
  type: 'image' | 'document';
}

interface ChatInputProps {
  onSend: (message: string, files?: UploadedFile[]) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

const ChatInput = ({ onSend, isLoading, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((message.trim() || files.length > 0) && !isLoading && !disabled) {
      onSend(message.trim(), files.length > 0 ? files : undefined);
      setMessage('');
      setFiles([]);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    const newFiles: UploadedFile[] = [];

    Array.from(selectedFiles).forEach((file) => {
      const isImage = file.type.startsWith('image/');
      const uploadedFile: UploadedFile = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        type: isImage ? 'image' : 'document',
      };

      if (isImage) {
        const reader = new FileReader();
        reader.onload = (e) => {
          uploadedFile.preview = e.target?.result as string;
          setFiles((prev) => [...prev, uploadedFile]);
        };
        reader.readAsDataURL(file);
      } else {
        newFiles.push(uploadedFile);
      }
    });

    if (newFiles.length > 0) {
      setFiles((prev) => [...prev, ...newFiles]);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handlePlusClick = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [message]);

  const isDisabled = isLoading || disabled || (!message.trim() && files.length === 0);

  return (
    <div className="bg-background p-2 sm:p-4 pb-4 sm:pb-4">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        {/* File previews */}
        {files.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2 px-1">
            {files.map((file) => (
              <div
                key={file.id}
                className="relative group bg-card border border-border rounded-lg overflow-hidden"
              >
                {file.type === 'image' && file.preview ? (
                  <img
                    src={file.preview}
                    alt={file.file.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 flex flex-col items-center justify-center p-2">
                    <FileText className="w-6 h-6 text-muted-foreground mb-1" />
                    <span className="text-[10px] text-muted-foreground truncate w-full text-center">
                      {file.file.name.slice(0, 10)}...
                    </span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeFile(file.id)}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="relative flex items-center gap-2 bg-card rounded-full sm:rounded-2xl border border-border px-2 sm:px-3 py-1.5 sm:py-2 shadow-sm transition-all duration-200 focus-within:border-primary/50">
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.txt,.csv,.json,.pdf,.doc,.docx,.ppt,.pptx"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Plus button for file upload */}
          <button
            type="button"
            onClick={handlePlusClick}
            className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center transition-colors self-center"
            title="Attach file"
          >
            <Plus className="w-5 h-5 text-muted-foreground" />
          </button>

          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything"
            disabled={isLoading || disabled}
            rows={1}
            className={cn(
              "flex-1 resize-none bg-transparent text-foreground placeholder:text-muted-foreground py-2 text-sm focus:outline-none scrollbar-thin disabled:opacity-50 leading-5",
              "min-h-[36px] max-h-[120px] sm:max-h-[200px]"
            )}
            style={{ marginTop: 'auto', marginBottom: 'auto' }}
          />

          <button
            type="submit"
            disabled={isDisabled}
            className={cn(
              "flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-200 self-center",
              isDisabled
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95"
            )}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            ) : (
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>
        </div>
        <p className="text-[10px] sm:text-xs text-center text-muted-foreground mt-2 sm:mt-3">
          AskAI Chat can make mistakes. Consider checking important information.
        </p>
      </form>
    </div>
  );
};

export default ChatInput;
