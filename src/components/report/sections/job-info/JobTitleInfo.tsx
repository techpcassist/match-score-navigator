
import React from 'react';
import { Briefcase, Building } from 'lucide-react';

interface JobTitleInfoDisplayProps {
  jobTitle: string;
  companyName: string;
  analysis: any;
}

export const JobTitleInfo: React.FC<JobTitleInfoDisplayProps> = ({ 
  jobTitle, 
  companyName, 
  analysis 
}) => {
  if (!jobTitle || !companyName || !analysis) return null;

  return (
    <div className="bg-muted/30 p-4 rounded-md border space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <h3 className="text-lg font-medium">Hiring Manager's Perspective</h3>
        <div className="flex flex-col md:flex-row gap-3 mt-2 md:mt-0">
          <div className="flex items-center text-sm">
            <Briefcase className="mr-2 h-4 w-4 text-primary" />
            <span className="font-medium">{jobTitle}</span>
          </div>
          <div className="flex items-center text-sm">
            <Building className="mr-2 h-4 w-4 text-primary" />
            <span className="font-medium">{companyName}</span>
          </div>
        </div>
      </div>
      
      {analysis.key_parameters && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <SkillSection 
              title="Core Technical Skills"
              items={analysis.key_parameters.core_technical_skills}
            />
            <SkillSection 
              title="Essential Soft Skills"
              items={analysis.key_parameters.essential_soft_skills}
            />
            <div>
              <h4 className="text-sm font-semibold">Educational Requirements</h4>
              <p className="text-sm text-muted-foreground mt-1">
                {analysis.key_parameters.educational_requirements}
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            <InfoSection 
              title="Key Responsibilities"
              content={analysis.key_parameters.key_responsibilities}
            />
            <InfoSection 
              title="Work Culture Fit"
              content={analysis.key_parameters.work_culture_fit}
            />
            <InfoSection 
              title="Industry Knowledge"
              content={analysis.key_parameters.industry_specific_knowledge}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const SkillSection: React.FC<{ title: string; items?: string[] }> = ({ title, items = [] }) => (
  <div>
    <h4 className="text-sm font-semibold">{title}</h4>
    <ul className="text-sm mt-1 space-y-1">
      {items?.map((skill: string, index: number) => (
        <li key={index} className="text-muted-foreground">• {skill}</li>
      ))}
    </ul>
  </div>
);

const InfoSection: React.FC<{ title: string; content: string }> = ({ title, content }) => (
  <div>
    <h4 className="text-sm font-semibold">{title}</h4>
    <p className="text-sm text-muted-foreground mt-1">{content}</p>
  </div>
);
