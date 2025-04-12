
// A utility function to call generative AI services

/**
 * Calls a generative AI service to get an AI-generated response
 * 
 * @param prompt The prompt to send to the AI
 * @returns A string with the AI-generated response, or null if an error occurred
 */
export const callGenerativeAI = async (prompt: string): Promise<string | null> => {
  try {
    // Check if we have access to Supabase functions
    if (typeof window !== 'undefined' && window.supabaseClient) {
      // Use Supabase Edge Function to generate content
      const { data, error } = await window.supabaseClient.functions.invoke('generate-ai-content', {
        body: { prompt }
      });
      
      if (error) {
        console.error("Error calling AI service:", error);
        return null;
      }
      
      return data.generatedText;
    } else {
      // Fallback to local mock for development
      console.log("Using mock AI service (no Supabase connection available)");
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate a mock response based on the prompt
      if (prompt.includes("job duty") || prompt.includes("achievement")) {
        return "Implemented an automated testing framework that reduced regression bugs by 42% and improved deployment velocity by 35%.";
      } else if (prompt.includes("Enhance the following")) {
        // Return a formatted enhanced description
        return "• Spearheaded the development of a cloud-based analytics platform that increased client reporting efficiency by 65%\n• Implemented CI/CD pipelines that decreased deployment time by 50% and reduced integration errors by 78%\n• Led cross-functional team of 8 engineers to deliver a mission-critical system migration with zero downtime\n• Designed scalable microservices architecture that improved system performance by 40% and reduced cloud costs by 25%";
      }
      
      return "Sorry, I couldn't generate content for this prompt.";
    }
  } catch (error) {
    console.error("Error in callGenerativeAI:", error);
    return null;
  }
};
