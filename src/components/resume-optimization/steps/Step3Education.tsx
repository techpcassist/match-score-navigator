
import React from 'react';
import { CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { EducationForm } from '../EducationForm';
import { Education } from '../types';

interface Step3EducationProps {
  entries: Education[];
  onChange: (entries: Education[]) => void;
}

export const Step3Education: React.FC<Step3EducationProps> = ({ 
  entries, 
  onChange 
}) => {
  return (
    <div className="space-y-6">
      <CardHeader>
        <CardTitle>Step 3: Education Details</CardTitle>
        <CardDescription>
          Complete your education information with institutions and degrees.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <EducationForm
          entries={entries}
          onChange={onChange}
        />
      </CardContent>
    </div>
  );
};
