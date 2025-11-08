import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { X, Upload, Link as LinkIcon, FileText, FolderOpen } from 'lucide-react';

/**
 * Local Source type used by UploadSourcesModal.
 * Adjust fields here if the Source shape changes elsewhere in your app.
 */
interface Source {
  id: string;
  type: 'file' | 'link' | 'note';
  name: string;
  content: string;
  preview?: string;
  timestamp: Date;
  fileType?: string;
  fileSize?: number;
  url?: string;
  chatHistory: any[];
}

import { useToast } from '@/hooks/use-toast';

interface UploadSourcesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sources: Source[];
  setSources: React.Dispatch<React.SetStateAction<Source[]>>;
}

const UploadSourcesModal = ({ open, onOpenChange, sources, setSources }: UploadSourcesModalProps) => {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = (file: File) => {
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
        title: "Source added successfully",
        description: `${file.name} has been uploaded`
      });
      onOpenChange(false);
    };

    reader.readAsText(file);
  };

  const handleChooseFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx,.txt,.mp3,.mp4,.md';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) handleFileUpload(file);
    };
    input.click();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleAddLink = () => {
    if (!linkUrl) return;
    
    try {
      new URL(linkUrl);
    } catch {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL",
        variant: "destructive"
      });
      return;
    }

    const domain = new URL(linkUrl).hostname;
    const newSource: Source = {
      id: crypto.randomUUID(),
      type: 'link',
      name: domain,
      content: linkUrl,
      preview: linkUrl,
      timestamp: new Date(),
      url: linkUrl,
      chatHistory: []
    };

    setSources(prev => [newSource, ...prev]);
    toast({
      title: "Source added successfully",
      description: "Link has been added"
    });
    setLinkUrl('');
    setShowLinkInput(false);
    onOpenChange(false);
  };

  const handleSaveNote = () => {
    if (!noteContent.trim()) return;

    const newSource: Source = {
      id: crypto.randomUUID(),
      type: 'note',
      name: noteTitle.trim() || 'Untitled Note',
      content: noteContent,
      preview: noteContent.slice(0, 100),
      timestamp: new Date(),
      chatHistory: []
    };

    setSources(prev => [newSource, ...prev]);
    toast({
      title: "Source added successfully",
      description: "Note has been saved"
    });
    setNoteTitle('');
    setNoteContent('');
    setShowNoteInput(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 text-primary">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                </svg>
              </div>
              <span className="font-semibold">NotebookLM</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center mb-6 transition-colors ${
              isDragging ? 'border-primary bg-primary/5' : 'border-border'
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Upload sources</h3>
            <p className="text-muted-foreground mb-2">
              Drag and drop or{' '}
              <button onClick={handleChooseFile} className="text-primary hover:underline">
                choose file
              </button>{' '}
              to upload
            </p>
            <p className="text-sm text-muted-foreground">
              Supported file types: PDF, .txt, Markdown, Audio (e.g. mp3)
            </p>
          </div>

          {/* Google Workspace */}
          <div className="mb-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8">
                  <svg viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium">Google Workspace</h4>
                </div>
              </div>
              <Button variant="outline" className="w-full" disabled>
                <FolderOpen className="mr-2 h-4 w-4" />
                Google Drive
              </Button>
            </div>
          </div>

          {/* Link Section */}
          <div className="mb-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <LinkIcon className="w-5 h-5" />
                <h4 className="font-medium">Link</h4>
              </div>
              {!showLinkInput ? (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowLinkInput(true)}
                >
                  <LinkIcon className="mr-2 h-4 w-4" />
                  Website
                </Button>
              ) : (
                <div className="space-y-3">
                  <Input
                    placeholder="Enter website URL"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddLink()}
                  />
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setShowLinkInput(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddLink}>Add Link</Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Note Section */}
          <div className="mb-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <FileText className="w-5 h-5" />
                <h4 className="font-medium">Note</h4>
              </div>
              {!showNoteInput ? (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowNoteInput(true)}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Add Note
                </Button>
              ) : (
                <div className="space-y-3">
                  <Input
                    placeholder="Title"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                  />
                  <Textarea
                    placeholder="Type or paste your text here..."
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    rows={6}
                  />
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setShowNoteInput(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveNote}>Save</Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Source Limit */}
          <div className="text-center text-sm text-muted-foreground">
            Source limit: {sources.length}/50
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadSourcesModal;
