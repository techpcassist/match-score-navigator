
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface AddExperienceButtonProps {
  onClick: () => void;
}

export const AddExperienceButton: React.FC<AddExperienceButtonProps> = ({ onClick }) => {
  return (
    <div className="flex justify-center">
      <Button 
        variant="outline" 
        onClick={onClick}
        className="flex items-center"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Another Position
      </Button>
    </div>
  );
};
