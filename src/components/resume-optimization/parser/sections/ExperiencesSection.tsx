
import React from 'react';
import { ExperiencesHeader } from './experiences/Header';
import { ExperiencesList } from './experiences/ExperiencesList';
import { useExperienceSection } from './experiences/useExperienceSection';
import { Experience } from './types';

interface ExperiencesSectionProps {
  experiences: Experience[];
  onChange: (experiences: Experience[]) => void;
}

const ExperiencesSection: React.FC<ExperiencesSectionProps> = ({ experiences = [], onChange }) => {
  const {
    openExperiences,
    toggleExperience,
    updateExperience,
    addExperience,
    removeExperience
  } = useExperienceSection(experiences, onChange);
  
  return (
    <div className="space-y-6">
      <ExperiencesHeader />
      
      <ExperiencesList
        experiences={experiences}
        openExperiences={openExperiences}
        onToggleExperience={toggleExperience}
        onUpdateExperience={updateExperience}
        onRemoveExperience={removeExperience}
        onAddExperience={addExperience}
      />
    </div>
  );
};

export default ExperiencesSection;
