
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertTriangle, ChevronDown, ChevronUp, BarChart, Book, Award } from 'lucide-react';
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
    performance_indicators?: {
      job_kpis: string[];
      resume_kpis: string[];
      match_percentage: number;
    };
    section_analysis?: {
      education: string;
      experience: string;
      skills: string;
      projects: string;
    };
    improvement_potential?: {
      keyword_optimization: string;
      structure_optimization: string;
      achievement_emphasis: string;
    };
  };
}

const ReportView = ({ matchScore, report }: ReportViewProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isPerformanceOpen, setIsPerformanceOpen] = useState(false);
  const [isStructureOpen, setIsStructureOpen] = useState(false);
  
  const scoreColor = matchScore >= 80 
    ? 'bg-green-500' 
    : matchScore >= 60 
      ? 'bg-yellow-500' 
      : 'bg-red-500';
  
  const totalMatchedHardSkills = report.keywords.hard_skills.filter(skill => skill.matched).length;
  const totalHardSkills = report.keywords.hard_skills.length;
  
  const totalMatchedSoftSkills = report.keywords.soft_skills.filter(skill => skill.matched).length;
  const totalSoftSkills = report.keywords.soft_skills.length;
  
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

          {/* Document Structure Analysis */}
          {report.section_analysis && (
            <>
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
                          {getStatusBadge(report.section_analysis.education)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {report.section_analysis.education === 'present' 
                            ? 'Education section properly included' 
                            : 'Add an education section with your qualifications'}
                        </p>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">Experience Section</h4>
                          {getStatusBadge(report.section_analysis.experience)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {report.section_analysis.experience === 'present' 
                            ? 'Experience section well structured' 
                            : 'Improve your experience section with clear dates and achievements'}
                        </p>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">Skills Section</h4>
                          {getStatusBadge(report.section_analysis.skills)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {report.section_analysis.skills === 'present' 
                            ? 'Skills section included with relevant technologies' 
                            : 'Add a dedicated skills section to highlight your capabilities'}
                        </p>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">Projects Section</h4>
                          {getStatusBadge(report.section_analysis.projects)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {report.section_analysis.projects === 'present' 
                            ? 'Projects section demonstrates practical experience' 
                            : 'Consider adding a projects section to showcase your work'}
                        </p>
                      </div>
                    </div>
                    
                    {report.improvement_potential && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Improvement Priorities</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="p-3 border rounded-lg">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm">Keyword Optimization</span>
                              {getImprovementBadge(report.improvement_potential.keyword_optimization)}
                            </div>
                          </div>
                          <div className="p-3 border rounded-lg">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm">Structure Optimization</span>
                              {getImprovementBadge(report.improvement_potential.structure_optimization)}
                            </div>
                          </div>
                          <div className="p-3 border rounded-lg">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm">Achievement Emphasis</span>
                              {getImprovementBadge(report.improvement_potential.achievement_emphasis)}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
              <Separator />
            </>
          )}

          {/* Performance Indicators */}
          {report.performance_indicators && (
            <>
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
                          <span className="text-sm font-medium">{report.performance_indicators.match_percentage}%</span>
                        </div>
                        <Progress 
                          value={report.performance_indicators.match_percentage} 
                          className={report.performance_indicators.match_percentage >= 70 ? 'bg-green-500' : 'bg-yellow-500'} 
                        />
                      </div>
                      
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Job Description Performance Keywords</h4>
                          <div className="flex flex-wrap gap-2">
                            {report.performance_indicators.job_kpis.map((kpi, index) => (
                              <Badge key={index} variant="outline" className="bg-gray-100">
                                {kpi}
                              </Badge>
                            ))}
                            {report.performance_indicators.job_kpis.length === 0 && (
                              <span className="text-sm text-muted-foreground">No performance keywords detected</span>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-2">Resume Performance Keywords</h4>
                          <div className="flex flex-wrap gap-2">
                            {report.performance_indicators.resume_kpis.map((kpi, index) => (
                              <Badge key={index} className="bg-blue-500 hover:bg-blue-600">
                                {kpi}
                              </Badge>
                            ))}
                            {report.performance_indicators.resume_kpis.length === 0 && (
                              <span className="text-sm text-muted-foreground">No performance keywords detected</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Impact Analysis</h4>
                      <p className="text-sm text-muted-foreground">
                        {report.performance_indicators.match_percentage >= 70 
                          ? "Your resume effectively demonstrates impact with measurable achievements."
                          : "Consider adding more quantifiable achievements and results to your resume."}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        {report.performance_indicators.resume_kpis.length > 0
                          ? `Your resume includes impactful terms like ${report.performance_indicators.resume_kpis.slice(0, 3).join(', ')}. `
                          : "Try adding terms like 'increased', 'achieved', 'improved' followed by metrics. "}
                        {report.performance_indicators.match_percentage < 70 && "This will significantly strengthen your application."}
                      </p>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
              <Separator />
            </>
          )}

          {/* Advanced Matching Criteria */}
          {report.advanced_criteria && report.advanced_criteria.length > 0 && (
            <>
              <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Advanced Matching Criteria
                  </h3>
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
