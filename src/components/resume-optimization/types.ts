
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
  type: 'dates' | 'metrics' | 'contact' | 'education';
  description: string;
  fields: string[];
  section: string;
}

export interface Location {
  country: string;
  state?: string;
  city?: string;
}

export interface WorkExperienceEntry {
  id: string;
  company?: string;
  companyLocation?: Location;
  title?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  teamSize?: number;
  teamName?: string;
  projectName?: string;
}

export interface Education {
  id: string;
  degree?: string;
  fieldOfStudy?: string;
  university?: string;
  country?: string;
  state?: string;
  startDate?: string;
  endDate?: string;
  customUniversity?: boolean;
}

export interface ProjectEntry {
  id: string;
  name: string;
  valueAdd: string;
  keySkills: string[];
  description?: string;
}

export interface MissingSection {
  id: string;
  name: string;
  recommendation: string;
  example?: string;
}

export interface ResumeAnalysisData {
  contactInfo: {
    complete: boolean;
    missing: string[];
  };
  sections: {
    present: string[];
    missing: MissingSection[];
  };
  workExperience: {
    entries: WorkExperienceEntry[];
    formatting: boolean;
    chronological: boolean;
  };
  keywords: {
    matched: string[];
    missing: string[];
    integration: 'good' | 'fair' | 'poor';
  };
}
