
import React from 'react';
import { SkillBadge } from './SkillBadge';
import { Skill } from '../types';

interface SkillsGroupProps {
  title: string;
  skills: Skill[];
}

export const SkillsGroup: React.FC<SkillsGroupProps> = ({ title, skills }) => {
  const totalMatchedSkills = skills.filter(skill => skill.matched).length;
  const totalSkills = skills.length;
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h4 className="font-medium">{title}</h4>
        <span className="text-sm">{totalMatchedSkills} of {totalSkills} matched</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <SkillBadge key={index} skill={skill} />
        ))}
      </div>
    </div>
  );
};
