
import React from 'react';
import { CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { WorkExperienceForm } from '../WorkExperienceForm';
import { WorkExperienceEntry } from '../types';

interface Step2WorkExperienceProps {
  entries: WorkExperienceEntry[];
  onChange: (entries: WorkExperienceEntry[]) => void;
}

export const Step2WorkExperience: React.FC<Step2WorkExperienceProps> = ({ 
  entries, 
  onChange 
}) => {
  return (
    <div className="space-y-6">
      <CardHeader>
        <CardTitle>Step 2: Work Experience Details</CardTitle>
        <CardDescription>
          Ensure your work experience entries have all required information, especially dates and location.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <WorkExperienceForm 
          entries={entries}
          onChange={onChange}
        />
      </CardContent>
    </div>
  );
};
