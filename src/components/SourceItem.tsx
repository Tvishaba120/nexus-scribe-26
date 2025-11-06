import { useState } from 'react';
import { FileEdit, Link, FileText, Trash2, FileAudio } from 'lucide-react';
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
    const iconClass = "w-4 h-4";
    switch (source.type) {
      case 'note':
        return <FileEdit className={iconClass} />;
      case 'link':
        return <Link className={`${iconClass} text-blue-500`} />;
      case 'file':
        const ext = source.fileType?.toLowerCase();
        if (ext?.includes('pdf')) return <FileText className={`${iconClass} text-red-500`} />;
        if (ext?.includes('doc')) return <FileText className={`${iconClass} text-blue-600`} />;
        if (ext?.includes('audio') || ext?.includes('mp3')) return <FileAudio className={`${iconClass} text-orange-500`} />;
        return <FileText className={iconClass} />;
    }
  };

  const getTypeBadge = () => {
    if (source.type === 'link') return 'Website';
    if (source.type === 'note') return 'Text';
    if (source.fileType) {
      const ext = source.fileType.toLowerCase();
      if (ext.includes('pdf')) return 'PDF';
      if (ext.includes('doc')) return 'DOC';
      if (ext.includes('audio') || ext.includes('mp3')) return 'Audio';
      return 'File';
    }
    return 'Text';
  };

  const getMetadata = () => {
    if (source.type === 'link' && source.url) {
      try {
        return new URL(source.url).hostname;
      } catch {
        return '';
      }
    }
    if (source.fileSize) {
      const kb = Math.round(source.fileSize / 1024);
      return kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`;
    }
    return '';
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
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm font-medium truncate">{source.name}</p>
            <span className="text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
              {getTypeBadge()}
            </span>
            {showDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleDelete}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
          {getMetadata() && (
            <p className="text-xs text-muted-foreground truncate">
              {getMetadata()}
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
