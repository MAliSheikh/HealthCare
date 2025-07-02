import { useState, useCallback, useEffect } from "react";
import { useToast } from "./use-toast";
import Groq from "groq-sdk";

/**
 * Custom hook for text translation functionality
 * 
 * Provides translation capabilities with loading states and error handling.
 * Currently uses Groq API for medical-context aware translations.
 * 
 * @returns {Object} Translation functions and state
 * @returns {Function} translateText - Translates text between languages
 * @returns {boolean} isTranslating - Loading state for translation
 */
export function useTranslation() {
  const [isTranslating, setIsTranslating] = useState(false);
  const { toast } = useToast();
  const [translationService, setTranslationService] = useState<Groq | null>(null);

  useEffect(() => {
    // Initialize Groq client
    const groq = new Groq({
      apiKey: process.env.VITE_GROQ_API_KEY,
      dangerouslyAllowBrowser: true
    });
    setTranslationService(groq);
  }, []);

  const translateText = useCallback(async (
    text: string,
    fromLang: string,
    toLang: string
  ): Promise<string> => {
    if (!text.trim()) return "";
    if (!translationService) {
      toast({
        title: "Translation Error",
        description: "Translation service not initialized",
        variant: "destructive",
      });
      return text;
    }

    setIsTranslating(true);

    try {
      const systemPrompt = `You are a professional medical translator. Your task is to translate medical conversations between patients and healthcare providers with the highest accuracy and cultural sensitivity.

CRITICAL INSTRUCTIONS:
- Provide ONLY the translated text in your response
- Do not include explanations, notes, quotation marks, or additional text
- Maintain medical accuracy and use appropriate medical terminology
- Preserve the original meaning, tone, and urgency
- Use formal, respectful language appropriate for healthcare settings
- If unsure about medical terms, use the most commonly accepted equivalent
- Maintain patient confidentiality and professional language`;

      const userPrompt = `Translate the following ${fromLang} text to ${toLang} dont add extra knowledge or details, just simple translated text:

${text}`;

      const completion = await translationService.chat.completions.create({
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
        model: "llama-3.3-70b-versatile",
        // temperature: 0.1,
        // max_tokens: 1000,
        // top_p: 0.9,
      });

      const translatedText = completion.choices[0]?.message?.content?.trim();
      console.log(translatedText)

      if (!translatedText) {
        throw new Error('No translation received');
      }

      return translatedText;

    } catch (error) {
      console.error('Translation error:', error);
      let errorMessage = "Unable to translate text. Please try again.";

      if (error instanceof Error) {
        if (error.message.includes('401')) {
          errorMessage = "Authentication failed. Please check API configuration.";
        } else if (error.message.includes('429')) {
          errorMessage = "Too many requests. Please try again later.";
        }
      }

      toast({
        title: "Translation Error",
        description: errorMessage,
        variant: "destructive",
      });
      return text; // Return original text if translation fails
    } finally {
      setIsTranslating(false);
    }
  }, [toast, translationService]);

  return { translateText, isTranslating };
}