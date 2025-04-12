
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';
import { Skill } from '../types';

interface SkillBadgeProps {
  skill: Skill;
}

export const SkillBadge: React.FC<SkillBadgeProps> = ({ skill }) => {
  return (
    <Badge 
      variant={skill.matched ? "default" : "outline"}
      className={skill.matched ? "bg-green-500 hover:bg-green-600" : "border-red-300 text-red-500"}
    >
      {skill.term} {skill.matched ? 
        <CheckCircle className="ml-1 h-3 w-3" /> : 
        <XCircle className="ml-1 h-3 w-3" />
      }
    </Badge>
  );
};
