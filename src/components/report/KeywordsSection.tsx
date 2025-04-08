
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';
import { Skill } from './types';

interface KeywordsSectionProps {
  hardSkills: Skill[];
  softSkills: Skill[];
}

export const KeywordsSection = ({ hardSkills, softSkills }: KeywordsSectionProps) => {
  const totalMatchedHardSkills = hardSkills.filter(skill => skill.matched).length;
  const totalHardSkills = hardSkills.length;
  
  const totalMatchedSoftSkills = softSkills.filter(skill => skill.matched).length;
  const totalSoftSkills = softSkills.length;
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Keywords Match</h3>
      
      {/* Hard Skills */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h4 className="font-medium">Hard Skills</h4>
          <span className="text-sm">{totalMatchedHardSkills} of {totalHardSkills} matched</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {hardSkills.map((skill, index) => (
            <Badge 
              key={index} 
              variant={skill.matched ? "default" : "outline"}
              className={skill.matched ? "bg-green-500 hover:bg-green-600" : "border-red-300 text-red-500"}
            >
              {skill.term} {skill.matched ? <CheckCircle className="ml-1 h-3 w-3" /> : <XCircle className="ml-1 h-3 w-3" />}
            </Badge>
          ))}
        </div>
      </div>
      
      {/* Soft Skills */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h4 className="font-medium">Soft Skills</h4>
          <span className="text-sm">{totalMatchedSoftSkills} of {totalSoftSkills} matched</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {softSkills.map((skill, index) => (
            <Badge 
              key={index} 
              variant={skill.matched ? "default" : "outline"}
              className={skill.matched ? "bg-green-500 hover:bg-green-600" : "border-red-300 text-red-500"}
            >
              {skill.term} {skill.matched ? <CheckCircle className="ml-1 h-3 w-3" /> : <XCircle className="ml-1 h-3 w-3" />}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};
