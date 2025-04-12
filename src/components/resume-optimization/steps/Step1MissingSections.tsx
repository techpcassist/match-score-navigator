
import React from 'react';
import { CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { SectionCheckList } from '../SectionCheckList';
import { useOptimizationContext } from '../context/OptimizationContext';

export const Step1MissingSections: React.FC = () => {
  const { missingSections, handleSectionSelection } = useOptimizationContext();

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
          onSelectionChange={handleSectionSelection}
        />
      </CardContent>
    </div>
  );
};
