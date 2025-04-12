
// This file is now a simple re-export from the modular work experience parser
import { parseResumeForWorkExperience } from './work-experience';

// Export both the new function name and the legacy function name for backward compatibility
export { parseResumeForWorkExperience };
export const parseWorkExperience = parseResumeForWorkExperience;
