import { Button } from '@/components/ui/button';
import { ExternalLink, Trash2, Link as LinkIcon } from 'lucide-react';
import { Source } from '@/pages/Index';
import ChatSection from './ChatSection';
import { useToast } from '@/hooks/use-toast';

interface LinkViewerProps {
  source: Source;
  sources: Source[];
  setSources: React.Dispatch<React.SetStateAction<Source[]>>;
}

const LinkViewer = ({ source, sources, setSources }: LinkViewerProps) => {
  const { toast } = useToast();

  const handleDelete = () => {
    setSources(prev => prev.filter(s => s.id !== source.id));
    toast({
      title: "Link deleted",
      description: "The link has been removed"
    });
  };

  const handleOpenLink = () => {
    if (source.url) {
      window.open(source.url, '_blank', 'noopener,noreferrer');
    }
  };

  const getDomain = () => {
    try {
      return new URL(source.url || '').hostname;
    } catch {
      return source.url;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <LinkIcon className="h-6 w-6 text-primary" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-semibold mb-2">{source.name}</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="truncate">{source.url}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <Button onClick={handleOpenLink}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in new tab
              </Button>
              <Button variant="outline" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Link
              </Button>
            </div>
          </div>
          
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              💡 Tip: Ask questions about this webpage in the chat below
            </p>
          </div>
        </div>
      </div>
      
      <ChatSection source={source} sources={sources} setSources={setSources} />
    </div>
  );
};

export default LinkViewer;
