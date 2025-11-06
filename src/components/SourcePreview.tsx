import { Button } from '@/components/ui/button';
import { ExternalLink, Trash2, FileText, Link as LinkIcon, FileEdit } from 'lucide-react';
import { Source } from '@/pages/Index';
import { useToast } from '@/hooks/use-toast';

interface SourcePreviewProps {
  source: Source;
  sources: Source[];
  setSources: React.Dispatch<React.SetStateAction<Source[]>>;
}

const SourcePreview = ({ source, sources, setSources }: SourcePreviewProps) => {
  const { toast } = useToast();

  const handleDelete = () => {
    setSources(prev => prev.filter(s => s.id !== source.id));
    toast({
      title: "Source deleted",
      description: `${source.name} has been removed`
    });
  };

  const getIcon = () => {
    switch (source.type) {
      case 'note':
        return <FileEdit className="w-5 h-5" />;
      case 'link':
        return <LinkIcon className="w-5 h-5 text-blue-500" />;
      case 'file':
        return <FileText className="w-5 h-5 text-red-500" />;
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
            {getIcon()}
          </div>
          <div>
            <h2 className="font-semibold text-lg">{source.name}</h2>
            <p className="text-sm text-muted-foreground">
              {source.type === 'link' && 'Website'}
              {source.type === 'note' && 'Text'}
              {source.type === 'file' && source.fileType}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {source.type === 'link' && source.url && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(source.url, '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open in new tab
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete source
          </Button>
        </div>
      </div>

      {/* Content Preview */}
      <div className="bg-muted/50 rounded-lg p-4 max-h-48 overflow-y-auto">
        {source.type === 'link' ? (
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              {source.url}
            </p>
          </div>
        ) : (
          <p className="text-sm whitespace-pre-wrap">
            {source.content.slice(0, 500)}
            {source.content.length > 500 && '...'}
          </p>
        )}
      </div>
    </div>
  );
};

export default SourcePreview;
