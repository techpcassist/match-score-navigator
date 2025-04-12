
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft 
} from 'lucide-react';
import { 
  WorkExperienceEntry, 
  ProjectEntry, 
  MissingSection, 
  Education,
  KeywordSuggestion,
  FormattingSuggestion,
  SectionSuggestion
} from './types';
import { OptimizationStepContent } from './OptimizationStepContent';
import { 
  parseResumeForWorkExperience,
  parseResumeForEducation,
  identifyMissingSections,
  extractKeywordSuggestions,
  extractFormatSuggestions,
  createSectionSuggestions
} from './utils/resume-parsing';

interface OptimizationPanelProps {
  resumeText: string;
  jobDescriptionText: string;
  analysisReport: any;
  onClose: () => void;
}

export const OptimizationPanel = ({ 
  resumeText, 
  jobDescriptionText, 
  analysisReport, 
  onClose 
}: OptimizationPanelProps) => {
  // Main state for the optimization process
  const [currentStep, setCurrentStep] = useState(1);
  const [optimizedResume, setOptimizedResume] = useState(resumeText);
  const [appliedSuggestions, setAppliedSuggestions] = useState<string[]>([]);
  const [workExperienceEntries, setWorkExperienceEntries] = useState<WorkExperienceEntry[]>([]);
  const [projectEntries, setProjectEntries] = useState<ProjectEntry[]>([]);
  const [educationEntries, setEducationEntries] = useState<Education[]>([]);
  const [missingSections, setMissingSections] = useState<MissingSection[]>([]);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  // Suggestions state
  const [keywordSuggestions, setKeywordSuggestions] = useState<KeywordSuggestion[]>([]);
  const [formatSuggestions, setFormatSuggestions] = useState<FormattingSuggestion[]>([]);
  const [sectionSuggestions, setSectionSuggestions] = useState<SectionSuggestion[]>([]);

  const totalSteps = 6; // Updated to include education step
  
  // Initialize data on component mount
  useEffect(() => {
    // Parse work experience data
    const workExperience = parseResumeForWorkExperience(resumeText);
    setWorkExperienceEntries(workExperience);
    
    // Parse education data
    const education = parseResumeForEducation(resumeText);
    setEducationEntries(education);
    
    // Identify missing sections
    const missingSectionsList = identifyMissingSections(resumeText, jobDescriptionText, analysisReport);
    setMissingSections(missingSectionsList);
    
    // Initialize suggestions
    const keywordSugs = extractKeywordSuggestions(analysisReport);
    setKeywordSuggestions(keywordSugs);
    
    const formatSugs = extractFormatSuggestions(analysisReport);
    setFormatSuggestions(formatSugs);
    
    const sectionSugs = createSectionSuggestions(missingSectionsList);
    setSectionSuggestions(sectionSugs);
    
    // Mark first step as viewed
    if (!completedSteps.includes(1)) {
      setCompletedSteps(prev => [...prev, 1]);
    }
  }, [resumeText, jobDescriptionText, analysisReport]);
  
  const handleNextStep = () => {
    // Mark current step as completed
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps(prev => [...prev, currentStep]);
    }
    
    // Move to next step
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };
  
  const handlePreviousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };
  
  const handleSectionSelection = (selectedSections: string[]) => {
    // Update the missingSections state based on user selection
    setMissingSections(prev => 
      prev.filter(section => selectedSections.includes(section.id))
    );
    
    // Update section suggestions based on new missing sections
    setSectionSuggestions(
      createSectionSuggestions(
        missingSections.filter(section => selectedSections.includes(section.id))
      )
    );
  };
  
  const handleWorkExperienceUpdate = (updatedEntries: WorkExperienceEntry[]) => {
    setWorkExperienceEntries(updatedEntries);
  };
  
  const handleEducationUpdate = (updatedEntries: Education[]) => {
    setEducationEntries(updatedEntries);
  };
  
  const handleProjectsUpdate = (updatedProjects: ProjectEntry[]) => {
    setProjectEntries(updatedProjects);
  };
  
  const handleSuggestionAction = (id: string, action: 'accept' | 'edit' | 'ignore') => {
    if (action === 'accept' || action === 'edit') {
      setAppliedSuggestions(prev => [...prev, id]);
    }
  };
  
  const handleFinalize = () => {
    // In a real implementation, this would save the finalized resume
    onClose();
  };
  
  // Calculate progress percentage
  const progressPercentage = (completedSteps.length / totalSteps) * 100;

  return (
    <Card className="w-full">
      <div className="px-6 pt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Resume Optimization</h2>
          <div className="flex items-center">
            <span className="text-sm font-medium mr-2">Progress:</span>
            <Progress value={progressPercentage} className="w-[100px]" />
            <span className="text-sm ml-2">{Math.round(progressPercentage)}%</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 mb-6">
          {Array.from({length: totalSteps}, (_, i) => i + 1).map(step => (
            <div 
              key={step} 
              className={`flex items-center justify-center h-8 w-8 rounded-full text-sm font-medium ${
                completedSteps.includes(step) 
                  ? 'bg-green-100 text-green-600 border border-green-500' 
                  : currentStep === step 
                    ? 'bg-blue-100 text-blue-600 border border-blue-500' 
                    : 'bg-gray-100 text-gray-500 border border-gray-300'
              }`}
              onClick={() => completedSteps.includes(step) || currentStep >= step ? setCurrentStep(step) : null}
              style={{ cursor: completedSteps.includes(step) || currentStep >= step ? 'pointer' : 'default' }}
            >
              {completedSteps.includes(step) ? <CheckCircle className="h-4 w-4" /> : step}
            </div>
          ))}
        </div>
      </div>
      
      <OptimizationStepContent 
        currentStep={currentStep}
        missingSections={missingSections}
        workExperienceEntries={workExperienceEntries}
        educationEntries={educationEntries}
        projectEntries={projectEntries}
        keywordSuggestions={keywordSuggestions}
        formatSuggestions={formatSuggestions}
        sectionSuggestions={sectionSuggestions}
        optimizedResume={optimizedResume}
        onSectionSelection={handleSectionSelection}
        onWorkExperienceUpdate={handleWorkExperienceUpdate}
        onEducationUpdate={handleEducationUpdate}
        onProjectsUpdate={handleProjectsUpdate}
        onSuggestionAction={handleSuggestionAction}
        onResumeContentChange={setOptimizedResume}
        analysisReport={analysisReport}
      />
      
      <div className="p-6 flex justify-between">
        <Button 
          variant="outline" 
          onClick={currentStep === 1 ? onClose : handlePreviousStep}
        >
          {currentStep === 1 ? 'Cancel' : (
            <>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </>
          )}
        </Button>
        <Button 
          onClick={currentStep === totalSteps ? handleFinalize : handleNextStep}
        >
          {currentStep === totalSteps ? 'Finalize Resume' : (
            <>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};
