
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ResumeSection {
  id: string;
  title: string;
  content: string;
  type: string;
}

interface AddSectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (section: ResumeSection) => void;
}

// Default content templates for different section types
const sectionTemplates: Record<string, { title: string, content: string }> = {
  summary: {
    title: "Professional Summary",
    content: "Experienced professional with X years of expertise in Y. Proven track record of Z with strong skills in A, B, and C."
  },
  experience: {
    title: "Work Experience",
    content: "Job Title | Company Name | Start Date - End Date\n• Responsibility or achievement\n• Responsibility or achievement\n• Responsibility or achievement"
  },
  education: {
    title: "Education",
    content: "Degree Name | University Name | Graduation Year\n• GPA: X.X/4.0\n• Relevant Coursework: Course 1, Course 2\n• Achievements: Achievement 1, Achievement 2"
  },
  skills: {
    title: "Skills",
    content: "Technical Skills: Skill 1, Skill 2, Skill 3\n\nSoft Skills: Skill 1, Skill 2, Skill 3"
  },
  projects: {
    title: "Projects",
    content: "Project Name | Duration\n• Description of project\n• Technologies used\n• Your role and contributions"
  },
  certifications: {
    title: "Certifications",
    content: "Certification Name | Issuing Organization | Date\nCertification Name | Issuing Organization | Date"
  },
  awards: {
    title: "Awards & Achievements",
    content: "Award Name | Issuing Organization | Date\n• Brief description"
  },
  languages: {
    title: "Languages",
    content: "Language 1: Proficiency Level\nLanguage 2: Proficiency Level"
  },
  interests: {
    title: "Interests",
    content: "Interest 1, Interest 2, Interest 3"
  },
  references: {
    title: "References",
    content: "Available upon request"
  },
  custom: {
    title: "Custom Section",
    content: "Enter your content here"
  }
};

export const AddSectionDialog: React.FC<AddSectionDialogProps> = ({ 
  open, 
  onOpenChange, 
  onAdd 
}) => {
  const [sectionType, setSectionType] = useState("summary");
  const [sectionTitle, setSectionTitle] = useState(sectionTemplates.summary.title);
  
  // Update title when section type changes
  React.useEffect(() => {
    if (sectionType && sectionTemplates[sectionType]) {
      setSectionTitle(sectionTemplates[sectionType].title);
    }
  }, [sectionType]);
  
  const handleAddSection = () => {
    const newSection: ResumeSection = {
      id: `section-${Date.now()}`,
      title: sectionTitle,
      content: sectionTemplates[sectionType]?.content || "",
      type: sectionType
    };
    
    onAdd(newSection);
    
    // Reset the form
    setSectionType("summary");
    setSectionTitle(sectionTemplates.summary.title);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Section</DialogTitle>
          <DialogDescription>
            Choose a section type and customize its title.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="section-type" className="text-sm font-medium">
              Section Type
            </label>
            <Select
              value={sectionType}
              onValueChange={setSectionType}
            >
              <SelectTrigger id="section-type">
                <SelectValue placeholder="Select section type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="summary">Summary</SelectItem>
                <SelectItem value="experience">Experience</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="skills">Skills</SelectItem>
                <SelectItem value="projects">Projects</SelectItem>
                <SelectItem value="certifications">Certifications</SelectItem>
                <SelectItem value="awards">Awards</SelectItem>
                <SelectItem value="languages">Languages</SelectItem>
                <SelectItem value="interests">Interests</SelectItem>
                <SelectItem value="references">References</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="section-title" className="text-sm font-medium">
              Section Title
            </label>
            <Input
              id="section-title"
              value={sectionTitle}
              onChange={(e) => setSectionTitle(e.target.value)}
              placeholder="Enter section title"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddSection}>
            Add Section
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
