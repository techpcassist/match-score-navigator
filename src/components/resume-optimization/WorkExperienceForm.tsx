import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { WorkExperienceEntry, Location } from './types';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, Plus, Trash2, Sparkles } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const COUNTRIES = ['United States', 'United Kingdom', 'Canada', 'Australia', 'India', 'Germany', 'France', 'China', 'Japan'];

const STATES_BY_COUNTRY: Record<string, string[]> = {
  'United States': ['Alabama', 'Alaska', 'Arizona', 'California', 'Colorado', 'Florida', 'New York', 'Texas', 'Washington'],
  'United Kingdom': ['England', 'Scotland', 'Wales', 'Northern Ireland'],
  'Canada': ['Alberta', 'British Columbia', 'Ontario', 'Quebec'],
  'Australia': ['New South Wales', 'Queensland', 'Victoria', 'Western Australia'],
  'India': ['Maharashtra', 'Karnataka', 'Tamil Nadu', 'Delhi', 'Uttar Pradesh'],
  'Germany': ['Bavaria', 'Berlin', 'Hesse', 'Saxony'],
  'France': ['Île-de-France', 'Provence-Alpes-Côte d\'Azur', 'Normandy', 'Brittany'],
  'China': ['Beijing', 'Shanghai', 'Guangdong', 'Sichuan'],
  'Japan': ['Tokyo', 'Osaka', 'Hokkaido', 'Kyoto']
};

const generateJobDescription = (
  title: string,
  teamName?: string,
  teamSize?: number,
  projectName?: string
): string => {
  const titleLower = title.toLowerCase();
  const descriptions: Record<string, string[]> = {
    'software engineer': [
      `Led development of ${projectName || 'key features'} within the ${teamName || 'engineering'} team of ${teamSize || '5+'} members. Collaborated with cross-functional stakeholders to deliver high-quality software solutions that improved system performance by 30%. Implemented CI/CD pipelines that decreased deployment time by 50%.`,
      `Designed and implemented scalable solutions for ${projectName || 'critical systems'} as part of the ${teamName || 'development'} team (${teamSize || '4+'} engineers). Reduced technical debt by 40% through code refactoring and implementing best practices. Utilized Agile methodologies to deliver features on time and under budget.`,
      `Developed and maintained ${projectName || 'core applications'} with the ${teamName || 'product'} team (${teamSize || '6+'} members). Migrated legacy systems to modern architectures, resulting in 45% performance improvement. Mentored junior developers and contributed to technical documentation.`
    ],
    'product manager': [
      `Led product strategy for ${projectName || 'key initiatives'} with a cross-functional team of ${teamSize || '8+'} members in the ${teamName || 'product'} department. Increased user engagement by 35% through data-driven feature prioritization. Conducted user research to inform product roadmap decisions.`,
      `Managed the product roadmap for ${projectName || 'strategic products'}, coordinating with a team of ${teamSize || '7+'} professionals across ${teamName || 'various departments'}. Drove 25% growth in monthly active users through targeted feature releases. Defined KPIs to measure product success and implemented tracking systems.`,
      `Spearheaded the development of ${projectName || 'innovative solutions'} within the ${teamName || 'product organization'}, leading a team of ${teamSize || '10+'} cross-functional experts. Increased customer satisfaction scores by 40% through user-centric design processes. Conducted competitive analysis to identify market opportunities.`
    ],
    'data scientist': [
      `Built predictive models for ${projectName || 'business intelligence'} as part of the ${teamSize || '4+'}-person ${teamName || 'analytics'} team. Implemented machine learning algorithms that improved forecast accuracy by 45%. Worked with stakeholders to translate business requirements into technical solutions.`,
      `Conducted advanced data analysis for ${projectName || 'key initiatives'} with ${teamSize || '5+'} analysts in the ${teamName || 'data science'} group. Created visualizations that helped stakeholders make informed decisions, increasing operational efficiency by 30%. Developed ETL pipelines for data processing.`,
      `Developed and deployed machine learning models for ${projectName || 'critical systems'} with the ${teamSize || '6+'}-member ${teamName || 'AI research'} team. Models achieved 92% accuracy and reduced manual processing time by 70%. Presented findings to executive leadership and influenced strategic decisions.`
    ],
    'marketing': [
      `Led marketing campaigns for ${projectName || 'product launches'} with a ${teamSize || '5+'}-person ${teamName || 'marketing'} team. Achieved 40% higher conversion rates than previous campaigns through strategic targeting and messaging. Managed a budget of $1.2M and delivered positive ROI.`,
      `Managed the ${teamName || 'digital marketing'} strategy for ${projectName || 'key product lines'} with a team of ${teamSize || '7+'} specialists. Increased social media engagement by 65% and grew email marketing list by 12,000 subscribers. Implemented A/B testing to optimize campaign performance.`,
      `Directed comprehensive marketing initiatives for ${projectName || 'brand development'} with ${teamSize || '6+'} team members in the ${teamName || 'marketing'} department. Increased brand awareness by 35% through integrated omnichannel campaigns. Analyzed marketing metrics to refine strategy.`
    ],
    'project manager': [
      `Managed ${projectName || 'enterprise-level projects'} with a ${teamSize || '8+'}-person cross-functional ${teamName || 'project'} team. Delivered all milestones on time and 15% under budget through effective resource allocation. Implemented risk management strategies that prevented potential delays.`,
      `Led ${projectName || 'strategic initiatives'} from conception to delivery, coordinating the efforts of ${teamSize || '12+'} team members across ${teamName || 'multiple departments'}. Improved project delivery time by 25% through process optimization. Utilized both Agile and Waterfall methodologies.`,
      `Oversaw the implementation of ${projectName || 'mission-critical systems'} within the ${teamName || 'technology'} division, managing a diverse team of ${teamSize || '10+'} professionals. Maintained 100% stakeholder satisfaction through transparent communication and expectation management.`
    ]
  };

  let bestMatch = 'software engineer'; // default
  let highestMatchScore = 0;
  
  for (const key in descriptions) {
    if (titleLower.includes(key)) {
      const matchScore = key.length;
      if (matchScore > highestMatchScore) {
        highestMatchScore = matchScore;
        bestMatch = key;
      }
    }
  }

  const options = descriptions[bestMatch] || descriptions['software engineer'];
  return options[Math.floor(Math.random() * options.length)];
};

interface WorkExperienceFormProps {
  entries: WorkExperienceEntry[];
  onChange: (entries: WorkExperienceEntry[]) => void;
}

export const WorkExperienceForm = ({ entries, onChange }: WorkExperienceFormProps) => {
  const [openEntries, setOpenEntries] = useState<string[]>([
    entries.length > 0 ? entries[0].id : ''
  ]);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  
  const toggleEntry = (id: string) => {
    setOpenEntries(prev => {
      if (prev.includes(id)) {
        return prev.filter(entryId => entryId !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  
  const updateEntry = (id: string, field: keyof WorkExperienceEntry, value: any) => {
    const updatedEntries = entries.map(entry => {
      if (entry.id === id) {
        if (field === 'companyLocation') {
          return { ...entry, companyLocation: { ...entry.companyLocation, ...value } };
        }
        return { ...entry, [field]: value };
      }
      return entry;
    });
    
    onChange(updatedEntries);
  };
  
  const addNewEntry = () => {
    const newEntry: WorkExperienceEntry = {
      id: `job-${Date.now()}`,
      company: '',
      companyLocation: { country: '', state: '', city: '' },
      title: '',
      startDate: '',
      endDate: '',
      description: '',
      teamName: '',
      teamSize: 0,
      projectName: ''
    };
    
    const updatedEntries = [...entries, newEntry];
    onChange(updatedEntries);
    
    setOpenEntries(prev => [...prev, newEntry.id]);
  };
  
  const removeEntry = (id: string) => {
    const updatedEntries = entries.filter(entry => entry.id !== id);
    onChange(updatedEntries);
    
    setOpenEntries(prev => prev.filter(entryId => entryId !== id));
  };
  
  const handleGenerateDescription = (entry: WorkExperienceEntry) => {
    setGeneratingId(entry.id);
    setTimeout(() => {
      const description = generateJobDescription(
        entry.title || '',
        entry.teamName,
        entry.teamSize,
        entry.projectName
      );
      
      updateEntry(entry.id, 'description', description);
      setGeneratingId(null);
    }, 1000);
  };
  
  if (entries.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground mb-4">No work experience entries detected in your resume.</p>
        <Button onClick={addNewEntry}>Add Work Experience</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground mb-4">
        Complete the details for each work experience entry. Dates and specific achievements with metrics are particularly important for ATS systems.
      </p>
      
      <div className="space-y-4">
        {entries.map(entry => (
          <Card key={entry.id}>
            <CardContent className="p-4">
              <Collapsible 
                open={openEntries.includes(entry.id)} 
                onOpenChange={() => toggleEntry(entry.id)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" className="p-2 h-auto">
                        {openEntries.includes(entry.id) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    <span className="font-medium">
                      {entry.company || 'Company'} - {entry.title || 'Position'}
                    </span>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeEntry(entry.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <CollapsibleContent className="pt-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`${entry.id}-company`}>Company</Label>
                        <Input
                          id={`${entry.id}-company`}
                          value={entry.company || ''}
                          onChange={(e) => updateEntry(entry.id, 'company', e.target.value)}
                          placeholder="Company name"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`${entry.id}-title`}>Job Title</Label>
                        <Input
                          id={`${entry.id}-title`}
                          value={entry.title || ''}
                          onChange={(e) => updateEntry(entry.id, 'title', e.target.value)}
                          placeholder="Your position"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Company Location</Label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <Select
                            value={entry.companyLocation?.country || ''}
                            onValueChange={(value) => updateEntry(entry.id, 'companyLocation', { country: value })}
                          >
                            <SelectTrigger id={`${entry.id}-country`}>
                              <SelectValue placeholder="Select Country" />
                            </SelectTrigger>
                            <SelectContent>
                              {COUNTRIES.map(country => (
                                <SelectItem key={country} value={country}>{country}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {entry.companyLocation?.country && (
                          <div>
                            <Select
                              value={entry.companyLocation?.state || ''}
                              onValueChange={(value) => updateEntry(entry.id, 'companyLocation', { state: value })}
                            >
                              <SelectTrigger id={`${entry.id}-state`}>
                                <SelectValue placeholder="Select State/Province" />
                              </SelectTrigger>
                              <SelectContent>
                                {(STATES_BY_COUNTRY[entry.companyLocation.country] || []).map(state => (
                                  <SelectItem key={state} value={state}>{state}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                        
                        <div>
                          <Input
                            id={`${entry.id}-city`}
                            value={entry.companyLocation?.city || ''}
                            onChange={(e) => updateEntry(entry.id, 'companyLocation', { city: e.target.value })}
                            placeholder="City"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`${entry.id}-start-date`}>Start Date (MM/YYYY)</Label>
                        <Input
                          id={`${entry.id}-start-date`}
                          value={entry.startDate || ''}
                          onChange={(e) => updateEntry(entry.id, 'startDate', e.target.value)}
                          placeholder="MM/YYYY"
                          className={!entry.startDate ? "border-red-300" : ""}
                        />
                        {!entry.startDate && (
                          <p className="text-xs text-red-500 mt-1">Start date is required</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor={`${entry.id}-end-date`}>End Date (MM/YYYY or "Present")</Label>
                        <Input
                          id={`${entry.id}-end-date`}
                          value={entry.endDate || ''}
                          onChange={(e) => updateEntry(entry.id, 'endDate', e.target.value)}
                          placeholder="MM/YYYY or Present"
                          className={!entry.endDate ? "border-red-300" : ""}
                        />
                        {!entry.endDate && (
                          <p className="text-xs text-red-500 mt-1">End date is required</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Job Details (for AI-generated description)</Label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
                        <div>
                          <Input
                            id={`${entry.id}-team-name`}
                            value={entry.teamName || ''}
                            onChange={(e) => updateEntry(entry.id, 'teamName', e.target.value)}
                            placeholder="Team Name"
                          />
                        </div>
                        <div>
                          <Input
                            id={`${entry.id}-team-size`}
                            value={entry.teamSize || ''}
                            onChange={(e) => updateEntry(entry.id, 'teamSize', parseInt(e.target.value) || 0)}
                            placeholder="Team Size"
                            type="number"
                          />
                        </div>
                        <div>
                          <Input
                            id={`${entry.id}-project-name`}
                            value={entry.projectName || ''}
                            onChange={(e) => updateEntry(entry.id, 'projectName', e.target.value)}
                            placeholder="Project Name"
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-end gap-2">
                        <div className="flex-grow">
                          <Label htmlFor={`${entry.id}-description`}>Description & Achievements</Label>
                          <Textarea
                            id={`${entry.id}-description`}
                            value={entry.description || ''}
                            onChange={(e) => updateEntry(entry.id, 'description', e.target.value)}
                            placeholder="Include your responsibilities and quantifiable achievements"
                            rows={5}
                          />
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleGenerateDescription(entry)}
                          disabled={generatingId === entry.id || !entry.title}
                          className="mb-1 h-9"
                        >
                          <Sparkles className="h-4 w-4 mr-2" />
                          {generatingId === entry.id ? 'Generating...' : 'Generate'}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Pro tip: Add job details above and click "Generate" to create an AI-powered job description with achievements.
                      </p>
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
          onClick={addNewEntry}
          className="flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Another Position
        </Button>
      </div>
    </div>
  );
};
