
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

interface EditorPreviewToggleProps {
  showPreview: boolean;
  setShowPreview: (show: boolean) => void;
}

export const EditorPreviewToggle: React.FC<EditorPreviewToggleProps> = ({ 
  showPreview, 
  setShowPreview 
}) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setShowPreview(!showPreview)}
    >
      {showPreview ? (
        <>
          <EyeOff className="h-4 w-4 mr-1" />
          Hide Preview
        </>
      ) : (
        <>
          <Eye className="h-4 w-4 mr-1" />
          Show Preview
        </>
      )}
    </Button>
  );
};
