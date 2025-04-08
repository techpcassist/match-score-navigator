
import { useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { BarChart, ChevronUp, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PerformanceIndicators {
  job_kpis: string[];
  resume_kpis: string[];
  match_percentage: number;
}

interface PerformanceSectionProps {
  performanceIndicators: PerformanceIndicators;
}

export const PerformanceSection = ({ performanceIndicators }: PerformanceSectionProps) => {
  const [isPerformanceOpen, setIsPerformanceOpen] = useState(false);

  return (
    <Collapsible open={isPerformanceOpen} onOpenChange={setIsPerformanceOpen}>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <BarChart className="h-5 w-5" />
          Performance Indicator Analysis
        </h3>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            {isPerformanceOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="mt-2">
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Performance Keywords Match</span>
                <span className="text-sm font-medium">{performanceIndicators.match_percentage}%</span>
              </div>
              <Progress 
                value={performanceIndicators.match_percentage} 
                className={performanceIndicators.match_percentage >= 70 ? 'bg-green-500' : 'bg-yellow-500'} 
              />
            </div>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Job Description Performance Keywords</h4>
                <div className="flex flex-wrap gap-2">
                  {performanceIndicators.job_kpis.map((kpi, index) => (
                    <Badge key={index} variant="outline" className="bg-gray-100">
                      {kpi}
                    </Badge>
                  ))}
                  {performanceIndicators.job_kpis.length === 0 && (
                    <span className="text-sm text-muted-foreground">No performance keywords detected</span>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Resume Performance Keywords</h4>
                <div className="flex flex-wrap gap-2">
                  {performanceIndicators.resume_kpis.map((kpi, index) => (
                    <Badge key={index} className="bg-blue-500 hover:bg-blue-600">
                      {kpi}
                    </Badge>
                  ))}
                  {performanceIndicators.resume_kpis.length === 0 && (
                    <span className="text-sm text-muted-foreground">No performance keywords detected</span>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">Impact Analysis</h4>
            <p className="text-sm text-muted-foreground">
              {performanceIndicators.match_percentage >= 70 
                ? "Your resume effectively demonstrates impact with measurable achievements."
                : "Consider adding more quantifiable achievements and results to your resume."}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {performanceIndicators.resume_kpis.length > 0
                ? `Your resume includes impactful terms like ${performanceIndicators.resume_kpis.slice(0, 3).join(', ')}. `
                : "Try adding terms like 'increased', 'achieved', 'improved' followed by metrics. "}
              {performanceIndicators.match_percentage < 70 && "This will significantly strengthen your application."}
            </p>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
