
import React from 'react';
import { CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { SuggestionsList } from '../SuggestionsList';
import { KeywordSuggestion, FormattingSuggestion, SectionSuggestion } from '../types';

interface Step5SuggestionsProps {
  keywordSuggestions: KeywordSuggestion[];
  formatSuggestions: FormattingSuggestion[];
  sectionSuggestions: SectionSuggestion[];
  onSuggestionAction: (id: string, action: 'accept' | 'edit' | 'ignore') => void;
}

export const Step5Suggestions: React.FC<Step5SuggestionsProps> = ({ 
  keywordSuggestions,
  formatSuggestions,
  sectionSuggestions,
  onSuggestionAction
}) => {
  return (
    <div className="space-y-6">
      <CardHeader>
        <CardTitle>Step 5: Review Suggestions</CardTitle>
        <CardDescription>
          Review AI-generated suggestions to optimize your resume for this job.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SuggestionsList 
          keywordSuggestions={keywordSuggestions}
          formatSuggestions={formatSuggestions}
          sectionSuggestions={sectionSuggestions}
          onSuggestionAction={onSuggestionAction}
        />
      </CardContent>
    </div>
  );
};
