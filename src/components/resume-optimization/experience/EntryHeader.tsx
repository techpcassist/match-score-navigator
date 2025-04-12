
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown, Trash2 } from 'lucide-react';
import { CollapsibleTrigger } from '@/components/ui/collapsible';

interface EntryHeaderProps {
  isOpen: boolean;
  company: string;
  title: string;
  onRemove: () => void;
}

export const EntryHeader: React.FC<EntryHeaderProps> = ({ 
  isOpen, 
  company, 
  title, 
  onRemove 
}) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="p-2 h-auto">
            {isOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        <span className="font-medium">
          {company || 'Company'} - {title || 'Position'}
        </span>
      </div>
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onRemove}
        className="text-red-500 hover:text-red-700 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
