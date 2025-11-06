import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Loader2 } from 'lucide-react';
import { Source, ChatMessage } from '@/pages/Index';

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

    // Add user message
    setSources(prev => prev.map(s => 
      s.id === source.id 
        ? { ...s, chatHistory: [...(s.chatHistory || []), userMessage] }
        : s
    ));

    setMessage('');
    setIsLoading(true);

    // Simulate AI response
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
    <div className="border-t border-border bg-card">
      <div className="max-w-4xl mx-auto p-4">
        {/* Chat Messages */}
        {source.chatHistory && source.chatHistory.length > 0 && (
          <div className="mb-4 max-h-[300px] overflow-y-auto space-y-3">
            {source.chatHistory.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-4 py-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Suggested Questions */}
        {(!source.chatHistory || source.chatHistory.length === 0) && (
          <div className="mb-3 flex flex-wrap gap-2">
            {suggestedQuestions.map((question, idx) => (
              <Button
                key={idx}
                variant="outline"
                size="sm"
                onClick={() => handleSuggestedQuestion(question)}
                className="text-xs"
              >
                {question}
              </Button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="flex gap-2">
          <Input
            placeholder={`Ask anything about this ${source.type}...`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={isLoading}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!message.trim() || isLoading}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatSection;
