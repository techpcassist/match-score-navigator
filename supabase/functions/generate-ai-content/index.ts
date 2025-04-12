
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Fallback content generator when API calls fail
const generateFallbackContent = (prompt: string): string => {
  console.log("Using fallback content generator");
  
  // Check prompt type and return appropriate fallback content
  if (prompt.includes("job duty") || prompt.includes("achievement")) {
    return "Implemented an automated testing framework that reduced regression bugs by 42% and improved deployment velocity by 35%.";
  } else if (prompt.includes("Enhance the following")) {
    return "• Spearheaded the development of a cloud-based analytics platform that increased client reporting efficiency by 65%\n• Implemented CI/CD pipelines that decreased deployment time by 50% and reduced integration errors by 78%\n• Led cross-functional team of 8 engineers to deliver a mission-critical system migration with zero downtime\n• Designed scalable microservices architecture that improved system performance by 40% and reduced cloud costs by 25%";
  } else if (prompt.includes("tailored suggestions") || prompt.includes("specific responsibilities")) {
    return "Developed scalable solutions that improved system performance by 35%\nImplemented automated testing protocols that reduced bug rates by 40%\nOptimized database queries resulting in 50% faster response times\nLed cross-functional team meetings to improve project coordination\nDeployed CI/CD pipelines that streamlined the development workflow";
  }
  
  // Generic fallback
  return "• Led strategic initiatives that increased operational efficiency by 30%\n• Developed innovative solutions to complex business challenges\n• Collaborated with cross-functional teams to deliver high-quality results\n• Implemented best practices that improved overall performance metrics";
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Extract the prompt from the request body
    const { prompt } = await req.json();
    
    if (!prompt || typeof prompt !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid prompt. Please provide a valid text prompt.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get API key from environment variables
    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) {
      console.log("Missing OpenAI API key, using fallback content");
      const fallbackText = generateFallbackContent(prompt);
      return new Response(
        JSON.stringify({ generatedText: fallbackText, source: 'fallback' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    try {
      // Call OpenAI API to generate content
      const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { 
              role: 'system', 
              content: 'You are a professional resume writing assistant that helps job seekers create impressive resume content. Provide concise, impactful responses that highlight achievements with metrics when possible.' 
            },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 250,
        }),
      });

      if (!openAIResponse.ok) {
        throw new Error(`OpenAI API responded with status: ${openAIResponse.status}`);
      }
      
      const data = await openAIResponse.json();
      
      if (!data.choices || !data.choices[0]) {
        throw new Error('Invalid response from OpenAI');
      }
      
      const generatedText = data.choices[0].message.content.trim();

      return new Response(
        JSON.stringify({ generatedText, source: 'openai' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (openAIError) {
      console.error('OpenAI API error:', openAIError);
      
      // Use fallback content generation
      const fallbackText = generateFallbackContent(prompt);
      return new Response(
        JSON.stringify({ generatedText: fallbackText, source: 'fallback' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error in generate-ai-content function:', error);
    
    let errorMessage = 'An unknown error occurred';
    let fallbackText = '';
    
    try {
      // Try to extract prompt from request and generate fallback content
      const { prompt } = await req.json();
      if (prompt && typeof prompt === 'string') {
        fallbackText = generateFallbackContent(prompt);
      }
    } catch (_) {
      // Ignore errors in fallback content generation
    }
    
    if (fallbackText) {
      return new Response(
        JSON.stringify({ generatedText: fallbackText, source: 'fallback' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ error: error.message || errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
