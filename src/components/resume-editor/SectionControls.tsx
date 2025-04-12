
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MoveUp, MoveDown, Trash2 } from 'lucide-react';

interface ResumeSection {
  id: string;
  title: string;
  content: string;
  type: string;
}

interface SectionControlsProps {
  section: ResumeSection;
  onUpdate: (updatedSection: ResumeSection) => void;
  onMove: (sectionId: string, direction: 'up' | 'down') => void;
  onDelete: (sectionId: string) => void;
  isFirstSection: boolean;
  isLastSection: boolean;
  canDelete: boolean;
  sectionTypes: string[];
}

export const SectionControls: React.FC<SectionControlsProps> = ({
  section,
  onUpdate,
  onMove,
  onDelete,
  isFirstSection,
  isLastSection,
  canDelete,
  sectionTypes
}) => {
  return (
    <div className="flex justify-between items-center mb-2">
      <div className="flex items-center gap-2">
        <Input
          value={section.title}
          onChange={(e) => onUpdate({ ...section, title: e.target.value })}
          className="w-48 h-8"
          placeholder="Section Title"
        />
        <Select 
          value={section.type}
          onValueChange={(value) => onUpdate({ ...section, type: value })}
        >
          <SelectTrigger className="w-36 h-8">
            <SelectValue placeholder="Section Type" />
          </SelectTrigger>
          <SelectContent>
            {sectionTypes.map(type => (
              <SelectItem key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-1">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
          onClick={() => onMove(section.id, 'up')}
          disabled={isFirstSection}
        >
          <MoveUp className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
          onClick={() => onMove(section.id, 'down')}
          disabled={isLastSection}
        >
          <MoveDown className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-destructive"
          onClick={() => onDelete(section.id)}
          disabled={!canDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
