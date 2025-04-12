
import React, { useEffect } from 'react';
import { CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { WorkExperienceForm } from '../WorkExperienceForm';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, AlertCircle, Sparkles } from 'lucide-react';
import { useOptimizationContext } from '../context/OptimizationContext';

export const Step2WorkExperience: React.FC = () => {
  const { 
    workExperienceEntries, 
    handleWorkExperienceUpdate,
    usingAIParsing,
    analysisReport,
    setWorkExperienceEntries
  } = useOptimizationContext();
  
  // Extract any relevant insights from the analysis report
  const experienceInsights = analysisReport?.section_analysis?.experience || '';
  
  // Check if entries came from AI parsing
  const aiParsedEntries = analysisReport?.parsed_data?.work_experience || [];
  const hasEntries = workExperienceEntries && workExperienceEntries.length > 0;
  
  // Effect to ensure we have work experience entries if AI parsed some
  useEffect(() => {
    // If we have AI parsed entries but no entries in our state, use the AI parsed ones
    if (aiParsedEntries.length > 0 && (!workExperienceEntries || workExperienceEntries.length === 0)) {
      setWorkExperienceEntries(aiParsedEntries);
    }
  }, [aiParsedEntries, workExperienceEntries, setWorkExperienceEntries]);

  return (
    <div className="space-y-6">
      <CardHeader>
        <CardTitle>Step 2: Work Experience Details</CardTitle>
        <CardDescription>
          Ensure your work experience entries have all required information, especially dates and location.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Show message when no entries detected */}
        {(!hasEntries && aiParsedEntries.length === 0) && (
          <Alert className="mb-6" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              We couldn't detect your work experience from the resume. Please add your work history manually below.
            </AlertDescription>
          </Alert>
        )}
        
        {/* Show message for AI-parsed entries */}
        {hasEntries && usingAIParsing && (
          <Alert className="mb-6" variant="default">
            <Sparkles className="h-4 w-4" />
            <AlertDescription>
              Our AI has detected {workExperienceEntries.length} work experience entries from your resume. 
              Please review and complete any missing information.
            </AlertDescription>
          </Alert>
        )}
        
        {/* Show message for manually detected entries */}
        {hasEntries && !usingAIParsing && (
          <Alert className="mb-6" variant="default">
            <Info className="h-4 w-4" />
            <AlertDescription>
              We've detected {workExperienceEntries.length} work experience entries from your resume. 
              Please verify the information and complete any missing fields.
            </AlertDescription>
          </Alert>
        )}
        
        {/* Show insights from AI analysis if available */}
        {experienceInsights && (
          <Alert className="mb-6" variant="default">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>AI Analysis:</strong> {experienceInsights}
            </AlertDescription>
          </Alert>
        )}
        
        <WorkExperienceForm 
          entries={workExperienceEntries || []}
          onChange={handleWorkExperienceUpdate}
        />
      </CardContent>
    </div>
  );
};
