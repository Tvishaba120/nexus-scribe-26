import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, FileEdit, Link, FileText, Plug } from 'lucide-react';
import { Source } from '@/pages/Index';
import NoteModal from './NoteModal';
import LinkModal from './LinkModal';
import { useToast } from '@/hooks/use-toast';

interface AddItemDropdownProps {
  sources: Source[];
  setSources: React.Dispatch<React.SetStateAction<Source[]>>;
}

const AddItemDropdown = ({ sources, setSources }: AddItemDropdownProps) => {
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx,.txt';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "File exceeds 10MB limit",
          variant: "destructive"
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        
        const newSource: Source = {
          id: crypto.randomUUID(),
          type: 'file',
          name: file.name,
          content: content,
          preview: content.slice(0, 100),
          timestamp: new Date(),
          fileType: file.type || file.name.split('.').pop()?.toUpperCase(),
          fileSize: file.size,
          chatHistory: []
        };

        setSources(prev => [newSource, ...prev]);
        toast({
          title: "File uploaded",
          description: `${file.name} has been added to your sources`
        });
      };

      reader.readAsText(file);
    };

    input.click();
  };

  const handleConnect = () => {
    toast({
      title: "Coming soon",
      description: "Integration features will be available soon"
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="w-full justify-start gap-2" variant="secondary">
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuItem onClick={() => setShowNoteModal(true)}>
            <FileEdit className="mr-2 h-4 w-4" />
            <div className="flex flex-col">
              <span className="font-medium">Note</span>
              <span className="text-xs text-muted-foreground">Write down your thoughts</span>
            </div>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => setShowLinkModal(true)}>
            <Link className="mr-2 h-4 w-4" />
            <div className="flex flex-col">
              <span className="font-medium">Link</span>
              <span className="text-xs text-muted-foreground">Save any webpage</span>
            </div>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={handleFileUpload}>
            <FileText className="mr-2 h-4 w-4" />
            <div className="flex flex-col">
              <span className="font-medium">File</span>
              <span className="text-xs text-muted-foreground">Upload any file</span>
            </div>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={handleConnect}>
            <Plug className="mr-2 h-4 w-4" />
            <div className="flex flex-col">
              <span className="font-medium">Connect</span>
              <span className="text-xs text-muted-foreground">Connect to your favorite apps</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <NoteModal
        open={showNoteModal}
        onOpenChange={setShowNoteModal}
        sources={sources}
        setSources={setSources}
      />

      <LinkModal
        open={showLinkModal}
        onOpenChange={setShowLinkModal}
        sources={sources}
        setSources={setSources}
      />
    </>
  );
};

export default AddItemDropdown;
