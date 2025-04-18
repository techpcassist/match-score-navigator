
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ReportViewDetailsProps {
  report: any;
  resumeText: string;
  jobDescriptionText: string;
  isMobile?: boolean;
}

const ReportViewDetails: React.FC<ReportViewDetailsProps> = ({
  report,
  resumeText,
  jobDescriptionText,
  isMobile = false
}) => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="resume">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="resume">Resume</TabsTrigger>
          <TabsTrigger value="job">Job Description</TabsTrigger>
        </TabsList>
        
        <TabsContent value="resume" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Resume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap rounded-md bg-muted p-4 text-sm">
                {resumeText || "No resume text available"}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="job" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap rounded-md bg-muted p-4 text-sm">
                {jobDescriptionText || "No job description text available"}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {report && report.full_analysis && (
        <Card>
          <CardHeader>
            <CardTitle>Full Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground whitespace-pre-wrap">
              {report.full_analysis}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReportViewDetails;
