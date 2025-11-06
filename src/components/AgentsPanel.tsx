import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

interface AgentsPanelProps {
  onTogglePanel: () => void;
}

const AgentsPanel = ({ onTogglePanel }: AgentsPanelProps) => {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium">Agents</h2>
          <Button variant="ghost" size="icon" onClick={onTogglePanel}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Empty State */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-3">
          <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-sm font-medium mb-1">No agents yet</p>
        <p className="text-xs text-muted-foreground">
          Agents will help you analyze your sources
        </p>
      </div>
    </div>
  );
};

export default AgentsPanel;
