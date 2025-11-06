import { useState } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Source } from '@/pages/Index';
import UploadSourcesModal from './UploadSourcesModal';
import SourcePreview from './SourcePreview';
import ChatSection from './ChatSection';

interface ContentPanelProps {
  selectedSource?: Source;
  sources: Source[];
  setSources: React.Dispatch<React.SetStateAction<Source[]>>;
}

const ContentPanel = ({ selectedSource, sources, setSources }: ContentPanelProps) => {
  const [showUploadModal, setShowUploadModal] = useState(false);

  if (!selectedSource) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-6">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
          <Upload className="w-12 h-12 text-muted-foreground" />
        </div>
        <h3 className="text-2xl font-medium mb-3">Add a source to get started</h3>
        <p className="text-sm text-muted-foreground max-w-md mb-6">
          Upload documents, add links, or Note to begin
        </p>
        <Button onClick={() => setShowUploadModal(true)}>
          Upload a source
        </Button>
        
        <UploadSourcesModal
          open={showUploadModal}
          onOpenChange={setShowUploadModal}
          sources={sources}
          setSources={setSources}
        />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Source Preview */}
      <div className="border-b border-border">
        <SourcePreview 
          source={selectedSource}
          sources={sources}
          setSources={setSources}
        />
      </div>

      {/* Chat Section */}
      <div className="flex-1 overflow-hidden">
        <ChatSection
          source={selectedSource}
          sources={sources}
          setSources={setSources}
        />
      </div>
    </div>
  );
};

export default ContentPanel;
