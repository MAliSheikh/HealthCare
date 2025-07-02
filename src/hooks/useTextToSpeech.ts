import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

/**
 * Custom hook for text-to-speech functionality
 * 
 * Uses the Web Speech API's SpeechSynthesis to convert text to speech.
 * Optimized for medical translations with appropriate speed and clarity.
 * 
 * @returns {Object} Speech functions and state
 * @returns {Function} speak - Converts text to speech in specified language
 * @returns {Function} stopSpeaking - Stops current speech synthesis
 * @returns {boolean} isSpeaking - Current speech state
 */
export function useTextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { toast } = useToast();

  const speak = useCallback((text: string, language: string) => {
    if (!text.trim()) return;

    if ('speechSynthesis' in window) {
      // Stop any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (event) => {
        setIsSpeaking(false);
        // Only show error if not canceled/interrupted
        if (
          event.error !== 'canceled' &&
          event.error !== 'interrupted'
        ) {
          toast({
            title: "Speech Error",
            description: "Unable to play audio. Please try again.",
            variant: "destructive",
          });
        }
      };

      window.speechSynthesis.speak(utterance);
    } else {
      toast({
        title: "Not Supported",
        description: "Text-to-speech is not supported in this browser.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return { speak, stopSpeaking, isSpeaking };
}