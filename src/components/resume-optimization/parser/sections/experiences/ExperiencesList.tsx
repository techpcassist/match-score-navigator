
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ExperienceItem } from './ExperienceItem';
import { Experience } from '../types';

interface ExperiencesListProps {
  experiences: Experience[];
  openExperiences: string[];
  onToggleExperience: (id: string) => void;
  onUpdateExperience: (id: string, field: keyof Experience, value: any) => void;
  onRemoveExperience: (id: string) => void;
  onAddExperience: () => void;
}

export const ExperiencesList: React.FC<ExperiencesListProps> = ({
  experiences,
  openExperiences,
  onToggleExperience,
  onUpdateExperience,
  onRemoveExperience,
  onAddExperience
}) => {
  return (
    <div className="space-y-6">
      {experiences.map((experience) => (
        <ExperienceItem
          key={experience.id}
          experience={experience}
          isOpen={openExperiences.includes(experience.id || '')}
          onToggle={() => onToggleExperience(experience.id || '')}
          onUpdate={(field, value) => onUpdateExperience(experience.id || '', field, value)}
          onRemove={() => onRemoveExperience(experience.id || '')}
        />
      ))}
      
      <Button variant="outline" onClick={onAddExperience} className="flex items-center w-full justify-center">
        <Plus className="mr-2 h-4 w-4" />
        Add Work Experience
      </Button>
    </div>
  );
};
