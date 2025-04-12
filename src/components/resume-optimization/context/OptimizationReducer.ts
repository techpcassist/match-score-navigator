
import { 
  WorkExperienceEntry, 
  ProjectEntry, 
  MissingSection, 
  Education,
} from '../types';

export interface OptimizationState {
  currentStep: number;
  optimizedResume: string;
  appliedSuggestions: string[];
  workExperienceEntries: WorkExperienceEntry[];
  projectEntries: ProjectEntry[];
  educationEntries: Education[];
  missingSections: MissingSection[];
  completedSteps: number[];
  keywordSuggestions: any[];
  formatSuggestions: any[];
  sectionSuggestions: any[];
  usingAIParsing: boolean;
  analysisReport: any;
}

export type OptimizationAction =
  | { type: 'SET_CURRENT_STEP'; payload: number }
  | { type: 'SET_OPTIMIZED_RESUME'; payload: string }
  | { type: 'SET_WORK_EXPERIENCE'; payload: WorkExperienceEntry[] }
  | { type: 'SET_EDUCATION'; payload: Education[] }
  | { type: 'SET_PROJECTS'; payload: ProjectEntry[] }
  | { type: 'SET_COMPLETED_STEPS'; payload: number[] }
  | { type: 'ADD_COMPLETED_STEP'; payload: number }
  | { type: 'SET_MISSING_SECTIONS'; payload: MissingSection[] }
  | { type: 'APPLY_SUGGESTION'; payload: string }
  | { type: 'UPDATE_SECTION_SUGGESTIONS'; payload: any[] };

export const optimizationReducer = (
  state: OptimizationState,
  action: OptimizationAction
): OptimizationState => {
  switch (action.type) {
    case 'SET_CURRENT_STEP':
      return { ...state, currentStep: action.payload };
    case 'SET_OPTIMIZED_RESUME':
      return { ...state, optimizedResume: action.payload };
    case 'SET_WORK_EXPERIENCE':
      return { ...state, workExperienceEntries: action.payload };
    case 'SET_EDUCATION':
      return { ...state, educationEntries: action.payload };
    case 'SET_PROJECTS':
      return { ...state, projectEntries: action.payload };
    case 'SET_COMPLETED_STEPS':
      return { ...state, completedSteps: action.payload };
    case 'ADD_COMPLETED_STEP':
      return { 
        ...state, 
        completedSteps: state.completedSteps.includes(action.payload) 
          ? state.completedSteps 
          : [...state.completedSteps, action.payload] 
      };
    case 'SET_MISSING_SECTIONS':
      return { ...state, missingSections: action.payload };
    case 'APPLY_SUGGESTION':
      return { 
        ...state, 
        appliedSuggestions: [...state.appliedSuggestions, action.payload] 
      };
    case 'UPDATE_SECTION_SUGGESTIONS':
      return { ...state, sectionSuggestions: action.payload };
    default:
      return state;
  }
};
