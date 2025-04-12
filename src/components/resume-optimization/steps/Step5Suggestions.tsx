
import React from 'react';
import { CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { SuggestionsList } from '../SuggestionsList';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BookOpen, Info, Sparkles } from 'lucide-react';
import { useOptimizationContext } from '../context/OptimizationContext';

export const Step5Suggestions: React.FC = () => {
  const { 
    keywordSuggestions,
    formatSuggestions,
    sectionSuggestions,
    handleSuggestionAction,
    analysisReport
  } = useOptimizationContext();
  
  const hasSuggestions = keywordSuggestions.length > 0 || 
                        formatSuggestions.length > 0 || 
                        sectionSuggestions.length > 0;
  
  const matchScore = analysisReport?.match_score || 0;
  const improvementPotential = analysisReport?.improvement_potential;
  const hasAIEnhancedSuggestions = !!analysisReport?.improvement_potential;
  
  return (
    <div className="space-y-6">
      <CardHeader>
        <CardTitle>Step 5: Review Suggestions</CardTitle>
        <CardDescription>
          Review AI-generated suggestions to optimize your resume for this job.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {hasAIEnhancedSuggestions && (
          <Alert className="mb-6" variant="default">
            <Sparkles className="h-4 w-4" />
            <AlertDescription>
              Our AI has analyzed your resume against the job description and generated tailored suggestions to increase your match rate.
            </AlertDescription>
          </Alert>
        )}
        
        {matchScore > 0 && (
          <Alert className="mb-6" variant="default">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Current match score: {matchScore}%</strong>. 
              Implementing the suggestions below may improve your resume's compatibility with this job.
            </AlertDescription>
          </Alert>
        )}
        
        {improvementPotential && (
          <Alert className="mb-6" variant="default">
            <BookOpen className="h-4 w-4" />
            <AlertDescription className="space-y-2">
              <p><strong>Keyword optimization potential:</strong> {improvementPotential.keyword_optimization?.level || 'unknown'}</p>
              <p><strong>Structure optimization potential:</strong> {improvementPotential.structure_optimization?.level || 'unknown'}</p>
              <p><strong>Achievement emphasis potential:</strong> {improvementPotential.achievement_emphasis?.level || 'unknown'}</p>
            </AlertDescription>
          </Alert>
        )}
        
        {!hasSuggestions && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No AI suggestions were generated based on your resume and the job description.
              This could mean your resume is already well-optimized for this position,
              or that we need more information to generate meaningful suggestions.
            </p>
          </div>
        )}
        
        {hasSuggestions && (
          <SuggestionsList 
            keywordSuggestions={keywordSuggestions}
            formatSuggestions={formatSuggestions}
            sectionSuggestions={sectionSuggestions}
            onSuggestionAction={handleSuggestionAction}
          />
        )}
      </CardContent>
    </div>
  );
};
