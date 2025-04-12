
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { generateJobDescription } from '../utils/description-generator';

interface JobDetailsFieldsProps {
  id: string;
  title: string;
  teamName: string;
  teamSize: number;
  projectName: string;
  description: string;
  isGenerating: boolean;
  onTeamNameChange: (value: string) => void;
  onTeamSizeChange: (value: number) => void;
  onProjectNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onGenerateDescription: () => void;
}

export const JobDetailsFields: React.FC<JobDetailsFieldsProps> = ({
  id,
  title,
  teamName,
  teamSize,
  projectName,
  description,
  isGenerating,
  onTeamNameChange,
  onTeamSizeChange,
  onProjectNameChange,
  onDescriptionChange,
  onGenerateDescription
}) => {
  return (
    <div className="space-y-2">
      <Label>Job Details (for AI-generated description)</Label>
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
      
      <div className="flex items-end gap-2">
        <div className="flex-grow">
          <Label htmlFor={`${id}-description`}>Description & Achievements</Label>
          <Textarea
            id={`${id}-description`}
            value={description || ''}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Include your responsibilities and quantifiable achievements"
            rows={5}
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onGenerateDescription}
          disabled={isGenerating || !title}
          className="mb-1 h-9"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          {isGenerating ? 'Generating...' : 'Generate'}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Pro tip: Add job details above and click "Generate" to create an AI-powered job description with achievements.
      </p>
    </div>
  );
};
