
import React from 'react';
import { CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { WorkExperienceForm } from '../WorkExperienceForm';
import { WorkExperienceEntry } from '../types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, AlertCircle } from 'lucide-react';

interface Step2WorkExperienceProps {
  entries: WorkExperienceEntry[];
  onChange: (entries: WorkExperienceEntry[]) => void;
  analysisReport?: any;
}

export const Step2WorkExperience: React.FC<Step2WorkExperienceProps> = ({ 
  entries, 
  onChange,
  analysisReport
}) => {
  // Extract any relevant insights from the analysis report
  const experienceInsights = analysisReport?.section_analysis?.experience || '';
  
  // Check if entries came from AI parsing or manual parsing
  const aiParsedEntries = analysisReport?.parsed_data?.work_experience || [];
  const usingAIParsing = aiParsedEntries.length > 0;
  const hasEntries = entries.length > 0;
  
  return (
    <div className="space-y-6">
      <CardHeader>
        <CardTitle>Step 2: Work Experience Details</CardTitle>
        <CardDescription>
          Ensure your work experience entries have all required information, especially dates and location.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!hasEntries && (
          <Alert className="mb-6" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              We couldn't detect your work experience from the resume. Please add your work history manually below.
            </AlertDescription>
          </Alert>
        )}
        
        {hasEntries && (
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              We've detected {entries.length} work experience entries from your resume. 
              Please verify the information and complete any missing fields.
            </AlertDescription>
          </Alert>
        )}
        
        {experienceInsights && (
          <Alert className="mb-6" variant="default">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>AI Analysis:</strong> {experienceInsights}
            </AlertDescription>
          </Alert>
        )}
        
        <WorkExperienceForm 
          entries={entries}
          onChange={onChange}
        />
      </CardContent>
    </div>
  );
};
