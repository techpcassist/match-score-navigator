
import React from 'react';
import { CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { EducationForm } from '../EducationForm';
import { Education } from '../types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, AlertCircle, Sparkles } from 'lucide-react';

interface Step3EducationProps {
  entries: Education[];
  onChange: (entries: Education[]) => void;
  analysisReport?: any;
}

export const Step3Education: React.FC<Step3EducationProps> = ({ 
  entries, 
  onChange,
  analysisReport
}) => {
  // Extract any relevant insights from the analysis report
  const educationInsights = analysisReport?.section_analysis?.education || '';
  
  // Check if entries came from AI parsing
  const aiParsedEntries = analysisReport?.parsed_data?.education || [];
  const usingAIParsing = aiParsedEntries.length > 0;
  const hasEntries = entries.length > 0;
  
  return (
    <div className="space-y-6">
      <CardHeader>
        <CardTitle>Step 3: Education Details</CardTitle>
        <CardDescription>
          Complete your education information with institutions and degrees.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!hasEntries && (
          <Alert className="mb-6" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              We couldn't detect your education information from the resume. Please add your education details manually below.
            </AlertDescription>
          </Alert>
        )}
        
        {hasEntries && usingAIParsing && (
          <Alert className="mb-6" variant="default">
            <Sparkles className="h-4 w-4" />
            <AlertDescription>
              Our AI has detected {entries.length} education entries from your resume. 
              Please review and complete any missing information.
            </AlertDescription>
          </Alert>
        )}
        
        {hasEntries && !usingAIParsing && (
          <Alert className="mb-6" variant="default">
            <Info className="h-4 w-4" />
            <AlertDescription>
              We've detected {entries.length} education entries from your resume. 
              Please verify the information and complete any missing fields.
            </AlertDescription>
          </Alert>
        )}
        
        {educationInsights && (
          <Alert className="mb-6" variant="default">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>AI Analysis:</strong> {educationInsights}
            </AlertDescription>
          </Alert>
        )}
        
        <EducationForm
          entries={entries}
          onChange={onChange}
        />
      </CardContent>
    </div>
  );
};
