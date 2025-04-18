import React, { useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import ReportView from '@/components/report/ReportView';
import { Button } from '@/components/ui/button';
import { FileText, FileDown } from 'lucide-react';
import html2pdf from 'html2pdf.js';

const ReportPage = () => {
  const location = useLocation();
  const state = location.state as {
    matchScore: number;
    report: any;
    userRole: string;
    resumeText: string;
    jobDescriptionText: string;
    jobTitle: string;
    companyName: string;
  } | null;

  useEffect(() => {
    if (state) {
      console.log("ReportPage received state:", {
        matchScore: state.matchScore,
        reportExists: !!state.report,
        userRole: state.userRole
      });
    }
  }, [state]);

  if (!state) {
    return <Navigate to="/" replace />;
  }

  // Ensure match score is a valid number
  const validMatchScore = typeof state.matchScore === 'number' ? state.matchScore : 0;

  // Function to generate PDF content
  const generateReportHTML = () => {
    const report = state.report;
    const matchScore = validMatchScore;

    // Helper function to format analysis sections
    const formatSection = (title: string, content: string) => {
      return `
        <div class="section">
          <h3>${title}</h3>
          <p>${content}</p>
        </div>
      `;
    };

    // Create HTML content for matched/unmatched skills
    const renderSkills = (skills: any[]) => {
      if (!skills || !Array.isArray(skills)) return '';
      
      return skills.map(skill => 
        `<li style="${skill.matched ? 'color: green;' : 'color: #777;'}">${skill.term} ${skill.matched ? '✓' : '✗'}</li>`
      ).join('');
    };

    // Build the HTML content
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Resume Analysis Report</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            margin: 20px;
            color: #333;
            line-height: 1.6;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
          }
          h1, h2, h3 {
            margin-top: 20px;
          }
          h1 {
            text-align: center;
            font-size: 24px;
            margin-bottom: 20px;
          }
          h2 {
            font-size: 20px;
            border-bottom: 1px solid #ccc;
            padding-bottom: 5px;
          }
          h3 {
            font-size: 16px;
            margin-bottom: 10px;
          }
          .header-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
          }
          .match-score {
            font-size: 18px;
            font-weight: bold;
            color: ${matchScore >= 80 ? 'green' : matchScore >= 60 ? 'orange' : 'red'};
          }
          .section {
            margin-bottom: 15px;
          }
          ul {
            margin-top: 5px;
            padding-left: 25px;
          }
          li {
            margin-bottom: 5px;
          }
          .badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 4px;
            margin-right: 5px;
            margin-bottom: 5px;
            font-size: 14px;
          }
          .matched {
            background-color: #e6f7e6;
            color: #2e7d32;
          }
          .unmatched {
            background-color: #f5f5f5;
            color: #777;
          }
          .suggestions-list {
            margin-top: 10px;
          }
          .suggestions-list li {
            margin-bottom: 8px;
          }
          .ats-check {
            margin-bottom: 10px;
            padding: 8px;
            border-radius: 4px;
          }
          .pass {
            background-color: #e6f7e6;
          }
          .warning {
            background-color: #fff8e1;
          }
          .fail {
            background-color: #ffebee;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Resume Analysis Report</h1>
          
          <div class="header-info">
            <div>
              <p><strong>Position:</strong> ${state.jobTitle || 'Not specified'}</p>
              <p><strong>Company:</strong> ${state.companyName || 'Not specified'}</p>
              <p><strong>Analysis Type:</strong> ${state.userRole === 'job_seeker' ? 'Job Seeker' : 'Recruiter'} View</p>
            </div>
            <div>
              <p class="match-score">Match Score: ${matchScore}%</p>
            </div>
          </div>

          <h2>Keywords Match</h2>
          <div class="section">
            <h3>Hard Skills</h3>
            <ul>
              ${renderSkills(report.keywords.hard_skills)}
            </ul>
            
            <h3>Soft Skills</h3>
            <ul>
              ${renderSkills(report.keywords.soft_skills)}
            </ul>
          </div>

          <h2>ATS Compatibility</h2>
          <div class="section">
            ${report.ats_checks.map((check: any) => `
              <div class="ats-check ${check.status}">
                <strong>${check.check_name}</strong>: ${check.message}
              </div>
            `).join('')}
          </div>

          ${report.advanced_criteria ? `
            <h2>Advanced Requirements</h2>
            <div class="section">
              ${report.advanced_criteria.map((criteria: any) => `
                <div>
                  <strong>${criteria.name}</strong>: 
                  <span style="color: ${criteria.status === 'matched' ? 'green' : criteria.status === 'partial' ? 'orange' : 'red'}">
                    ${criteria.status}
                  </span>
                  <p>${criteria.description}</p>
                </div>
              `).join('')}
            </div>
          ` : ''}

          ${report.section_analysis ? `
            <h2>Resume Structure Analysis</h2>
            <div class="section">
              ${Object.entries(report.section_analysis).map(([key, value]) => 
                formatSection(key.charAt(0).toUpperCase() + key.slice(1), value as string)
              ).join('')}
            </div>
          ` : ''}

          <h2>Recommendations</h2>
          <div class="section">
            <ul class="suggestions-list">
              ${report.suggestions.map((suggestion: string) => `<li>${suggestion}</li>`).join('')}
            </ul>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  // Handle export to PDF
  const handleExportPdf = async () => {
    const htmlContent = generateReportHTML();
    
    // Create a temporary div to render the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    document.body.appendChild(tempDiv);
    
    // Configure html2pdf options
    const options = {
      margin: [15, 15],
      filename: `Resume_Analysis_${state.jobTitle || 'Report'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    // Generate and download the PDF
    await html2pdf().from(tempDiv).set(options).save();
    
    // Clean up
    document.body.removeChild(tempDiv);
  };

  // Handle export to DOCX (HTML format as a simplified approach)
  const handleExportDocx = async () => {
    const htmlContent = generateReportHTML();
    
    // Create a Blob with the HTML content
    const blob = new Blob([htmlContent], { type: 'text/html' });
    
    // Create a download link and trigger it
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Resume_Analysis_${state.jobTitle || 'Report'}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-end gap-4 mb-6">
        <Button 
          variant="outline" 
          onClick={handleExportDocx}
          className="flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          Export as HTML
        </Button>
        <Button 
          onClick={handleExportPdf}
          className="flex items-center gap-2"
        >
          <FileDown className="h-4 w-4" />
          Export PDF
        </Button>
      </div>

      <ReportView
        matchScore={validMatchScore}
        report={state.report}
        userRole={state.userRole}
        resumeText={state.resumeText}
        jobDescriptionText={state.jobDescriptionText}
        jobTitle={state.jobTitle || ''}
        companyName={state.companyName || ''}
      />
    </div>
  );
};

export default ReportPage;
