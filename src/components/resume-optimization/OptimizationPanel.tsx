
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SuggestionsList } from './SuggestionsList';
import { MissingInfoForm } from './MissingInfoForm';
import { ResumeEditor } from './ResumeEditor';
import { KeywordSuggestion, MissingInfo, SectionSuggestion, FormattingSuggestion, ResumeAnalysisData, WorkExperienceEntry, ProjectEntry, MissingSection, Education } from './types';
import { SectionCheckList } from './SectionCheckList';
import { WorkExperienceForm } from './WorkExperienceForm';
import { ProjectsForm } from './ProjectsForm';
import { EducationForm } from './EducationForm';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';

interface OptimizationPanelProps {
  resumeText: string;
  jobDescriptionText: string;
  analysisReport: any;
  onClose: () => void;
}

export const OptimizationPanel = ({ resumeText, jobDescriptionText, analysisReport, onClose }: OptimizationPanelProps) => {
  // Main state for the optimization process
  const [currentStep, setCurrentStep] = useState(1);
  const [optimizedResume, setOptimizedResume] = useState(resumeText);
  const [appliedSuggestions, setAppliedSuggestions] = useState<string[]>([]);
  const [workExperienceEntries, setWorkExperienceEntries] = useState<WorkExperienceEntry[]>([]);
  const [projectEntries, setProjectEntries] = useState<ProjectEntry[]>([]);
  const [educationEntries, setEducationEntries] = useState<Education[]>([]);
  const [missingSections, setMissingSections] = useState<MissingSection[]>([]);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const totalSteps = 6; // Updated to include education step
  
  // Extract suggestions and analysis data from the report
  useEffect(() => {
    // Parse work experience data
    parseResumeForWorkExperience();
    // Parse education data
    parseResumeForEducation();
    // Identify missing sections
    identifyMissingSections();
    // Mark first step as viewed
    if (!completedSteps.includes(1)) {
      setCompletedSteps(prev => [...prev, 1]);
    }
  }, []);
  
  // Parse the resume text to extract work experience entries
  const parseResumeForWorkExperience = () => {
    // This is a simplified example - in a real implementation, 
    // this would use more sophisticated parsing logic
    const lines = resumeText.split('\n');
    const entries: WorkExperienceEntry[] = [];
    let currentEntry: Partial<WorkExperienceEntry> = {};
    let isInExperienceSection = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Very simple section detection - would be more robust in production
      if (line.toLowerCase().includes('experience') && line.length < 30) {
        isInExperienceSection = true;
        continue;
      }
      
      if (isInExperienceSection) {
        // Detect new job entry (usually starts with company or title)
        if (line.length > 0 && line.length < 60 && !line.startsWith('-') && !line.startsWith('•')) {
          // Save previous entry if exists
          if (currentEntry.company || currentEntry.title) {
            entries.push({
              id: `job-${entries.length}`,
              company: currentEntry.company || '',
              title: currentEntry.title || '',
              startDate: currentEntry.startDate || '',
              endDate: currentEntry.endDate || '',
              description: currentEntry.description || '',
              companyLocation: { country: '', state: '', city: '' }
            });
          }
          
          // Start new entry
          currentEntry = {
            company: line,
            description: ''
          };
        } 
        // Detect dates
        else if (line.match(/\d{4}/)) {
          const dates = line.match(/\d{2}\/\d{4}|\d{4}|[A-Za-z]+\s+\d{4}|Present/g);
          if (dates && dates.length > 0) {
            currentEntry.startDate = dates[0];
            currentEntry.endDate = dates.length > 1 ? dates[1] : 'Present';
          }
        }
        // Detect job title
        else if (line.length > 0 && line.length < 60 && !currentEntry.title) {
          currentEntry.title = line;
        }
        // Add to description
        else if (line.length > 0) {
          currentEntry.description = (currentEntry.description || '') + line + '\n';
        }
      }
    }
    
    // Add the last entry
    if (currentEntry.company || currentEntry.title) {
      entries.push({
        id: `job-${entries.length}`,
        company: currentEntry.company || '',
        title: currentEntry.title || '',
        startDate: currentEntry.startDate || '',
        endDate: currentEntry.endDate || '',
        description: currentEntry.description || '',
        companyLocation: { country: '', state: '', city: '' }
      });
    }
    
    setWorkExperienceEntries(entries);
  };
  
  // Parse the resume text to extract education entries
  const parseResumeForEducation = () => {
    const lines = resumeText.split('\n');
    const entries: Education[] = [];
    let currentEntry: Partial<Education> = {};
    let isInEducationSection = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Simple section detection
      if (line.toLowerCase().includes('education') && line.length < 30) {
        isInEducationSection = true;
        continue;
      }
      
      if (isInEducationSection) {
        // Detect new education entry
        if (line.length > 0 && line.length < 100 && !line.startsWith('-') && !line.startsWith('•')) {
          // Save previous entry if exists
          if (currentEntry.degree || currentEntry.university) {
            entries.push({
              id: `edu-${entries.length}`,
              degree: currentEntry.degree || '',
              fieldOfStudy: currentEntry.fieldOfStudy || '',
              university: currentEntry.university || '',
              startDate: currentEntry.startDate || '',
              endDate: currentEntry.endDate || '',
              country: '',
              state: '',
              customUniversity: false
            });
          }
          
          // Try to extract university and degree
          if (line.includes(',')) {
            // Format: "University Name, Degree"
            const parts = line.split(',');
            currentEntry = {
              university: parts[0].trim(),
              degree: parts.slice(1).join(',').trim()
            };
          } else if (line.includes('-')) {
            // Format: "Degree - University Name"
            const parts = line.split('-');
            currentEntry = {
              degree: parts[0].trim(),
              university: parts.slice(1).join('-').trim()
            };
          } else {
            // Can't determine format, just use as university
            currentEntry = {
              university: line,
              degree: ''
            };
          }
        }
        // Detect dates
        else if (line.match(/\d{4}/)) {
          const dates = line.match(/\d{2}\/\d{4}|\d{4}|[A-Za-z]+\s+\d{4}|Present/g);
          if (dates && dates.length > 0) {
            currentEntry.startDate = dates[0];
            currentEntry.endDate = dates.length > 1 ? dates[1] : 'Present';
          }
        }
        // Detect field of study if not part of degree
        else if (line.length > 0 && line.length < 60 && !currentEntry.fieldOfStudy) {
          currentEntry.fieldOfStudy = line;
        }
        // If next section starts, break
        else if (line.length > 0 && line.length < 30 && 
          (line.toLowerCase().includes('experience') || 
           line.toLowerCase().includes('skills') || 
           line.toLowerCase().includes('projects'))) {
          isInEducationSection = false;
        }
      }
    }
    
    // Add the last entry
    if (currentEntry.degree || currentEntry.university) {
      entries.push({
        id: `edu-${entries.length}`,
        degree: currentEntry.degree || '',
        fieldOfStudy: currentEntry.fieldOfStudy || '',
        university: currentEntry.university || '',
        startDate: currentEntry.startDate || '',
        endDate: currentEntry.endDate || '',
        country: '',
        state: '',
        customUniversity: false
      });
    }
    
    // If no entries were found but education section exists, add an empty one
    if (entries.length === 0 && isInEducationSection) {
      entries.push({
        id: 'edu-0',
        degree: '',
        fieldOfStudy: '',
        university: '',
        startDate: '',
        endDate: '',
        country: '',
        state: '',
        customUniversity: false
      });
    }
    
    setEducationEntries(entries);
  };
  
  // Identify missing sections based on the resume and job description
  const identifyMissingSections = () => {
    const missingList: MissingSection[] = [];
    
    // Check for summary/objective
    if (!resumeText.toLowerCase().includes('summary') && 
        !resumeText.toLowerCase().includes('objective')) {
      missingList.push({
        id: 'missing-summary',
        name: 'Professional Summary',
        recommendation: 'Add a concise professional summary highlighting your key qualifications relevant to the job',
        example: `Professional Summary\n\nExperienced professional with skills in ${
          analysisReport.keywords?.hard_skills
            .filter((skill: any) => skill.matched)
            .slice(0, 3)
            .map((skill: any) => skill.term)
            .join(', ')
        }. Proven track record of delivering results in a fast-paced environment.`
      });
    }
    
    // Check for skills section
    if (!resumeText.toLowerCase().includes('skills') ||
        analysisReport.section_analysis?.skills === 'missing') {
      missingList.push({
        id: 'missing-skills',
        name: 'Skills',
        recommendation: 'Add a dedicated skills section to highlight your technical and soft skills',
        example: `Skills\n\n${
          analysisReport.keywords?.hard_skills
            .filter((skill: any) => skill.matched)
            .slice(0, 6)
            .map((skill: any) => skill.term)
            .join(' • ')
        }`
      });
    }
    
    // Check for projects section if applicable
    if (!resumeText.toLowerCase().includes('projects') && 
        jobDescriptionText.toLowerCase().includes('project')) {
      missingList.push({
        id: 'missing-projects',
        name: 'Projects',
        recommendation: 'Add a projects section to showcase relevant work that demonstrates your skills',
        example: 'Projects\n\nProject Name\nDeveloped a solution that [value proposition]. Utilized [key skills relevant to job description].'
      });
    }
    
    // Check for education
    if (!resumeText.toLowerCase().includes('education')) {
      missingList.push({
        id: 'missing-education',
        name: 'Education',
        recommendation: 'Add your educational background, including degrees, institutions, and graduation dates',
        example: 'Education\n\nBachelor of Science, Computer Science\nUniversity Name - Graduation Year'
      });
    }
    
    // Check for certifications if mentioned in job description
    if (!resumeText.toLowerCase().includes('certification') && 
        jobDescriptionText.toLowerCase().includes('certif')) {
      missingList.push({
        id: 'missing-certifications',
        name: 'Certifications',
        recommendation: 'Add any relevant certifications that align with the job requirements',
        example: 'Certifications\n\nCertification Name - Issuing Organization - Year'
      });
    }
    
    setMissingSections(missingList);
  };
  
  // Extract keyword suggestions from the analysis report
  const keywordSuggestions: KeywordSuggestion[] = 
    analysisReport.keywords?.hard_skills
      .filter((skill: any) => !skill.matched)
      .map((skill: any, index: number) => ({
        id: `keyword-${index}-${skill.term}`,
        type: 'keyword',
        keyword: skill.term,
        originalText: '',
        suggestedText: `Consider adding the keyword "${skill.term}" to your skills section or incorporating it into your experience.`,
        section: 'skills'
      })) || [];
  
  // Extract missing information requirements
  const generateMissingInfo = (): MissingInfo[] => {
    const missingInfo: MissingInfo[] = [];
    
    // Check for missing dates in work experience
    const entriesWithMissingDates = workExperienceEntries.filter(entry => 
      !entry.startDate || entry.startDate.trim() === '' || 
      !entry.endDate || entry.endDate.trim() === ''
    );
    
    if (entriesWithMissingDates.length > 0) {
      entriesWithMissingDates.forEach(entry => {
        missingInfo.push({
          id: `missing-dates-${entry.id}`,
          type: 'dates',
          description: `Your work experience at ${entry.company || 'a company'} as ${entry.title || 'a role'} is missing dates.`,
          fields: ['startDate', 'endDate'],
          section: 'experience'
        });
      });
    }
    
    // Check for missing metrics in achievements
    if (analysisReport.improvement_potential?.achievement_emphasis?.level !== 'low') {
      missingInfo.push({
        id: 'missing-metrics',
        type: 'metrics',
        description: 'Your achievements could be strengthened with quantifiable metrics.',
        fields: ['metric'],
        section: 'experience'
      });
    }
    
    // Check for complete contact information
    if (analysisReport.ats_checks?.some((check: any) => 
      check.check_name === 'Contact Information' && check.status !== 'pass'
    )) {
      missingInfo.push({
        id: 'missing-contact',
        type: 'contact',
        description: 'Your resume may be missing key contact information.',
        fields: ['phone', 'email', 'linkedin'],
        section: 'contact'
      });
    }
    
    // Check for education details if education section exists but may be incomplete
    if (resumeText.toLowerCase().includes('education') && 
        !resumeText.match(/degree|bachelor|master|phd|diploma/i)) {
      missingInfo.push({
        id: 'missing-education-details',
        type: 'education',
        description: 'Your education section may be missing key details like degree name or graduation year.',
        fields: ['degree', 'institution', 'year'],
        section: 'education'
      });
    }
    
    return missingInfo;
  };
  
  // Format suggestions based on ATS checks
  const formatSuggestions: FormattingSuggestion[] = 
    analysisReport.ats_checks
      ?.filter((check: any) => check.status !== 'pass')
      .map((check: any, index: number) => ({
        id: `format-${index}`,
        type: 'formatting',
        issue: check.check_name,
        description: check.message,
        suggestedFix: `Apply ${check.check_name} formatting fix`
      })) || [];
  
  // Create section suggestions
  const sectionSuggestions: SectionSuggestion[] = 
    missingSections.map(section => ({
      id: `section-${section.id}`,
      type: 'section',
      sectionName: section.name,
      suggestedText: section.example || `${section.name}\n\n[Add your ${section.name.toLowerCase()} here]`
    }));
  
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
    // and mark this step as completed
    setMissingSections(prev => 
      prev.filter(section => selectedSections.includes(section.id))
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
  
  const handleMissingInfoSubmit = (info: any) => {
    // In a real implementation, this would update the resume content
    // with the provided information
    
    // Mark current step as completed
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps(prev => [...prev, currentStep]);
    }
    
    // Move to next step
    handleNextStep();
  };
  
  const handleFinalize = () => {
    // In a real implementation, this would save the finalized resume
    onClose();
  };
  
  // Calculate progress percentage
  const progressPercentage = (completedSteps.length / totalSteps) * 100;

  // Define step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <CardHeader>
              <CardTitle>Step 1: Review Missing Sections</CardTitle>
              <CardDescription>
                These sections are recommended based on the job description but appear to be missing from your resume.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SectionCheckList 
                missingSections={missingSections} 
                onSelectionChange={handleSectionSelection}
              />
            </CardContent>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <CardHeader>
              <CardTitle>Step 2: Work Experience Details</CardTitle>
              <CardDescription>
                Ensure your work experience entries have all required information, especially dates and location.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WorkExperienceForm 
                entries={workExperienceEntries}
                onChange={handleWorkExperienceUpdate}
              />
            </CardContent>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <CardHeader>
              <CardTitle>Step 3: Education Details</CardTitle>
              <CardDescription>
                Complete your education information with institutions and degrees.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EducationForm
                entries={educationEntries}
                onChange={handleEducationUpdate}
              />
            </CardContent>
          </div>
        );
      case 4:
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
                jobKeywords={analysisReport.keywords?.hard_skills
                  .filter((skill: any) => skill.matched)
                  .map((skill: any) => skill.term) || []}
                onChange={handleProjectsUpdate}
              />
            </CardContent>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <CardHeader>
              <CardTitle>Step 5: Review Suggestions</CardTitle>
              <CardDescription>
                Review AI-generated suggestions to optimize your resume for this job.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SuggestionsList 
                keywordSuggestions={keywordSuggestions}
                formatSuggestions={formatSuggestions}
                sectionSuggestions={sectionSuggestions}
                onSuggestionAction={handleSuggestionAction}
              />
            </CardContent>
          </div>
        );
      case 6:
        return (
          <div className="space-y-6">
            <CardHeader>
              <CardTitle>Step 6: Finalize Resume</CardTitle>
              <CardDescription>
                Review and edit your optimized resume before finalizing.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResumeEditor 
                initialContent={optimizedResume}
                onChange={setOptimizedResume}
              />
            </CardContent>
          </div>
        );
      default:
        return null;
    }
  };

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
      
      {renderStepContent()}
      
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
