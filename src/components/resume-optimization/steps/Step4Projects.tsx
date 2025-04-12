
import React from 'react';
import { CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { ProjectsForm } from '../ProjectsForm';
import { useOptimizationContext } from '../context/OptimizationContext';

export const Step4Projects: React.FC = () => {
  const { 
    projectEntries,
    handleProjectsUpdate,
    analysisReport
  } = useOptimizationContext();
  
  // Extract job keywords from analysis report for project relevance
  const jobKeywords = analysisReport?.keywords?.hard_skills
    ?.filter((skill: any) => skill.matched)
    ?.map((skill: any) => skill.term) || [];
  
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
          projects={projectEntries}
          jobKeywords={jobKeywords}
          onChange={handleProjectsUpdate}
        />
      </CardContent>
    </div>
  );
};
