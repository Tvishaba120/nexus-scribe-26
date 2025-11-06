import { Button } from '@/components/ui/button';
import { Download, Trash2, FileText } from 'lucide-react';
import { Source } from '@/pages/Index';
import ChatSection from './ChatSection';
import { useToast } from '@/hooks/use-toast';

interface FileViewerProps {
  source: Source;
  sources: Source[];
  setSources: React.Dispatch<React.SetStateAction<Source[]>>;
}

const FileViewer = ({ source, sources, setSources }: FileViewerProps) => {
  const { toast } = useToast();

  const handleDelete = () => {
    setSources(prev => prev.filter(s => s.id !== source.id));
    toast({
      title: "File deleted",
      description: "The file has been removed"
    });
  };

  const handleDownload = () => {
    const blob = new Blob([source.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = source.name;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download started",
      description: `${source.name} is being downloaded`
    });
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-semibold mb-1">{source.name}</h2>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span>{source.fileType}</span>
                  <span>•</span>
                  <span>{formatFileSize(source.fileSize)}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete File
              </Button>
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-sm font-medium mb-3">File Content</h3>
            <div className="bg-muted rounded-lg p-4 max-h-[400px] overflow-y-auto">
              <pre className="text-sm whitespace-pre-wrap font-mono">
                {source.content}
              </pre>
            </div>
          </div>
        </div>
      </div>
      
      <ChatSection source={source} sources={sources} setSources={setSources} />
    </div>
  );
};

export default FileViewer;
