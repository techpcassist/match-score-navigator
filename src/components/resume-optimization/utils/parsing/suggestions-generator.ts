
import { KeywordSuggestion, FormattingSuggestion, SectionSuggestion, MissingSection, MissingInfo, WorkExperienceEntry } from '../../types';

// Helper function to extract keyword suggestions from the analysis report
export const extractKeywordSuggestions = (analysisReport: any): KeywordSuggestion[] => {
  if (!analysisReport || !analysisReport.keywords) return [];
  
  const hardSkillsSuggestions = analysisReport.keywords?.hard_skills
    ?.filter((skill: any) => !skill.matched)
    ?.map((skill: any, index: number) => ({
      id: `keyword-${index}-${skill.term}`,
      type: 'keyword' as const,
      keyword: skill.term,
      originalText: '',
      suggestedText: `Consider adding the keyword "${skill.term}" to your skills section or incorporating it into your experience.`,
      section: 'skills'
    })) || [];
    
  // Also include missing soft skills with a different suggestion format
  const softSkillsSuggestions = analysisReport.keywords?.soft_skills
    ?.filter((skill: any) => !skill.matched)
    ?.map((skill: any, index: number) => ({
      id: `soft-keyword-${index}-${skill.term}`,
      type: 'keyword' as const,
      keyword: skill.term,
      originalText: '',
      suggestedText: `Your resume could benefit from highlighting the soft skill "${skill.term}" - consider adding this to demonstrate your interpersonal abilities.`,
      section: 'skills'
    })) || [];
    
  // Use improvement potential for more specific suggestions if available
  const technicalSkillsSuggestions = analysisReport.improvement_potential?.keyword_optimization?.details?.missing_technical
    ?.map((skill: string, index: number) => ({
      id: `tech-${index}-${skill}`,
      type: 'keyword' as const,
      keyword: skill,
      originalText: '',
      suggestedText: `Add the in-demand technical skill "${skill}" that appears in the job description but is missing from your resume.`,
      section: 'skills'
    })) || [];
    
  return [...hardSkillsSuggestions, ...softSkillsSuggestions, ...technicalSkillsSuggestions];
};

// Helper function to extract format suggestions based on ATS checks
export const extractFormatSuggestions = (analysisReport: any): FormattingSuggestion[] => {
  if (!analysisReport || !analysisReport.ats_checks) return [];
  
  const atsSuggestions = analysisReport.ats_checks
    ?.filter((check: any) => check.status !== 'pass')
    ?.map((check: any, index: number) => ({
      id: `format-${index}`,
      type: 'formatting' as const,
      issue: check.check_name,
      description: check.message,
      suggestedFix: `Apply ${check.check_name} formatting fix`
    })) || [];
    
  // Add structure optimization suggestions if available
  const structureSuggestions = analysisReport.improvement_potential?.structure_optimization?.issues
    ?.map((issue: string, index: number) => ({
      id: `structure-${index}`,
      type: 'formatting' as const,
      issue: 'Structure Improvement',
      description: issue,
      suggestedFix: 'Restructure your resume according to the suggestion'
    })) || [];
    
  // Add achievement emphasis suggestions if available
  const achievementSuggestions = analysisReport.improvement_potential?.achievement_emphasis?.issues
    ?.map((issue: string, index: number) => ({
      id: `achievement-${index}`,
      type: 'formatting' as const,
      issue: 'Achievement Improvement',
      description: issue,
      suggestedFix: 'Enhance achievements with quantifiable results'
    })) || [];
    
  return [...atsSuggestions, ...structureSuggestions, ...achievementSuggestions];
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
  
  // Check for missing metrics in achievements based on AI analysis
  if (analysisReport?.improvement_potential?.achievement_emphasis?.level !== 'low') {
    missingInfo.push({
      id: 'missing-metrics',
      type: 'metrics' as const,
      description: 'Your achievements could be strengthened with quantifiable metrics.',
      fields: ['metric'],
      section: 'experience'
    });
  }
  
  // Check for complete contact information from ATS checks
  if (analysisReport?.ats_checks?.some((check: any) => 
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
  
  // Check for education details based on AI analysis
  if (analysisReport?.section_analysis?.education?.toLowerCase().includes('missing') ||
      (resumeText.toLowerCase().includes('education') && 
       !resumeText.match(/degree|bachelor|master|phd|diploma/i))) {
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
