import { FileUp } from 'lucide-react';
import { Source } from '@/pages/Index';
import NoteViewer from './NoteViewer';
import LinkViewer from './LinkViewer';
import FileViewer from './FileViewer';

interface ContentPanelProps {
  selectedSource?: Source;
  sources: Source[];
  setSources: React.Dispatch<React.SetStateAction<Source[]>>;
}

const ContentPanel = ({ selectedSource, sources, setSources }: ContentPanelProps) => {
  if (!selectedSource) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-6">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
          <FileUp className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2">Select a source to view</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Choose a note, link, or file from the left panel to start exploring
        </p>
      </div>
    );
  }

  return (
    <div className="h-full">
      {selectedSource.type === 'note' && (
        <NoteViewer 
          source={selectedSource}
          sources={sources}
          setSources={setSources}
        />
      )}
      
      {selectedSource.type === 'link' && (
        <LinkViewer 
          source={selectedSource}
          sources={sources}
          setSources={setSources}
        />
      )}
      
      {selectedSource.type === 'file' && (
        <FileViewer 
          source={selectedSource}
          sources={sources}
          setSources={setSources}
        />
      )}
    </div>
  );
};

export default ContentPanel;
