
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ProjectEntry } from './types';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, Plus, Trash2, X } from 'lucide-react';

interface ProjectsFormProps {
  projects: ProjectEntry[];
  jobKeywords: string[];
  onChange: (projects: ProjectEntry[]) => void;
}

export const ProjectsForm = ({ projects, jobKeywords, onChange }: ProjectsFormProps) => {
  const [openProjects, setOpenProjects] = useState<string[]>([
    // Open the first project by default, or if empty, we'll handle add project UI
    projects.length > 0 ? projects[0].id : ''
  ]);
  const [currentSkill, setCurrentSkill] = useState('');
  
  const toggleProject = (id: string) => {
    setOpenProjects(prev => {
      if (prev.includes(id)) {
        return prev.filter(projectId => projectId !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  
  const updateProject = (id: string, field: keyof ProjectEntry, value: string | string[]) => {
    const updatedProjects = projects.map(project => {
      if (project.id === id) {
        return { ...project, [field]: value };
      }
      return project;
    });
    
    onChange(updatedProjects);
  };
  
  const addSkillToProject = (projectId: string, skill: string) => {
    if (!skill.trim()) return;
    
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    
    if (!project.keySkills.includes(skill)) {
      updateProject(projectId, 'keySkills', [...project.keySkills, skill]);
    }
    
    setCurrentSkill('');
  };
  
  const removeSkillFromProject = (projectId: string, skill: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    
    updateProject(
      projectId, 
      'keySkills', 
      project.keySkills.filter(s => s !== skill)
    );
  };
  
  const addNewProject = () => {
    const newProject: ProjectEntry = {
      id: `project-${Date.now()}`,
      name: '',
      valueAdd: '',
      keySkills: []
    };
    
    const updatedProjects = [...projects, newProject];
    onChange(updatedProjects);
    
    // Open the new project
    setOpenProjects(prev => [...prev, newProject.id]);
  };
  
  const removeProject = (id: string) => {
    const updatedProjects = projects.filter(project => project.id !== id);
    onChange(updatedProjects);
    
    // Remove from open projects
    setOpenProjects(prev => prev.filter(projectId => projectId !== id));
  };
  
  // If no projects exist yet, show a prompt to add one
  if (projects.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground mb-2">
          Adding relevant projects to your resume can significantly enhance your application.
        </p>
        <p className="text-muted-foreground mb-4">
          Projects demonstrate practical application of your skills relevant to the job description.
        </p>
        <Button onClick={addNewProject}>Add a Project</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground mb-4">
        Projects help showcase your practical skills. Make sure to highlight the value you added
        and include keywords relevant to the job description.
      </p>
      
      <div className="space-y-4">
        {projects.map(project => (
          <Card key={project.id}>
            <CardContent className="p-4">
              <Collapsible 
                open={openProjects.includes(project.id)} 
                onOpenChange={() => toggleProject(project.id)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" className="p-2 h-auto">
                        {openProjects.includes(project.id) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    <span className="font-medium">
                      {project.name || 'New Project'}
                    </span>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeProject(project.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <CollapsibleContent className="pt-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor={`${project.id}-name`}>Project Name</Label>
                      <Input
                        id={`${project.id}-name`}
                        value={project.name}
                        onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                        placeholder="Name of your project"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`${project.id}-value`}>Value Add / Outcome</Label>
                      <Textarea
                        id={`${project.id}-value`}
                        value={project.valueAdd}
                        onChange={(e) => updateProject(project.id, 'valueAdd', e.target.value)}
                        placeholder="Describe the value or outcome this project delivered"
                        rows={3}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Focus on outcomes that align with what the employer is seeking
                      </p>
                    </div>
                    
                    <div>
                      <Label>Key Skills Used</Label>
                      <div className="flex flex-wrap gap-2 mt-2 mb-3">
                        {project.keySkills.map(skill => (
                          <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                            {skill}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0 hover:bg-transparent"
                              onClick={() => removeSkillFromProject(project.id, skill)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex gap-2">
                        <Input
                          value={currentSkill}
                          onChange={(e) => setCurrentSkill(e.target.value)}
                          placeholder="Add a skill"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addSkillToProject(project.id, currentSkill);
                            }
                          }}
                        />
                        <Button 
                          type="button" 
                          onClick={() => addSkillToProject(project.id, currentSkill)}
                        >
                          Add
                        </Button>
                      </div>
                      
                      {jobKeywords.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs text-muted-foreground mb-2">
                            Suggested skills from job description:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {jobKeywords.slice(0, 8).map(keyword => (
                              <Badge
                                key={keyword}
                                variant="outline"
                                className="cursor-pointer hover:bg-blue-50"
                                onClick={() => addSkillToProject(project.id, keyword)}
                              >
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor={`${project.id}-description`}>Additional Details (Optional)</Label>
                      <Textarea
                        id={`${project.id}-description`}
                        value={project.description || ''}
                        onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                        placeholder="Any other relevant details about this project"
                        rows={3}
                      />
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-center">
        <Button 
          variant="outline" 
          onClick={addNewProject}
          className="flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Another Project
        </Button>
      </div>
    </div>
  );
};
