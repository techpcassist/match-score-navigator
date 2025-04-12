
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Experience } from '../../types';

interface ExperienceDateSectionProps {
  experience: Experience;
  onUpdate: (field: keyof Experience, value: any) => void;
}

export const ExperienceDateSection: React.FC<ExperienceDateSectionProps> = ({ 
  experience, 
  onUpdate 
}) => {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor={`start-date-${experience.id}`}>Start Date (MM/YYYY)</Label>
        <Input
          id={`start-date-${experience.id}`}
          value={experience.start_date || ''}
          onChange={(e) => onUpdate('start_date', e.target.value)}
          placeholder="MM/YYYY"
        />
      </div>
      
      <div>
        <Label htmlFor={`end-date-${experience.id}`}>End Date (MM/YYYY)</Label>
        <div className="flex flex-col space-y-2">
          <Input
            id={`end-date-${experience.id}`}
            value={experience.is_present ? 'Present' : experience.end_date || ''}
            onChange={(e) => onUpdate('end_date', e.target.value)}
            placeholder="MM/YYYY"
            disabled={experience.is_present}
          />
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`current-job-${experience.id}`}
              checked={experience.is_present || experience.end_date === 'Present'}
              onCheckedChange={(checked) => 
                onUpdate('is_present', !!checked)
              }
            />
            <label
              htmlFor={`current-job-${experience.id}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I currently work here
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
