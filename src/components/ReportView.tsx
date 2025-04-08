
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface Skill {
  term: string;
  matched: boolean;
}

interface ATSCheck {
  check_name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
}

interface AdvancedMatchCriteria {
  name: string;
  status: 'matched' | 'partial' | 'missing';
  description: string;
}

interface ReportViewProps {
  matchScore: number;
  report: {
    keywords: {
      hard_skills: Skill[];
      soft_skills: Skill[];
    };
    ats_checks: ATSCheck[];
    suggestions: string[];
    advanced_criteria?: AdvancedMatchCriteria[];
  };
}

const ReportView = ({ matchScore, report }: ReportViewProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  
  const scoreColor = matchScore >= 80 
    ? 'bg-green-500' 
    : matchScore >= 60 
      ? 'bg-yellow-500' 
      : 'bg-red-500';
  
  const totalMatchedHardSkills = report.keywords.hard_skills.filter(skill => skill.matched).length;
  const totalHardSkills = report.keywords.hard_skills.length;
  
  const totalMatchedSoftSkills = report.keywords.soft_skills.filter(skill => skill.matched).length;
  const totalSoftSkills = report.keywords.soft_skills.length;
  
  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Resume Analysis Results</CardTitle>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Match Score:</span>
          <Badge 
            className={`text-lg px-3 py-1 ${matchScore >= 80 
              ? 'bg-green-500 hover:bg-green-600' 
              : matchScore >= 60 
                ? 'bg-yellow-500 hover:bg-yellow-600' 
                : 'bg-red-500 hover:bg-red-600'}`}
          >
            {matchScore}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Score Visualization */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Overall Match</span>
              <span className="text-sm font-medium">{matchScore}%</span>
            </div>
            <Progress value={matchScore} className={scoreColor} />
          </div>

          <Separator />

          {/* Keywords Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Keywords Match</h3>
            
            {/* Hard Skills */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Hard Skills</h4>
                <span className="text-sm">{totalMatchedHardSkills} of {totalHardSkills} matched</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {report.keywords.hard_skills.map((skill, index) => (
                  <Badge 
                    key={index} 
                    variant={skill.matched ? "default" : "outline"}
                    className={skill.matched ? "bg-green-500 hover:bg-green-600" : "border-red-300 text-red-500"}
                  >
                    {skill.term} {skill.matched ? <CheckCircle className="ml-1 h-3 w-3" /> : <XCircle className="ml-1 h-3 w-3" />}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Soft Skills */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Soft Skills</h4>
                <span className="text-sm">{totalMatchedSoftSkills} of {totalSoftSkills} matched</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {report.keywords.soft_skills.map((skill, index) => (
                  <Badge 
                    key={index} 
                    variant={skill.matched ? "default" : "outline"}
                    className={skill.matched ? "bg-green-500 hover:bg-green-600" : "border-red-300 text-red-500"}
                  >
                    {skill.term} {skill.matched ? <CheckCircle className="ml-1 h-3 w-3" /> : <XCircle className="ml-1 h-3 w-3" />}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          {/* Advanced Matching Criteria */}
          {report.advanced_criteria && report.advanced_criteria.length > 0 && (
            <>
              <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Advanced Matching Criteria</h3>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm">
                      {isAdvancedOpen ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent className="mt-2">
                  <div className="space-y-3">
                    {report.advanced_criteria.map((criteria, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                        {criteria.status === 'matched' && (
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        )}
                        {criteria.status === 'partial' && (
                          <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        )}
                        {criteria.status === 'missing' && (
                          <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className="font-medium">{criteria.name}</p>
                          <p className="text-sm text-muted-foreground">{criteria.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
              <Separator />
            </>
          )}

          {/* ATS Checks */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">ATS Compatibility Checks</h3>
            <div className="space-y-3">
              {report.ats_checks.map((check, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  {check.status === 'pass' && (
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  )}
                  {check.status === 'warning' && (
                    <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  )}
                  {check.status === 'fail' && (
                    <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-medium">{check.check_name}</p>
                    <p className="text-sm text-muted-foreground">{check.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Suggestions */}
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Improvement Suggestions</h3>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="mt-2">
              <ul className="space-y-2 list-disc pl-5">
                {report.suggestions.map((suggestion, index) => (
                  <li key={index} className="text-muted-foreground">{suggestion}</li>
                ))}
              </ul>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportView;
