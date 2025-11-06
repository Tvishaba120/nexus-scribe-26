import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, ChevronLeft, Search } from 'lucide-react';
import { Source } from '@/pages/Index';
import UploadSourcesModal from './UploadSourcesModal';
import SourceItem from './SourceItem';

interface SourcesPanelProps {
  sources: Source[];
  setSources: React.Dispatch<React.SetStateAction<Source[]>>;
  selectedSourceId: string | null;
  setSelectedSourceId: (id: string | null) => void;
  onTogglePanel: () => void;
}

const SourcesPanel = ({
  sources,
  setSources,
  selectedSourceId,
  setSelectedSourceId,
  onTogglePanel
}: SourcesPanelProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);

  const filteredSources = sources.filter(source =>
    source.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    source.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteSource = (id: string) => {
    setSources(prev => prev.filter(s => s.id !== id));
    if (selectedSourceId === id) {
      setSelectedSourceId(null);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-medium">Sources</h2>
            <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
              {sources.length}
            </span>
          </div>
          <Button variant="ghost" size="icon" onClick={onTogglePanel}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
        
        <Button 
          className="w-full justify-start gap-2" 
          variant="secondary"
          onClick={() => setShowUploadModal(true)}
        >
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </div>

      {/* Search */}
      <div className="px-4 py-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search sources"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
      </div>

      {/* Sources List */}
      <div className="flex-1 overflow-y-auto">
        {filteredSources.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-6 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-3">
              <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-sm font-medium mb-1">Saved sources will appear here</p>
            <p className="text-xs text-muted-foreground">Click Add source above to add PDFs, websites, text, videos or audio files. Or import a file directly from Google Drive.</p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {filteredSources.map(source => (
              <SourceItem
                key={source.id}
                source={source}
                isSelected={selectedSourceId === source.id}
                onClick={() => setSelectedSourceId(source.id)}
                onDelete={() => handleDeleteSource(source.id)}
              />
            ))}
          </div>
        )}
      </div>

      <UploadSourcesModal
        open={showUploadModal}
        onOpenChange={setShowUploadModal}
        sources={sources}
        setSources={setSources}
      />
    </div>
  );
};

export default SourcesPanel;
