
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UploadTabContent from './UploadTabContent';
import PasteTabContent from './PasteTabContent';
import AnalyzeButton from './AnalyzeButton';

interface InputCardProps {
  resumeFile: File | null;
  jobDescriptionFile: File | null;
  resumeText: string;
  jobDescriptionText: string;
  setResumeFile: (file: File | null) => void;
  setJobDescriptionFile: (file: File | null) => void;
  setResumeText: (text: string) => void;
  setJobDescriptionText: (text: string) => void;
  isAnalyzing: boolean;
  canAnalyze: boolean;
  onAnalyze: () => void;
}

const InputCard = ({
  resumeFile,
  jobDescriptionFile,
  resumeText,
  jobDescriptionText,
  setResumeFile,
  setJobDescriptionFile,
  setResumeText,
  setJobDescriptionText,
  isAnalyzing,
  canAnalyze,
  onAnalyze
}: InputCardProps) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">AI Resume Scanner</CardTitle>
        <CardDescription>
          Compare your resume against a job description to see how well you match
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="upload">Upload Files</TabsTrigger>
            <TabsTrigger value="paste">Paste Text</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-8">
            <UploadTabContent
              resumeFile={resumeFile}
              jobDescriptionFile={jobDescriptionFile}
              setResumeFile={setResumeFile}
              setJobDescriptionFile={setJobDescriptionFile}
            />
          </TabsContent>
          
          <TabsContent value="paste" className="space-y-8">
            <PasteTabContent
              resumeText={resumeText}
              jobDescriptionText={jobDescriptionText}
              setResumeText={setResumeText}
              setJobDescriptionText={setJobDescriptionText}
            />
          </TabsContent>
        </Tabs>
        
        <AnalyzeButton
          onClick={onAnalyze}
          disabled={!canAnalyze || isAnalyzing}
          isAnalyzing={isAnalyzing}
        />
      </CardContent>
    </Card>
  );
};

export default InputCard;
