import { useState } from 'react';
import { FileEdit, Link, FileText, Trash2 } from 'lucide-react';
import { Source } from '@/pages/Index';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

interface SourceItemProps {
  source: Source;
  isSelected: boolean;
  onClick: () => void;
  onDelete: () => void;
}

const SourceItem = ({ source, isSelected, onClick, onDelete }: SourceItemProps) => {
  const [showDelete, setShowDelete] = useState(false);

  const getIcon = () => {
    switch (source.type) {
      case 'note':
        return <FileEdit className="h-4 w-4 text-primary" />;
      case 'link':
        return <Link className="h-4 w-4 text-blue-500" />;
      case 'file':
        const ext = source.fileType?.toLowerCase();
        const color = ext?.includes('pdf') ? 'text-red-500' : 
                     ext?.includes('doc') ? 'text-blue-600' : 
                     'text-gray-500';
        return <FileText className={`h-4 w-4 ${color}`} />;
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <div
      className={`group relative p-3 rounded-lg cursor-pointer transition-colors ${
        isSelected ? 'bg-accent' : 'hover:bg-muted'
      }`}
      onClick={onClick}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{getIcon()}</div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-medium truncate">{source.name}</h3>
            {showDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleDelete}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
          
          {source.preview && (
            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
              {source.preview}
            </p>
          )}
          
          <p className="text-xs text-muted-foreground mt-1">
            {formatDistanceToNow(new Date(source.timestamp), { addSuffix: true })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SourceItem;
