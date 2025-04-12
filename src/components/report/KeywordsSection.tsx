
import React from 'react';
import { SkillsGroup } from './keywords/SkillsGroup';
import { Skill } from './types';

interface KeywordsSectionProps {
  hardSkills: Skill[];
  softSkills: Skill[];
  isMobile?: boolean;
}

export const KeywordsSection: React.FC<KeywordsSectionProps> = ({ hardSkills, softSkills, isMobile }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Keywords Match</h3>
      
      {/* Hard Skills */}
      <SkillsGroup title="Hard Skills" skills={hardSkills} />
      
      {/* Soft Skills */}
      <SkillsGroup title="Soft Skills" skills={softSkills} />
    </div>
  );
};
