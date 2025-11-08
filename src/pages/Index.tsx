import { useState } from 'react';
import { Button } from '@/components/ui/button';
import SourcesPanel from '@/components/SourcesPanel';
import AgentsPanel from '@/components/AgentsPanel';
import ChatSection from '@/components/ChatSection';
import { FileText, Bot, Upload } from 'lucide-react';

interface Source {
  id: string;
  name: string;
  type: string;
  content: string;
  preview?: string;
  chatHistory?: any[];
}

const Index = () => {
  const [sources, setSources] = useState<Source[]>([]);
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  const [showSourcesPanel, setShowSourcesPanel] = useState(true);
  const [showAgentsPanel, setShowAgentsPanel] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false); 

  const selectedSource = sources.find(s => s.id === selectedSourceId);

  return (
    <div className="flex h-screen w-full bg-background">
      {/* Sources Panel */}
      {showSourcesPanel && (
        <div className="w-80 border-r border-finbyz-border shadow-xl">
          <SourcesPanel
            sources={sources}
            setSources={setSources}
            selectedSourceId={selectedSourceId}
            setSelectedSourceId={setSelectedSourceId}
            onTogglePanel={() => setShowSourcesPanel(false)}
            showUploadModal={showUploadModal}          // ADD THIS LINE
           setShowUploadModal={setShowUploadModal}    
          />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="h-16 border-b border-finbyz-border bg-white/80 backdrop-blur-sm shadow-sm flex items-center px-6 gap-4">
          {!showSourcesPanel && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSourcesPanel(true)}
              className="bg-finbyz-orange/10 hover:bg-finbyz-orange/20 text-finbyz-orange rounded-xl"
            >
              <FileText className="h-5 w-5" />
            </Button>
          )}
          {!showAgentsPanel && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowAgentsPanel(true)}
              className="bg-finbyz-orange/10 hover:bg-finbyz-orange/20 text-finbyz-orange rounded-xl ml-auto"
            >
              <Bot className="h-5 w-5" />
            </Button>
          )}
       
        </div>

        {/* Chat Area */}
        <div className="flex-1">
          {selectedSource ? (
            <ChatSection
              source={selectedSource}
              sources={sources}
              setSources={setSources}
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-b from-finbyz-bg-light to-background">
              <div className="text-center px-6">
                <div className="w-32 h-32 bg-gradient-to-br from-finbyz-orange/20 to-finbyz-orange-light/20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl hover:scale-105 transition-transform">
                  <Upload className="w-16 h-16 text-finbyz-orange" />
                </div>
                <h2 className="text-3xl font-bold text-finbyz-text-dark mb-3">
                  Add a source to get started
                </h2>
                <p className="text-finbyz-text-gray max-w-md mx-auto mb-8">
                  Upload a source document to start chatting with AI and extract intelligent insights
                </p>
                
                {/* Upload Button Added */}
                <Button
                   onClick={() => {
    setShowSourcesPanel(true);
    setShowUploadModal(true);  // CHANGE THIS - remove the old onClick code
  }}
                  className="bg-finbyz-orange hover:bg-finbyz-orange-dark text-white font-semibold px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  <Upload className="mr-3 h-6 w-6" />
                  Add Your First Source
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Agents Panel */}
      {showAgentsPanel && (
        <div className="w-80 border-l border-finbyz-border shadow-xl">
          <AgentsPanel onTogglePanel={() => setShowAgentsPanel(false)} />
        </div>
      )}
    </div>
  );
};

export default Index;
