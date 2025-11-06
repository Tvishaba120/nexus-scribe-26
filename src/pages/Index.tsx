import { useState, useEffect } from 'react';
import SourcesPanel from '@/components/SourcesPanel';
import ContentPanel from '@/components/ContentPanel';
import AgentsPanel from '@/components/AgentsPanel';
import { Button } from '@/components/ui/button';
import { Grid3x3, Settings, Menu } from 'lucide-react';

export type SourceType = 'note' | 'link' | 'file';

export interface Source {
  id: string;
  type: SourceType;
  name: string;
  content: string;
  preview?: string;
  timestamp: Date;
  url?: string;
  fileType?: string;
  fileSize?: number;
  chatHistory?: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const Index = () => {
  const [sources, setSources] = useState<Source[]>([]);
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  const [notebookTitle, setNotebookTitle] = useState('Untitled notebook');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [showSourcesPanel, setShowSourcesPanel] = useState(true);
  const [showAgentsPanel, setShowAgentsPanel] = useState(true);

  // Load from localStorage
  useEffect(() => {
    const savedSources = localStorage.getItem('notebookSources');
    const savedTitle = localStorage.getItem('notebookTitle');
    
    if (savedSources) {
      const parsed = JSON.parse(savedSources);
      setSources(parsed.map((s: any) => ({
        ...s,
        timestamp: new Date(s.timestamp),
        chatHistory: s.chatHistory?.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })) || []
      })));
    }
    
    if (savedTitle) {
      setNotebookTitle(savedTitle);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (sources.length > 0) {
      localStorage.setItem('notebookSources', JSON.stringify(sources));
    }
  }, [sources]);

  useEffect(() => {
    localStorage.setItem('notebookTitle', notebookTitle);
  }, [notebookTitle]);

  const selectedSource = sources.find(s => s.id === selectedSourceId);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="h-14 bg-[hsl(var(--header-bg))] text-[hsl(var(--header-fg))] border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 text-primary">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
              </svg>
            </div>
            <span className="text-sm font-semibold">NotebookLM</span>
          </div>
          <div className="w-px h-6 bg-border/30" />
          {isEditingTitle ? (
            <input
              type="text"
              value={notebookTitle}
              onChange={(e) => setNotebookTitle(e.target.value)}
              onBlur={() => setIsEditingTitle(false)}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
              className="text-sm font-medium bg-transparent border-b border-primary outline-none px-1 text-foreground"
              autoFocus
            />
          ) : (
            <button
              onClick={() => setIsEditingTitle(true)}
              className="text-sm font-medium hover:opacity-80 transition-opacity"
            >
              {notebookTitle}
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-xs opacity-70">All changes saved</span>
          <Button variant="ghost" size="sm" className="text-[hsl(var(--header-fg))] hover:bg-white/10">
            Share
          </Button>
          <Button variant="ghost" size="icon" className="text-[hsl(var(--header-fg))] hover:bg-white/10">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-[hsl(var(--header-fg))] hover:bg-white/10">
            <Grid3x3 className="h-4 w-4" />
          </Button>
          <div className="w-8 h-8 bg-[#FF6B35] rounded-full flex items-center justify-center text-white text-sm font-medium">
            U
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sources Panel */}
        {showSourcesPanel && (
          <div className="w-[280px] border-r border-border bg-card flex-shrink-0">
            <SourcesPanel
              sources={sources}
              setSources={setSources}
              selectedSourceId={selectedSourceId}
              setSelectedSourceId={setSelectedSourceId}
              onTogglePanel={() => setShowSourcesPanel(false)}
            />
          </div>
        )}

        {/* Content Panel */}
        <div className="flex-1 overflow-hidden">
          {!showSourcesPanel && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSourcesPanel(true)}
              className="m-2"
            >
              <Menu className="h-4 w-4" />
            </Button>
          )}
          <ContentPanel
            selectedSource={selectedSource}
            sources={sources}
            setSources={setSources}
          />
        </div>

        {/* Agents Panel */}
        {showAgentsPanel && (
          <div className="w-[320px] border-l border-border bg-card flex-shrink-0">
            <AgentsPanel onTogglePanel={() => setShowAgentsPanel(false)} />
          </div>
        )}
        
        {!showAgentsPanel && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowAgentsPanel(true)}
            className="absolute top-20 right-2"
          >
            <Menu className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default Index;
