
// Resume section type
export interface ResumeSection {
  id: string;
  title: string;
  content: string;
  type: string;
}

export interface Resume {
  id: string;
  title: string;
  lastModified: Date;
  content: string;
  sections?: ResumeSection[];
  fromOptimization?: boolean;
}
