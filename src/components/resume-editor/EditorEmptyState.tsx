
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface EditorEmptyStateProps {
  onAddSection: () => void;
}

export const EditorEmptyState: React.FC<EditorEmptyStateProps> = ({ onAddSection }) => {
  return (
    <div className="bg-card p-8 rounded-lg border h-[calc(100vh-180px)] flex items-center justify-center">
      <div className="text-center">
        <p className="text-muted-foreground mb-4">No resume sections found. Create your first section to get started.</p>
        <Button onClick={onAddSection}>
          <PlusCircle className="h-4 w-4 mr-1" />
          Add Section
        </Button>
      </div>
    </div>
  );
};
