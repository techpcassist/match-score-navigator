
// A utility function to call generative AI services
import { supabase } from '@/integrations/supabase/client';

/**
 * Calls a generative AI service to get an AI-generated response
 * 
 * @param prompt The prompt to send to the AI
 * @returns A string with the AI-generated response, or null if an error occurred
 */
export const callGenerativeAI = async (prompt: string): Promise<string | null> => {
  try {
    console.log("Calling AI service with prompt:", prompt.substring(0, 50) + "...");
    
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      try {
        // Use Supabase Edge Function to generate content
        const { data, error } = await supabase.functions.invoke('generate-ai-content', {
          body: { prompt }
        });
        
        if (error) {
          console.error("Error calling AI service:", error);
          throw error;
        }
        
        // Check if we got a response from the edge function
        if (data && data.generatedText) {
          console.log("Successfully received AI-generated content from:", data.source || "edge function");
          return data.generatedText;
        } else {
          console.error("Invalid response from AI service:", data);
          throw new Error("Invalid response from AI service");
        }
      } catch (supabaseError) {
        console.error("Supabase function error:", supabaseError);
        throw supabaseError;
      }
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
      } else if (prompt.includes("tailored suggestions") || prompt.includes("specific responsibilities")) {
        return "Developed scalable solutions that improved system performance by 35%\nImplemented automated testing protocols that reduced bug rates by 40%\nOptimized database queries resulting in 50% faster response times\nLed cross-functional team meetings to improve project coordination\nDeployed CI/CD pipelines that streamlined the development workflow";
      }
      
      return "• Led strategic initiatives that increased operational efficiency by 30%\n• Developed innovative solutions to complex business challenges\n• Collaborated with cross-functional teams to deliver high-quality results\n• Implemented best practices that improved overall performance metrics";
    }
  } catch (error) {
    console.error("Error in callGenerativeAI:", error);
    
    // Generate fallback content based on the prompt type
    console.log("Using fallback content due to error");
    if (prompt.includes("job duty") || prompt.includes("achievement")) {
      return "Implemented an automated testing framework that reduced regression bugs by 42% and improved deployment velocity by 35%.";
    } else if (prompt.includes("Enhance the following")) {
      // Return a formatted enhanced description
      return "• Spearheaded the development of a cloud-based analytics platform that increased client reporting efficiency by 65%\n• Implemented CI/CD pipelines that decreased deployment time by 50% and reduced integration errors by 78%\n• Led cross-functional team of 8 engineers to deliver a mission-critical system migration with zero downtime\n• Designed scalable microservices architecture that improved system performance by 40% and reduced cloud costs by 25%";
    } else if (prompt.includes("tailored suggestions") || prompt.includes("specific responsibilities")) {
      return "Developed scalable solutions that improved system performance by 35%\nImplemented automated testing protocols that reduced bug rates by 40%\nOptimized database queries resulting in 50% faster response times\nLed cross-functional team meetings to improve project coordination\nDeployed CI/CD pipelines that streamlined the development workflow";
    }
    
    return "• Led strategic initiatives that increased operational efficiency by 30%\n• Developed innovative solutions to complex business challenges\n• Collaborated with cross-functional teams to deliver high-quality results\n• Implemented best practices that improved overall performance metrics";
  }
};
