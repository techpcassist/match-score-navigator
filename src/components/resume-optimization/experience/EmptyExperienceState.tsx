
import React from 'react';
import { Button } from '@/components/ui/button';

interface EmptyExperienceStateProps {
  onAddExperience: () => void;
}

export const EmptyExperienceState: React.FC<EmptyExperienceStateProps> = ({ onAddExperience }) => {
  return (
    <div className="text-center py-6">
      <p className="text-muted-foreground mb-4">Add your work experience details to improve your resume.</p>
      <Button onClick={onAddExperience}>Add Work Experience</Button>
    </div>
  );
};
