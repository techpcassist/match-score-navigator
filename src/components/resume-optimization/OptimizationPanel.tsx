
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SuggestionsList } from './SuggestionsList';
import { MissingInfoForm } from './MissingInfoForm';
import { ResumeEditor } from './ResumeEditor';
import { KeywordSuggestion, MissingInfo, SectionSuggestion, FormattingSuggestion } from './types';

interface OptimizationPanelProps {
  resumeText: string;
  jobDescriptionText: string;
  analysisReport: any;
  onClose: () => void;
}

export const OptimizationPanel = ({ resumeText, jobDescriptionText, analysisReport, onClose }: OptimizationPanelProps) => {
  const [activeTab, setActiveTab] = useState('suggestions');
  const [optimizedResume, setOptimizedResume] = useState(resumeText);
  const [appliedSuggestions, setAppliedSuggestions] = useState<string[]>([]);
  const [missingInfoCollected, setMissingInfoCollected] = useState(false);
  
  // Extract suggestions from the analysis report
  const keywordSuggestions: KeywordSuggestion[] = 
    analysisReport.keywords?.hard_skills
      .filter((skill: any) => !skill.matched)
      .map((skill: any) => ({
        id: `keyword-${skill.term}`,
        type: 'keyword',
        keyword: skill.term,
        originalText: '',
        suggestedText: `Consider adding the keyword "${skill.term}" to your skills section or incorporating it into your experience.`,
        section: 'skills'
      })) || [];
  
  // Extract missing information requirements
  const missingInfo: MissingInfo[] = [];
  
  if (analysisReport.section_analysis?.experience === 'missing dates') {
    missingInfo.push({
      id: 'missing-dates',
      type: 'dates',
      description: 'Your work experience is missing dates for one or more positions.',
      fields: ['startDate', 'endDate'],
      section: 'experience'
    });
  }
  
  if (analysisReport.improvement_potential?.achievement_emphasis.level !== 'low') {
    missingInfo.push({
      id: 'missing-metrics',
      type: 'metrics',
      description: 'Your achievements could be strengthened with quantifiable metrics.',
      fields: ['metric'],
      section: 'experience'
    });
  }
  
  // Format suggestions based on ATS checks
  const formatSuggestions: FormattingSuggestion[] = 
    analysisReport.ats_checks
      .filter((check: any) => check.status !== 'pass')
      .map((check: any, index: number) => ({
        id: `format-${index}`,
        type: 'formatting',
        issue: check.check_name,
        description: check.message,
        suggestedFix: `Apply ${check.check_name} formatting fix`
      })) || [];
  
  // Create section suggestions
  const sectionSuggestions: SectionSuggestion[] = [];
  
  // Add a professional summary suggestion if missing
  if (analysisReport.section_analysis?.skills === 'missing' || 
      !resumeText.toLowerCase().includes('summary') && 
      !resumeText.toLowerCase().includes('objective')) {
    sectionSuggestions.push({
      id: 'section-summary',
      type: 'section',
      sectionName: 'Professional Summary',
      suggestedText: `Professional Summary\n\nExperienced professional with skills in ${
        analysisReport.keywords?.hard_skills
          .filter((skill: any) => skill.matched)
          .slice(0, 3)
          .map((skill: any) => skill.term)
          .join(', ')
      }. Proven track record of delivering results in a fast-paced environment.`
    });
  }
  
  const handleApplySuggestions = () => {
    // In a real implementation, this would apply the selected suggestions to the resume
    setActiveTab('editor');
  };
  
  const handleSaveMissingInfo = (info: any) => {
    setMissingInfoCollected(true);
    // Move to the editor tab after collecting missing info
    setActiveTab('editor');
  };
  
  const handleFinalize = () => {
    // In a real implementation, this would save the finalized resume
    onClose();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Resume Optimization</CardTitle>
        <CardDescription>
          Review AI suggestions to optimize your resume for this job
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
            <TabsTrigger value="missing-info" disabled={appliedSuggestions.length === 0}>
              Missing Info
            </TabsTrigger>
            <TabsTrigger value="editor" disabled={!missingInfoCollected && missingInfo.length > 0}>
              Editor
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="suggestions" className="mt-4">
            <SuggestionsList 
              keywordSuggestions={keywordSuggestions}
              formatSuggestions={formatSuggestions}
              sectionSuggestions={sectionSuggestions}
              onSuggestionAction={(id, action) => {
                if (action === 'accept' || action === 'edit') {
                  setAppliedSuggestions(prev => [...prev, id]);
                }
              }}
            />
            
            <div className="mt-6 flex justify-end">
              <Button 
                onClick={handleApplySuggestions}
                disabled={appliedSuggestions.length === 0}
              >
                Apply Suggestions & Continue
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="missing-info" className="mt-4">
            <MissingInfoForm 
              missingInfo={missingInfo}
              onSubmit={handleSaveMissingInfo}
            />
          </TabsContent>
          
          <TabsContent value="editor" className="mt-4">
            <ResumeEditor 
              initialContent={optimizedResume}
              onChange={setOptimizedResume}
            />
            
            <div className="mt-6 flex justify-end">
              <Button variant="outline" onClick={onClose} className="mr-2">
                Cancel
              </Button>
              <Button onClick={handleFinalize}>
                Finalize Resume
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
