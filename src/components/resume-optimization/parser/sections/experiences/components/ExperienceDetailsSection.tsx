
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Experience } from '../../types';

interface ExperienceDetailsSectionProps {
  experience: Experience;
  onUpdate: (field: keyof Experience, value: any) => void;
}

export const ExperienceDetailsSection: React.FC<ExperienceDetailsSectionProps> = ({ 
  experience, 
  onUpdate 
}) => {
  return (
    <>
      <div>
        <Label htmlFor={`responsibilities-${experience.id}`}>Responsibilities & Achievements</Label>
        <Textarea
          id={`responsibilities-${experience.id}`}
          value={experience.responsibilities_text || ''}
          onChange={(e) => onUpdate('responsibilities_text', e.target.value)}
          placeholder="Describe your role, responsibilities, and key achievements..."
          className="min-h-[150px]"
        />
      </div>
      
      <div>
        <Label htmlFor={`skills-${experience.id}`}>Skills & Tools Used</Label>
        <Textarea
          id={`skills-${experience.id}`}
          value={experience.skills_tools_used || ''}
          onChange={(e) => onUpdate('skills_tools_used', e.target.value)}
          placeholder="List skills and tools you used in this role (comma separated)..."
          className="min-h-[80px]"
        />
      </div>
    </>
  );
};
