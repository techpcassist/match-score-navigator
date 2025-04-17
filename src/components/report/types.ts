export interface Skill {
  term: string;
  matched: boolean;
}

export interface Keywords {
  hard_skills: Skill[];
  soft_skills: Skill[];
}

export interface ATSCheck {
  check_name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
}

export interface AdvancedCriterionEntry {
  name: string;
  status: 'matched' | 'partial' | 'missing';
  description: string;
}

export interface PerformanceIndicators {
  job_kpis: string[];
  resume_kpis: string[];
  quantified_metrics?: string[];
  match_percentage: number;
}

export interface SectionAnalysis {
  education: string;
  experience: string;
  skills: string;
  projects: string;
}

export interface KeywordOptimizationDetails {
  missing_technical: string[];
  missing_soft: string[];
}

export interface ImprovementCategory {
  level: 'high' | 'medium' | 'low';
  issues?: string[];
  details?: KeywordOptimizationDetails;
}

export interface ImprovementPotential {
  keyword_optimization: ImprovementCategory;
  structure_optimization: ImprovementCategory;
  achievement_emphasis: ImprovementCategory;
}

export interface JobTitleAnalysisParameters {
  core_technical_skills: string[];
  relevant_experience: string;
  educational_requirements: string;
  essential_soft_skills: string[];
  industry_specific_knowledge: string;
  key_responsibilities: string;
  performance_indicators: string[];
  work_culture_fit: string;
  career_growth: string;
}

export interface JobTitleAnalysis {
  job_title: string;
  company_name: string;
  key_parameters: JobTitleAnalysisParameters;
}

export interface ReportData {
  match_score: number;
  keywords: Keywords;
  ats_checks: ATSCheck[];
  ats_score?: number;
  suggestions: string[];
  advanced_criteria?: AdvancedCriterionEntry[];
  performance_indicators?: PerformanceIndicators;
  section_analysis?: SectionAnalysis;
  improvement_potential?: ImprovementPotential;
  job_title_analysis?: JobTitleAnalysis;
  parsed_data?: any;
}

export interface ReportViewProps {
  matchScore: number;
  report: ReportData;
}

export interface KeywordsSectionProps {
  hardSkills: Skill[];
  softSkills: Skill[];
  isMobile?: boolean;
}
