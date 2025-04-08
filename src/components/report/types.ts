
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
  suggestions: string[];
  advanced_criteria?: AdvancedMatchCriteria[];
  performance_indicators?: {
    job_kpis: string[];
    resume_kpis: string[];
    match_percentage: number;
  };
  section_analysis?: {
    education: string;
    experience: string;
    skills: string;
    projects: string;
  };
  improvement_potential?: {
    keyword_optimization: string;
    structure_optimization: string;
    achievement_emphasis: string;
  };
}

export interface ReportViewProps {
  matchScore: number;
  report: ReportData;
}
