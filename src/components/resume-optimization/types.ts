
export interface KeywordSuggestion {
  id: string;
  type: 'keyword';
  keyword: string;
  originalText: string;
  suggestedText: string;
  section: string;
}

export interface SectionSuggestion {
  id: string;
  type: 'section';
  sectionName: string;
  suggestedText: string;
}

export interface FormattingSuggestion {
  id: string;
  type: 'formatting';
  issue: string;
  description: string;
  suggestedFix: string;
}

export interface MissingInfo {
  id: string;
  type: 'dates' | 'metrics';
  description: string;
  fields: string[];
  section: string;
}
