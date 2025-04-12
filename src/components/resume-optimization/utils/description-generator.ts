
import { callGenerativeAI } from './ai-helper';

export const generateJobDescription = async (
  title: string,
  teamName?: string,
  teamSize?: number,
  projectName?: string
): Promise<string> => {
  try {
    // First try to generate using AI
    let prompt = `Generate a professional job description for a ${title} position`;
    
    if (teamName) {
      prompt += ` in the ${teamName} team`;
    }
    
    if (teamSize && teamSize > 0) {
      prompt += ` of ${teamSize} members`;
    }
    
    if (projectName) {
      prompt += ` working on the ${projectName} project`;
    }
    
    prompt += `. Include 3-4 bullet points with specific, quantifiable achievements and metrics (e.g., increased efficiency by 30%). Format with bullet points (•) at the start of each accomplishment. Limit to 4-6 bullet points total.`;
    
    const aiResponse = await callGenerativeAI(prompt);
    
    if (aiResponse) {
      return aiResponse;
    }
    
    // If AI generation fails, fall back to pre-defined templates
    console.log("AI generation failed, using fallback templates");
    return getFallbackDescription(title, teamName, teamSize, projectName);
  } catch (error) {
    console.error("Error generating job description:", error);
    // Fallback to pre-defined templates on error
    return getFallbackDescription(title, teamName, teamSize, projectName);
  }
};

// Fallback function that uses pre-defined templates
const getFallbackDescription = (
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

// Generate a suggestion for a specific job duty based on job title
export const generateJobDutySuggestion = async (
  title: string
): Promise<string> => {
  try {
    // Try to generate using AI first
    const prompt = `Generate a single specific job duty or achievement for a ${title} position that includes a measurable outcome or metric. The duty should be 1-2 sentences maximum and start with an action verb.`;
    
    const aiResponse = await callGenerativeAI(prompt);
    
    if (aiResponse) {
      return aiResponse;
    }
    
    // If AI generation fails, fall back to pre-defined duties
    console.log("AI generation failed, using fallback duties");
    return getFallbackDuty(title);
  } catch (error) {
    console.error("Error generating duty suggestion:", error);
    // Fallback to pre-defined duties on error
    return getFallbackDuty(title);
  }
};

// Fallback function that uses pre-defined duties
const getFallbackDuty = (title: string): string => {
  const titleLower = title.toLowerCase();
  const duties: Record<string, string[]> = {
    'software engineer': [
      "Implemented responsive UI components using React that improved user engagement by 35%",
      "Optimized database queries that reduced page load times by 45%",
      "Collaborated with UX designers to implement design systems that ensured consistent user experience",
      "Developed microservices architecture that improved system scalability by 60%",
      "Implemented automated testing frameworks that increased code coverage by 30%"
    ],
    'product manager': [
      "Created detailed product roadmaps that aligned with company objectives and customer needs",
      "Conducted user interviews that identified 5 key pain points in the existing product",
      "Prioritized backlog items based on business impact and development effort",
      "Led cross-functional meetings to align engineering, design, and marketing teams",
      "Analyzed user metrics to identify feature opportunities that increased retention by 25%"
    ],
    'data scientist': [
      "Built predictive models that forecasted customer churn with 85% accuracy",
      "Developed recommendation algorithms that increased average order value by 28%",
      "Created data visualization dashboards that improved decision-making for executives",
      "Performed A/B testing that optimized conversion rates by 15%",
      "Developed NLP models that automated customer support ticket classification with 90% accuracy"
    ],
    'marketing': [
      "Designed email marketing campaigns that achieved 35% open rates and 12% conversion",
      "Created content marketing strategy that increased organic traffic by 50%",
      "Managed social media campaigns that grew follower base by 10,000 in 6 months",
      "Conducted market research that identified 3 new customer segments",
      "Optimized ad spend allocation that reduced cost per acquisition by 30%"
    ],
    'project manager': [
      "Managed resource allocation that kept project 15% under budget",
      "Created project timelines and milestones that ensured on-time delivery",
      "Implemented risk management strategies that prevented potential delays",
      "Facilitated daily standups that improved team communication and productivity",
      "Maintained detailed documentation that streamlined knowledge transfer between teams"
    ]
  };

  let bestMatch = 'software engineer'; // default
  let highestMatchScore = 0;
  
  for (const key in duties) {
    if (titleLower.includes(key)) {
      const matchScore = key.length;
      if (matchScore > highestMatchScore) {
        highestMatchScore = matchScore;
        bestMatch = key;
      }
    }
  }

  const options = duties[bestMatch] || duties['software engineer'];
  return options[Math.floor(Math.random() * options.length)];
};

