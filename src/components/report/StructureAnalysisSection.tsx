
import { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Book, ChevronUp, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface StructureAnalysisSectionProps {
  sectionAnalysis: {
    education: string;
    experience: string;
    skills: string;
    projects: string;
  };
  improvementPotential?: {
    keyword_optimization: string;
    structure_optimization: string;
    achievement_emphasis: string;
  };
}

export const StructureAnalysisSection = ({ 
  sectionAnalysis, 
  improvementPotential 
}: StructureAnalysisSectionProps) => {
  const [isStructureOpen, setIsStructureOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'present':
        return <Badge className="bg-green-500">Present</Badge>;
      case 'missing':
        return <Badge variant="outline" className="border-red-300 text-red-500">Missing</Badge>;
      case 'needs_improvement':
        return <Badge className="bg-yellow-500">Needs Improvement</Badge>;
      case 'optional':
        return <Badge variant="outline" className="border-blue-300 text-blue-500">Optional</Badge>;
      default:
        return null;
    }
  };
  
  const getImprovementBadge = (level: string) => {
    switch(level) {
      case 'high':
        return <Badge className="bg-red-500">High Priority</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500">Medium Priority</Badge>;
      case 'low':
        return <Badge className="bg-green-500">Low Priority</Badge>;
      default:
        return null;
    }
  };

  return (
    <Collapsible open={isStructureOpen} onOpenChange={setIsStructureOpen}>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Book className="h-5 w-5" />
          Resume Structure Analysis
        </h3>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            {isStructureOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="mt-2">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Education Section</h4>
                {getStatusBadge(sectionAnalysis.education)}
              </div>
              <p className="text-sm text-muted-foreground">
                {sectionAnalysis.education === 'present' 
                  ? 'Education section properly included' 
                  : 'Add an education section with your qualifications'}
              </p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Experience Section</h4>
                {getStatusBadge(sectionAnalysis.experience)}
              </div>
              <p className="text-sm text-muted-foreground">
                {sectionAnalysis.experience === 'present' 
                  ? 'Experience section well structured' 
                  : 'Improve your experience section with clear dates and achievements'}
              </p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Skills Section</h4>
                {getStatusBadge(sectionAnalysis.skills)}
              </div>
              <p className="text-sm text-muted-foreground">
                {sectionAnalysis.skills === 'present' 
                  ? 'Skills section included with relevant technologies' 
                  : 'Add a dedicated skills section to highlight your capabilities'}
              </p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Projects Section</h4>
                {getStatusBadge(sectionAnalysis.projects)}
              </div>
              <p className="text-sm text-muted-foreground">
                {sectionAnalysis.projects === 'present' 
                  ? 'Projects section demonstrates practical experience' 
                  : 'Consider adding a projects section to showcase your work'}
              </p>
            </div>
          </div>
          
          {improvementPotential && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Improvement Priorities</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Keyword Optimization</span>
                    {getImprovementBadge(improvementPotential.keyword_optimization)}
                  </div>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Structure Optimization</span>
                    {getImprovementBadge(improvementPotential.structure_optimization)}
                  </div>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Achievement Emphasis</span>
                    {getImprovementBadge(improvementPotential.achievement_emphasis)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
