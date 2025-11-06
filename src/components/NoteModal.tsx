import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Source } from '@/pages/Index';
import { useToast } from '@/hooks/use-toast';

interface NoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sources: Source[];
  setSources: React.Dispatch<React.SetStateAction<Source[]>>;
  editingNote?: Source;
}

const NoteModal = ({ open, onOpenChange, sources, setSources, editingNote }: NoteModalProps) => {
  const [title, setTitle] = useState(editingNote?.name || '');
  const [content, setContent] = useState(editingNote?.content || '');
  const { toast } = useToast();

  const handleSave = () => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your note",
        variant: "destructive"
      });
      return;
    }

    if (!content.trim()) {
      toast({
        title: "Content required",
        description: "Please enter some content for your note",
        variant: "destructive"
      });
      return;
    }

    if (editingNote) {
      setSources(prev => prev.map(s => 
        s.id === editingNote.id 
          ? { ...s, name: title, content, preview: content.slice(0, 100) }
          : s
      ));
      toast({
        title: "Note updated",
        description: "Your changes have been saved"
      });
    } else {
      const newNote: Source = {
        id: crypto.randomUUID(),
        type: 'note',
        name: title,
        content,
        preview: content.slice(0, 100),
        timestamp: new Date(),
        chatHistory: []
      };

      setSources(prev => [newNote, ...prev]);
      toast({
        title: "Note created",
        description: "Your note has been added to sources"
      });
    }

    setTitle('');
    setContent('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Note</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Input
            placeholder="Note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          
          <Textarea
            placeholder="Write your note here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[300px] resize-none"
          />
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NoteModal;
