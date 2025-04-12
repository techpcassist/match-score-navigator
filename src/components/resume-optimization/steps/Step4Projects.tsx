
import React from 'react';
import { CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { ProjectsForm } from '../ProjectsForm';
import { ProjectEntry } from '../types';

interface Step4ProjectsProps {
  projects: ProjectEntry[];
  jobKeywords: string[];
  onChange: (projects: ProjectEntry[]) => void;
}

export const Step4Projects: React.FC<Step4ProjectsProps> = ({ 
  projects, 
  jobKeywords,
  onChange 
}) => {
  return (
    <div className="space-y-6">
      <CardHeader>
        <CardTitle>Step 4: Add Relevant Projects</CardTitle>
        <CardDescription>
          Projects demonstrate practical application of your skills relevant to the job.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ProjectsForm 
          projects={projects}
          jobKeywords={jobKeywords}
          onChange={onChange}
        />
      </CardContent>
    </div>
  );
};
