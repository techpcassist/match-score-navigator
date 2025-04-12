
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface JobDetailsInputsProps {
  id: string;
  teamName: string;
  teamSize: number;
  projectName: string;
  onTeamNameChange: (value: string) => void;
  onTeamSizeChange: (value: number) => void;
  onProjectNameChange: (value: string) => void;
}

export const JobDetailsInputs: React.FC<JobDetailsInputsProps> = ({
  id,
  teamName,
  teamSize,
  projectName,
  onTeamNameChange,
  onTeamSizeChange,
  onProjectNameChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
      <div>
        <Input
          id={`${id}-team-name`}
          value={teamName || ''}
          onChange={(e) => onTeamNameChange(e.target.value)}
          placeholder="Team Name"
        />
      </div>
      <div>
        <Input
          id={`${id}-team-size`}
          value={teamSize || ''}
          onChange={(e) => onTeamSizeChange(parseInt(e.target.value) || 0)}
          placeholder="Team Size"
          type="number"
        />
      </div>
      <div>
        <Input
          id={`${id}-project-name`}
          value={projectName || ''}
          onChange={(e) => onProjectNameChange(e.target.value)}
          placeholder="Project Name"
        />
      </div>
    </div>
  );
};
