
import { KeywordSuggestion, FormattingSuggestion, SectionSuggestion, MissingSection, MissingInfo, WorkExperienceEntry } from '../../types';

// Helper function to extract keyword suggestions from the analysis report
export const extractKeywordSuggestions = (analysisReport: any): KeywordSuggestion[] => {
  return analysisReport.keywords?.hard_skills
    .filter((skill: any) => !skill.matched)
    .map((skill: any, index: number) => ({
      id: `keyword-${index}-${skill.term}`,
      type: 'keyword' as const,
      keyword: skill.term,
      originalText: '',
      suggestedText: `Consider adding the keyword "${skill.term}" to your skills section or incorporating it into your experience.`,
      section: 'skills'
    })) || [];
};

// Helper function to extract format suggestions based on ATS checks
export const extractFormatSuggestions = (analysisReport: any): FormattingSuggestion[] => {
  return analysisReport.ats_checks
    ?.filter((check: any) => check.status !== 'pass')
    .map((check: any, index: number) => ({
      id: `format-${index}`,
      type: 'formatting' as const,
      issue: check.check_name,
      description: check.message,
      suggestedFix: `Apply ${check.check_name} formatting fix`
    })) || [];
};

// Helper function to create section suggestions from missing sections
export const createSectionSuggestions = (missingSections: MissingSection[]): SectionSuggestion[] => {
  return missingSections.map(section => ({
    id: `section-${section.id}`,
    type: 'section' as const,
    sectionName: section.name,
    suggestedText: section.example || `${section.name}\n\n[Add your ${section.name.toLowerCase()} here]`
  }));
};

// Helper function to generate missing info requirements
export const generateMissingInfo = (workExperienceEntries: WorkExperienceEntry[], analysisReport: any, resumeText: string): MissingInfo[] => {
  const missingInfo: MissingInfo[] = [];
  
  // Check for missing dates in work experience
  const entriesWithMissingDates = workExperienceEntries.filter(entry => 
    !entry.startDate || entry.startDate.trim() === '' || 
    !entry.endDate || entry.endDate.trim() === ''
  );
  
  if (entriesWithMissingDates.length > 0) {
    entriesWithMissingDates.forEach(entry => {
      missingInfo.push({
        id: `missing-dates-${entry.id}`,
        type: 'dates' as const,
        description: `Your work experience at ${entry.company || 'a company'} as ${entry.title || 'a role'} is missing dates.`,
        fields: ['startDate', 'endDate'],
        section: 'experience'
      });
    });
  }
  
  // Check for missing metrics in achievements
  if (analysisReport.improvement_potential?.achievement_emphasis?.level !== 'low') {
    missingInfo.push({
      id: 'missing-metrics',
      type: 'metrics' as const,
      description: 'Your achievements could be strengthened with quantifiable metrics.',
      fields: ['metric'],
      section: 'experience'
    });
  }
  
  // Check for complete contact information
  if (analysisReport.ats_checks?.some((check: any) => 
    check.check_name === 'Contact Information' && check.status !== 'pass'
  )) {
    missingInfo.push({
      id: 'missing-contact',
      type: 'contact' as const,
      description: 'Your resume may be missing key contact information.',
      fields: ['phone', 'email', 'linkedin'],
      section: 'contact'
    });
  }
  
  // Check for education details if education section exists but may be incomplete
  if (resumeText.toLowerCase().includes('education') && 
      !resumeText.match(/degree|bachelor|master|phd|diploma/i)) {
    missingInfo.push({
      id: 'missing-education-details',
      type: 'education' as const,
      description: 'Your education section may be missing key details like degree name or graduation year.',
      fields: ['degree', 'institution', 'year'],
      section: 'education'
    });
  }
  
  return missingInfo;
};
