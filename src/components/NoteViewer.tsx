import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Trash2 } from 'lucide-react';
import { Source } from '@/pages/Index';
import ChatSection from './ChatSection';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface NoteViewerProps {
  source: Source;
  sources: Source[];
  setSources: React.Dispatch<React.SetStateAction<Source[]>>;
}

const NoteViewer = ({ source, sources, setSources }: NoteViewerProps) => {
  const [title, setTitle] = useState(source.name);
  const [content, setContent] = useState(source.content);
  const { toast } = useToast();

  const handleSave = () => {
    setSources(prev => prev.map(s => 
      s.id === source.id 
        ? { ...s, name: title, content, preview: content.slice(0, 100) }
        : s
    ));
    
    toast({
      title: "Changes saved",
      description: "Your note has been updated"
    });
  };

  const handleDelete = () => {
    setSources(prev => prev.filter(s => s.id !== source.id));
    toast({
      title: "Note deleted",
      description: "The note has been removed"
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6 space-y-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-2xl font-semibold border-none px-0 focus-visible:ring-0"
            placeholder="Note title"
          />
          
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[400px] resize-none border-none px-0 focus-visible:ring-0 text-base"
            placeholder="Write your note here..."
          />
          
          <div className="flex items-center justify-between pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Last edited {formatDistanceToNow(new Date(source.timestamp), { addSuffix: true })}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Note
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <ChatSection source={source} sources={sources} setSources={setSources} />
    </div>
  );
};

export default NoteViewer;
