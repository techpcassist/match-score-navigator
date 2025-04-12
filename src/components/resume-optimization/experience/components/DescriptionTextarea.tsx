
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface DescriptionTextareaProps {
  id: string;
  description: string;
  onDescriptionChange: (value: string) => void;
}

export const DescriptionTextarea: React.FC<DescriptionTextareaProps> = ({
  id,
  description,
  onDescriptionChange
}) => {
  return (
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
  );
};
