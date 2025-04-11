
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { KeywordSuggestion, SectionSuggestion, FormattingSuggestion } from './types';
import { CheckCircle, Edit, XCircle } from 'lucide-react';

interface SuggestionsListProps {
  keywordSuggestions: KeywordSuggestion[];
  formatSuggestions: FormattingSuggestion[];
  sectionSuggestions: SectionSuggestion[];
  onSuggestionAction: (id: string, action: 'accept' | 'edit' | 'ignore') => void;
}

export const SuggestionsList = ({ 
  keywordSuggestions, 
  formatSuggestions, 
  sectionSuggestions,
  onSuggestionAction 
}: SuggestionsListProps) => {
  const [editingSuggestion, setEditingSuggestion] = useState<string | null>(null);
  const [editedText, setEditedText] = useState<string>('');
  const [actionTaken, setActionTaken] = useState<Record<string, 'accept' | 'edit' | 'ignore'>>({});
  
  const handleEdit = (id: string, initialText: string) => {
    setEditingSuggestion(id);
    setEditedText(initialText);
  };
  
  const handleSaveEdit = (id: string) => {
    onSuggestionAction(id, 'edit');
    setActionTaken(prev => ({ ...prev, [id]: 'edit' }));
    setEditingSuggestion(null);
  };
  
  const handleAction = (id: string, action: 'accept' | 'ignore') => {
    onSuggestionAction(id, action);
    setActionTaken(prev => ({ ...prev, [id]: action }));
  };
  
  const renderSuggestionActions = (id: string, suggestedText: string) => {
    if (actionTaken[id]) {
      return (
        <div className="flex items-center text-sm font-medium mt-2">
          {actionTaken[id] === 'accept' && (
            <span className="text-green-600 flex items-center">
              <CheckCircle className="h-4 w-4 mr-1" /> Accepted
            </span>
          )}
          {actionTaken[id] === 'edit' && (
            <span className="text-blue-600 flex items-center">
              <Edit className="h-4 w-4 mr-1" /> Edited
            </span>
          )}
          {actionTaken[id] === 'ignore' && (
            <span className="text-gray-600 flex items-center">
              <XCircle className="h-4 w-4 mr-1" /> Ignored
            </span>
          )}
        </div>
      );
    }
    
    if (editingSuggestion === id) {
      return (
        <div className="mt-2">
          <Textarea 
            value={editedText} 
            onChange={(e) => setEditedText(e.target.value)}
            className="mb-2"
            rows={3}
          />
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setEditingSuggestion(null)}
            >
              Cancel
            </Button>
            <Button 
              size="sm" 
              onClick={() => handleSaveEdit(id)}
            >
              Save
            </Button>
          </div>
        </div>
      );
    }
    
    return (
      <div className="flex justify-end space-x-2 mt-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handleAction(id, 'ignore')}
        >
          Ignore
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handleEdit(id, suggestedText)}
        >
          Edit
        </Button>
        <Button 
          size="sm" 
          onClick={() => handleAction(id, 'accept')}
        >
          Accept
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Keyword Suggestions */}
      {keywordSuggestions.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-3">Keyword Suggestions</h3>
          <div className="space-y-3">
            {keywordSuggestions.map(suggestion => (
              <Card key={suggestion.id}>
                <CardContent className="pt-4">
                  <p className="font-medium text-sm">Missing keyword: <span className="text-blue-600">{suggestion.keyword}</span></p>
                  <p className="mt-1 text-muted-foreground">{suggestion.suggestedText}</p>
                  {renderSuggestionActions(suggestion.id, suggestion.suggestedText)}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Section Suggestions */}
      {sectionSuggestions.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-3">Section Suggestions</h3>
          <div className="space-y-3">
            {sectionSuggestions.map(suggestion => (
              <Card key={suggestion.id}>
                <CardContent className="pt-4">
                  <p className="font-medium text-sm">Add missing section: <span className="text-blue-600">{suggestion.sectionName}</span></p>
                  <pre className="mt-1 text-muted-foreground whitespace-pre-wrap p-2 bg-muted rounded-md">
                    {suggestion.suggestedText}
                  </pre>
                  {renderSuggestionActions(suggestion.id, suggestion.suggestedText)}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Formatting Suggestions */}
      {formatSuggestions.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-3">Formatting Suggestions</h3>
          <div className="space-y-3">
            {formatSuggestions.map(suggestion => (
              <Card key={suggestion.id}>
                <CardContent className="pt-4">
                  <p className="font-medium text-sm">{suggestion.issue}</p>
                  <p className="mt-1 text-muted-foreground">{suggestion.description}</p>
                  {renderSuggestionActions(suggestion.id, suggestion.suggestedFix)}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {keywordSuggestions.length === 0 && 
       formatSuggestions.length === 0 && 
       sectionSuggestions.length === 0 && (
        <p className="text-center py-10 text-muted-foreground">
          No suggestions available for this resume and job description.
        </p>
      )}
    </div>
  );
};
