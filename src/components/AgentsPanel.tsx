import { Button } from '@/components/ui/button';
import { ChevronRight, Bot, Zap, Brain, Sparkles } from 'lucide-react';

interface AgentsPanelProps {
  onTogglePanel: () => void;
}

const AgentsPanel = ({ onTogglePanel }: AgentsPanelProps) => {
  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-finbyz-bg-light to-background">
      {/* Header */}
      <div className="p-6 border-b border-finbyz-border bg-white/80 backdrop-blur-sm shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-finbyz-orange/10 rounded-xl relative">
              <Bot className="h-6 w-6 text-finbyz-orange" />
              <Sparkles className="h-3 w-3 text-finbyz-orange absolute -top-1 -right-1 animate-pulse" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-finbyz-orange">AI Agents</h2>
              <p className="text-xs text-finbyz-text-gray">
                0 active agents
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onTogglePanel}
            className="bg-finbyz-orange/10 hover:bg-finbyz-orange/20 text-finbyz-orange rounded-xl transition-all hover:scale-105"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Empty State */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex flex-col items-center justify-center h-full text-center">
          {/* Animated Icon Group */}
          <div className="relative mb-8">
            <div className="w-32 h-32 bg-gradient-to-br from-finbyz-orange/20 via-finbyz-orange-light/20 to-finbyz-orange/10 rounded-3xl flex items-center justify-center shadow-2xl">
              <Bot className="w-16 h-16 text-finbyz-orange" />
            </div>
            
            {/* Floating Icons */}
            <div className="absolute -top-2 -left-2 p-2 bg-white rounded-xl shadow-lg animate-bounce">
              <Zap className="w-5 h-5 text-finbyz-orange" />
            </div>
            <div className="absolute -bottom-2 -right-2 p-2 bg-white rounded-xl shadow-lg animate-bounce" style={{ animationDelay: '0.2s' }}>
              <Brain className="w-5 h-5 text-finbyz-orange" />
            </div>
            <div className="absolute -top-2 -right-2 p-2 bg-white rounded-xl shadow-lg animate-bounce" style={{ animationDelay: '0.4s' }}>
              <Sparkles className="w-5 h-5 text-finbyz-orange" />
            </div>
          </div>

          <h3 className="text-2xl font-bold text-finbyz-text-dark mb-3">
            No AI Agents Yet
          </h3>
          <p className="text-sm text-finbyz-text-gray max-w-md mb-8 leading-relaxed">
            AI agents will help you analyze, summarize, and extract insights from your sources automatically
          </p>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 gap-4 w-full max-w-md">
            <div className="p-4 bg-white rounded-xl border-2 border-finbyz-border hover:border-finbyz-orange/50 transition-all hover:shadow-lg">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-finbyz-orange/10 rounded-lg">
                  <Brain className="h-5 w-5 text-finbyz-orange" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-finbyz-text-dark text-sm mb-1">
                    Smart Analysis
                  </h4>
                  <p className="text-xs text-finbyz-text-gray">
                    Automatically analyze and understand your documents
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border-2 border-finbyz-border hover:border-finbyz-orange/50 transition-all hover:shadow-lg">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-finbyz-orange/10 rounded-lg">
                  <Zap className="h-5 w-5 text-finbyz-orange" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-finbyz-text-dark text-sm mb-1">
                    Quick Insights
                  </h4>
                  <p className="text-xs text-finbyz-text-gray">
                    Get instant summaries and key takeaways
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border-2 border-finbyz-border hover:border-finbyz-orange/50 transition-all hover:shadow-lg">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-finbyz-orange/10 rounded-lg">
                  <Sparkles className="h-5 w-5 text-finbyz-orange" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-finbyz-text-dark text-sm mb-1">
                    Smart Suggestions
                  </h4>
                  <p className="text-xs text-finbyz-text-gray">
                    Receive intelligent recommendations and actions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentsPanel;
