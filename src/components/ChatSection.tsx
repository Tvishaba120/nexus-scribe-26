import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Loader2, Sparkles } from 'lucide-react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Source {
  id: string;
  name: string;
  type: string;
  content: string;
  preview?: string;
  chatHistory?: ChatMessage[];
}

interface ChatSectionProps {
  source: Source;
  sources: Source[];
  setSources: React.Dispatch<React.SetStateAction<Source[]>>;
}

const ChatSection = ({ source, sources, setSources }: ChatSectionProps) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [source.chatHistory]);

  const suggestedQuestions = [
    "Summarize this content",
    "What are the key points?",
    "Explain this in simple terms"
  ];

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: message,
      timestamp: new Date()
    };

    setSources(prev => prev.map(s => 
      s.id === source.id 
        ? { ...s, chatHistory: [...(s.chatHistory || []), userMessage] }
        : s
    ));

    setMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `Based on your ${source.type} "${source.name}", here's my response: ${generateMockResponse(message, source)}`,
        timestamp: new Date()
      };

      setSources(prev => prev.map(s => 
        s.id === source.id 
          ? { ...s, chatHistory: [...(s.chatHistory || []), aiResponse] }
          : s
      ));

      setIsLoading(false);
    }, 1500);
  };

  const generateMockResponse = (query: string, source: Source) => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('summarize') || lowerQuery.includes('summary')) {
      return `This ${source.type} contains information about ${source.name}. ${source.preview || source.content.slice(0, 150)}... The main themes revolve around the topics discussed in the content.`;
    }
    
    if (lowerQuery.includes('key points') || lowerQuery.includes('main points')) {
      return `Key points from "${source.name}":\n\n1. The content discusses important concepts\n2. Several noteworthy ideas are presented\n3. The information is well-structured and informative`;
    }
    
    if (lowerQuery.includes('explain')) {
      return `Let me break down the content of "${source.name}" in simpler terms: The material covers various topics that are interconnected. Each section builds upon the previous one to create a comprehensive overview.`;
    }
    
    return `I've analyzed "${source.name}" and found several interesting aspects related to your question. The ${source.type} provides valuable insights that I can help you explore further.`;
  };

  const handleSuggestedQuestion = (question: string) => {
    setMessage(question);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {source.chatHistory && source.chatHistory.length > 0 ? (
          source.chatHistory.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-300`}
            >
              <div
                className={`max-w-[75%] rounded-lg px-5 py-3.5 ${
                  msg.role === 'user'
                    ? 'bg-muted text-foreground'
                    : 'bg-transparent text-foreground'
                }`}
              >
                <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full px-4">
            <div className="text-center max-w-md space-y-6">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-muted-foreground" />
                </div>
              </div>
              
              <div className="space-y-3">
                {suggestedQuestions.map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestedQuestion(question)}
                    className="w-full text-left px-4 py-3 rounded-lg border border-border hover:bg-muted/50 transition-colors text-sm text-foreground"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {isLoading && (
          <div className="flex justify-start animate-in fade-in duration-200">
            <div className="bg-transparent rounded-lg px-5 py-3.5">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-border p-4 bg-background">
        <div className="max-w-3xl mx-auto">
          <div className="mb-3 text-xs text-muted-foreground text-center">
            Chat with {sources.length} {sources.length === 1 ? 'source' : 'sources'}
          </div>
          <div className="flex gap-2 items-end">
            <Input
              placeholder="Ask a follow up question..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
              disabled={isLoading}
              className="flex-1 min-h-[44px] rounded-full bg-muted border-0 focus-visible:ring-1 focus-visible:ring-ring px-5"
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!message.trim() || isLoading}
              size="icon"
              className="rounded-full h-[44px] w-[44px] bg-primary hover:bg-primary/90 shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSection;
