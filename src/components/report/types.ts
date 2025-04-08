
export interface Skill {
  term: string;
  matched: boolean;
}

export interface ATSCheck {
  check_name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
}

export interface AdvancedMatchCriteria {
  name: string;
  status: 'matched' | 'partial' | 'missing';
  description: string;
}

export interface ReportData {
  keywords: {
    hard_skills: Skill[];
    soft_skills: Skill[];
  };
  ats_checks: ATSCheck[];
  ats_score?: number;
  suggestions: string[];
  advanced_criteria?: AdvancedMatchCriteria[];
  performance_indicators?: {
    job_kpis: string[];
    resume_kpis: string[];
    quantified_metrics?: string[];
    match_percentage: number;
  };
  section_analysis?: {
    education: string;
    experience: string;
    skills: string;
    projects: string;
  };
  improvement_potential?: {
    keyword_optimization: {
      level: string;
      details: {
        missing_technical: string[];
        missing_soft: string[];
      };
    };
    structure_optimization: {
      level: string;
      issues: string[];
    };
    achievement_emphasis: {
      level: string;
      issues: string[];
    };
  };
}

export interface ReportViewProps {
  matchScore: number;
  report: ReportData;
}
