
// resumeExporter.ts
import html2pdf from 'html2pdf.js';

interface ResumeSection {
  id: string;
  title: string;
  content: string;
  type: string;
}

// Function to format text with HTML
const formatText = (content: string): string => {
  if (!content) return '';
  
  // Replace **text** with bold text
  let formattedContent = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Replace _text_ with italic text
  formattedContent = formattedContent.replace(/_(.*?)_/g, '<em>$1</em>');
  
  // Replace bullet points with HTML list items
  formattedContent = formattedContent.replace(/^•\s*(.*?)$/gm, '<li>$1</li>');
  
  // Replace numbered lists with HTML ordered list items
  formattedContent = formattedContent.replace(/^\d+\.\s*(.*?)$/gm, '<li>$1</li>');
  
  // Wrap consecutive list items in proper HTML list tags
  if (formattedContent.includes('<li>')) {
    formattedContent = formattedContent.replace(
      /(<li>.*?<\/li>)(\n<li>.*?<\/li>)*/g, 
      match => match.includes('• ') ? `<ul>${match}</ul>` : `<ol>${match}</ol>`
    );
  }
  
  // Convert newlines to <br> tags
  formattedContent = formattedContent.replace(/\n/g, '<br>');
  
  return formattedContent;
};

// Generate HTML content for export
const generateResumeHTML = (title: string, sections: ResumeSection[]): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title || 'Resume'}</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          margin: 20px;
          color: #333;
          line-height: 1.6;
        }
        .resume-container {
          max-width: 800px;
          margin: 0 auto;
        }
        h1 {
          text-align: center;
          font-size: 24px;
          margin-bottom: 20px;
        }
        h2 {
          text-transform: uppercase;
          border-bottom: 1px solid #ccc;
          padding-bottom: 5px;
          margin-top: 20px;
          font-size: 16px;
          letter-spacing: 1px;
        }
        ul, ol {
          margin-top: 5px;
          padding-left: 25px;
        }
        li {
          margin-bottom: 5px;
        }
        p {
          margin: 5px 0;
        }
        .section {
          margin-bottom: 20px;
        }
      </style>
    </head>
    <body>
      <div class="resume-container">
        <h1>${title || 'Resume'}</h1>
        ${sections.map(section => `
          <div class="section">
            <h2>${section.title}</h2>
            <div>${formatText(section.content)}</div>
          </div>
        `).join('')}
      </div>
    </body>
    </html>
  `;
};

// Convert to DOCX format
const exportToDocx = async (title: string, sections: ResumeSection[]): Promise<void> => {
  try {
    // Create a simple text representation for DOCX
    // Note: In a production app, you'd use a proper DOCX library,
    // but for this example we'll use a simplified approach
    
    // Since we don't have a full DOCX library, we'll create a simple HTML file
    // that can be copied into a word processor
    const htmlContent = generateResumeHTML(title, sections);
    
    // Create a Blob with the HTML content
    const blob = new Blob([htmlContent], { type: 'text/html' });
    
    // Create a download link and trigger it
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title || 'Resume'}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting to DOCX:', error);
    throw new Error('Failed to export resume to DOCX format');
  }
};

// Convert to PDF format
const exportToPdf = async (title: string, sections: ResumeSection[]): Promise<void> => {
  try {
    // Create HTML content for the PDF
    const htmlContent = generateResumeHTML(title, sections);
    
    // Create a temporary div to render the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    document.body.appendChild(tempDiv);
    
    // Configure html2pdf options
    const options = {
      margin: [15, 15],
      filename: `${title || 'Resume'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    // Generate and download the PDF
    await html2pdf().from(tempDiv).set(options).save();
    
    // Clean up
    document.body.removeChild(tempDiv);
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    throw new Error('Failed to export resume to PDF format');
  }
};

export const resumeExporter = {
  exportToPdf,
  exportToDocx
};
