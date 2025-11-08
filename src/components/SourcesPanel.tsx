import { ChangeEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Plus, ChevronLeft, Search, FileText, Image, Video, File, Upload, Link2, StickyNote, FolderOpen } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
// Add this helper function at the top of the file
const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

interface Source {
  id: string;
  name: string;
  type: string;
  content: string;
  preview?: string;
  chatHistory?: any[];
}

interface SourcesPanelProps {
  sources: Source[];
  setSources: React.Dispatch<React.SetStateAction<Source[]>>;
  selectedSourceId: string | null;
  setSelectedSourceId: (id: string | null) => void;
  onTogglePanel: () => void;
  showUploadModal: boolean;              // ADD THIS LINE
  setShowUploadModal: (show: boolean) => void; 
}

const SourcesPanel = ({
  sources,
  setSources,
  selectedSourceId,
  setSelectedSourceId,
  onTogglePanel,
  showUploadModal,        // ADD THIS LINE
  setShowUploadModal      // ADD THIS LINE
}: SourcesPanelProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  // REMOVE THIS LINE: const [showUploadModal, setShowUploadModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');

  const filteredSources = sources.filter(source =>
    source.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    source.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileUpload = (file: File) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const content = e.target?.result as string;
    const newSource: Source = {
      id: generateId(),
      name: file.name,
      type: file.type.includes('pdf') ? 'pdf' : file.type.includes('text') ? 'text' : 'file',
      content: content,
      preview: content.slice(0, 100),
      chatHistory: []
    };
    setSources(prev => [...prev, newSource]);
    setSelectedSourceId(newSource.id);
    setShowUploadModal(false);
    setShowLinkInput(false);
    setShowNoteInput(false);
  };
  reader.readAsText(file);
};

const handleAddLink = () => {
  if (!linkUrl.trim()) return;
  
  const newSource: Source = {
    id: generateId(),
    name: linkUrl,
    type: 'link',
    content: linkUrl,
    preview: linkUrl,
    chatHistory: []
  };
  setSources(prev => [...prev, newSource]);
  setSelectedSourceId(newSource.id);
  setLinkUrl('');
  setShowLinkInput(false);
  setShowUploadModal(false);
  setShowNoteInput(false);
};

const handleSaveNote = () => {
  if (!noteContent.trim()) return;

  const newSource: Source = {
    id: generateId(),
    name: noteTitle.trim() || 'Untitled Note',
    type: 'note',
    content: noteContent,
    preview: noteContent.slice(0, 100),
    chatHistory: []
  };
  setSources(prev => [...prev, newSource]);
  setSelectedSourceId(newSource.id);
  setNoteTitle('');
  setNoteContent('');
  setShowNoteInput(false);
  setShowUploadModal(false);
  setShowLinkInput(false);
};

  const handleDeleteSource = (id: string) => {
    setSources(prev => prev.filter(s => s.id !== id));
    if (selectedSourceId === id) {
      setSelectedSourceId(null);
    }
  };

  const getSourceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'text':
        return <FileText className="h-5 w-5" />;
      case 'image':
        return <Image className="h-5 w-5" />;
      case 'video':
        return <Video className="h-5 w-5" />;
      default:
        return <File className="h-5 w-5" />;
    }
  };

  function handleFileInputChange(event: ChangeEvent<HTMLInputElement>): void {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-finbyz-bg-light to-background">
      {/* Header */}
      <div className="p-6 border-b border-finbyz-border bg-white/80 backdrop-blur-sm shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-finbyz-orange/10 rounded-xl">
              <FileText className="h-6 w-6 text-finbyz-orange" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-finbyz-orange">Sources</h2>
              <p className="text-xs text-finbyz-text-gray">
                {sources.length} {sources.length === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onTogglePanel}
            className="bg-finbyz-orange/10 hover:bg-finbyz-orange/20 text-finbyz-orange rounded-xl transition-all hover:scale-105"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>

        <Button
          className="w-full justify-start gap-3 bg-finbyz-orange hover:bg-finbyz-orange-dark text-white font-semibold shadow-lg hover:shadow-xl transition-all rounded-xl py-6 group"
          onClick={() => setShowUploadModal(true)}
        >
          <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform" />
          Add New Source
        </Button>
      </div>

      {/* Search Bar */}
      <div className="px-6 py-4 border-b border-finbyz-border bg-white/50">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-finbyz-text-gray" />
          <Input
            placeholder="Search sources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 border-finbyz-border focus:border-finbyz-orange focus:ring-finbyz-orange rounded-xl bg-white shadow-sm"
          />
        </div>
      </div>

      {/* Sources List */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredSources.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-6 text-center">
            <div className="relative mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-finbyz-orange/20 to-finbyz-orange-light/20 rounded-3xl flex items-center justify-center shadow-2xl transform hover:rotate-3 transition-transform">
                <FileText className="w-12 h-12 text-finbyz-orange" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-finbyz-orange rounded-full flex items-center justify-center shadow-lg">
                <Plus className="w-5 h-5 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-finbyz-text-dark mb-2">
              No sources yet
            </h3>
            <p className="text-sm text-finbyz-text-gray max-w-xs">
              Click <span className="text-finbyz-orange font-semibold">Add New Source</span> to upload your first document
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredSources.map(source => (
              <div
                key={source.id}
                onClick={() => setSelectedSourceId(source.id)}
                className={`
                  group relative p-3 rounded-lg border transition-all cursor-pointer
                  ${selectedSourceId === source.id 
                    ? 'border-finbyz-orange bg-finbyz-orange/10' 
                    : 'border-transparent bg-white hover:bg-gray-50'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`
                    p-2 rounded-lg transition-colors flex-shrink-0
                    ${selectedSourceId === source.id 
                      ? 'bg-finbyz-orange text-white' 
                      : 'bg-gray-100 text-gray-600'
                    }
                  `}>
                    {getSourceIcon(source.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-finbyz-text-dark truncate">
                      {source.name}
                    </h4>
                  </div>
                  
                  {/* Delete Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSource(source.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-red-50 rounded text-red-500 flex-shrink-0"
                    title="Delete source"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {/* Upload Modal */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col border-2 border-finbyz-border">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-finbyz-text-dark text-center">
              Upload sources
            </DialogTitle>
            <DialogDescription className="text-finbyz-text-gray text-center">
              Drag and drop or choose file to upload
            </DialogDescription>
            <p className="text-xs text-finbyz-text-gray text-center pt-1">
              Supported file types: PDF, .txt, Markdown, Audio (e.g. mp3)
            </p>
          </DialogHeader>

          <div className="space-y-4 mt-4 overflow-y-auto flex-1 px-1">
            {/* File Upload Area */}
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                dragActive 
                  ? 'border-finbyz-orange bg-finbyz-orange/5' 
                  : 'border-finbyz-border hover:border-finbyz-orange/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                id="file-upload"
                type="file"
                onChange={handleFileInputChange}
                className="hidden"
                accept=".txt,.pdf,.doc,.docx,.md,.mp3,.wav"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center gap-3"
              >
                <div className="p-4 bg-finbyz-orange/10 rounded-xl">
                  <Upload className="h-8 w-8 text-finbyz-orange" />
                </div>
                <div>
                  <p className="text-finbyz-text-dark font-medium">
                    {dragActive ? 'Drop file here' : 'Click to upload or drag and drop'}
                  </p>
                </div>
              </label>
            </div>

            {/* Google Workspace */}
            <div className="border-2 border-finbyz-border rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center border border-finbyz-border">
                  <svg viewBox="0 0 24 24" className="w-4 h-4">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </div>
                <h3 className="font-semibold text-finbyz-text-dark">Google Workspace</h3>
              </div>
              <Button
                variant="outline"
                className="w-full justify-start gap-3 border-finbyz-border hover:border-finbyz-orange hover:bg-finbyz-orange/5 rounded-lg"
                onClick={() => {
                  console.log('Google Drive integration coming soon');
                }}
              >
                <FolderOpen className="h-5 w-5 text-finbyz-text-gray" />
                <span className="text-finbyz-text-gray">Google Drive</span>
              </Button>
            </div>

            {/* Link */}
            <div className="border-2 border-finbyz-border rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <Link2 className="h-5 w-5 text-finbyz-text-dark" />
                <h3 className="font-semibold text-finbyz-text-dark">Link</h3>
              </div>
              {!showLinkInput ? (
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 border-finbyz-border hover:border-finbyz-orange hover:bg-finbyz-orange/5 rounded-lg"
                  onClick={() => setShowLinkInput(true)}
                >
                  <Link2 className="h-5 w-5 text-finbyz-text-gray" />
                  <span className="text-finbyz-text-gray">Website</span>
                </Button>
              ) : (
                <div className="space-y-3">
                  <Input
                    placeholder="Enter website URL"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddLink()}
                    className="border-finbyz-border focus:border-finbyz-orange focus:ring-finbyz-orange"
                  />
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setShowLinkInput(false);
                        setLinkUrl('');
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleAddLink}
                      className="flex-1 bg-finbyz-orange hover:bg-finbyz-orange-dark text-white"
                    >
                      Add Link
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Note */}
            <div className="border-2 border-finbyz-border rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <StickyNote className="h-5 w-5 text-finbyz-text-dark" />
                <h3 className="font-semibold text-finbyz-text-dark">Note</h3>
              </div>
              {!showNoteInput ? (
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 border-finbyz-border hover:border-finbyz-orange hover:bg-finbyz-orange/5 rounded-lg"
                  onClick={() => setShowNoteInput(true)}
                >
                  <StickyNote className="h-5 w-5 text-finbyz-text-gray" />
                  <span className="text-finbyz-text-gray">Add Note</span>
                </Button>
              ) : (
                <div className="space-y-3">
                  <Input
                    placeholder="Title"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    className="border-finbyz-border focus:border-finbyz-orange focus:ring-finbyz-orange"
                  />
                  <Textarea
                    placeholder="Add Your Note here..."
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    rows={6}
                    className="border-finbyz-border focus:border-finbyz-orange focus:ring-finbyz-orange resize-none"
                  />
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setShowNoteInput(false);
                        setNoteTitle('');
                        setNoteContent('');
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleSaveNote}
                      className="flex-1 bg-finbyz-orange hover:bg-finbyz-orange-dark text-white"
                    >
                      Save
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Source Limit */}
            <div className="text-center pb-2">
              <p className="text-sm text-finbyz-text-gray">
                Source limit: {sources.length}/50
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SourcesPanel;
