
import React from 'react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronUp, ChevronDown, Trash2 } from 'lucide-react';
import { Experience } from '../types';
import { ExperienceCompanySection } from './components/ExperienceCompanySection';
import { ExperienceDateSection } from './components/ExperienceDateSection';
import { ExperienceDetailsSection } from './components/ExperienceDetailsSection';

interface ExperienceItemProps {
  experience: Experience;
  isOpen: boolean;
  onToggle: () => void;
  onUpdate: (field: keyof Experience, value: any) => void;
  onRemove: () => void;
}

export const ExperienceItem: React.FC<ExperienceItemProps> = ({
  experience,
  isOpen,
  onToggle,
  onUpdate,
  onRemove
}) => {
  return (
    <Collapsible 
      open={isOpen}
      onOpenChange={onToggle}
      className="border rounded-md"
    >
      <div className="flex items-center justify-between p-4 border-b bg-slate-50">
        <div className="flex items-center gap-2">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              {isOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <span className="font-medium">
            {experience.company_name || 'New Experience'} - {experience.job_title || 'Position'}
          </span>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      
      <CollapsibleContent>
        <div className="p-4 pt-6">
          <div className="grid gap-4">
            <ExperienceCompanySection 
              experience={experience} 
              onUpdate={onUpdate}
            />
            
            <ExperienceDateSection 
              experience={experience} 
              onUpdate={onUpdate}
            />
            
            <ExperienceDetailsSection 
              experience={experience} 
              onUpdate={onUpdate}
            />
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
