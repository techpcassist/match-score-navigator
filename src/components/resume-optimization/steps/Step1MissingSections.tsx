
import React from 'react';
import { CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { SectionCheckList } from '../SectionCheckList';
import { MissingSection } from '../types';

interface Step1MissingSectionsProps {
  missingSections: MissingSection[];
  onSelectionChange: (selectedSections: string[]) => void;
}

export const Step1MissingSections: React.FC<Step1MissingSectionsProps> = ({ 
  missingSections, 
  onSelectionChange 
}) => {
  return (
    <div className="space-y-6">
      <CardHeader>
        <CardTitle>Step 1: Review Missing Sections</CardTitle>
        <CardDescription>
          These sections are recommended based on the job description but appear to be missing from your resume.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SectionCheckList 
          missingSections={missingSections} 
          onSelectionChange={onSelectionChange}
        />
      </CardContent>
    </div>
  );
};
