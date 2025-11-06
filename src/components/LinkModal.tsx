import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Source } from '@/pages/Index';
import { useToast } from '@/hooks/use-toast';

interface LinkModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sources: Source[];
  setSources: React.Dispatch<React.SetStateAction<Source[]>>;
}

const LinkModal = ({ open, onOpenChange, sources, setSources }: LinkModalProps) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const { toast } = useToast();

  const isValidUrl = (urlString: string) => {
    try {
      new URL(urlString);
      return true;
    } catch {
      return false;
    }
  };

  const handleAddLink = () => {
    if (!url.trim()) {
      toast({
        title: "URL required",
        description: "Please enter a webpage URL",
        variant: "destructive"
      });
      return;
    }

    if (!isValidUrl(url)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL (e.g., https://example.com)",
        variant: "destructive"
      });
      return;
    }

    const linkTitle = title.trim() || new URL(url).hostname;

    const newLink: Source = {
      id: crypto.randomUUID(),
      type: 'link',
      name: linkTitle,
      content: url,
      url: url,
      preview: `Link to ${new URL(url).hostname}`,
      timestamp: new Date(),
      chatHistory: []
    };

    setSources(prev => [newLink, ...prev]);
    
    toast({
      title: "Link added",
      description: "The link has been saved to your sources"
    });

    setUrl('');
    setTitle('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Link</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Input
            placeholder="Enter webpage URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            type="url"
          />
          
          <Input
            placeholder="Link title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          
          <div className="flex justify-end">
            <Button onClick={handleAddLink}>
              Add Link
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LinkModal;
