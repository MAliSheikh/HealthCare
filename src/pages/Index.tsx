import { useState, useEffect, useRef } from "react";
import { LanguageSelector } from "@/components/LanguageSelector";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { TranscriptDisplay } from "@/components/TranscriptDisplay";
import { UserGuide } from "@/components/UserGuide";
import { useTranslation } from "@/hooks/useTranslation";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Stethoscope, Languages, Shield, ArrowLeftRight, HelpCircle } from "lucide-react";

/**
 * Main Healthcare Translation Application
 * 
 * Features:
 * - Bidirectional voice translation between patient and provider
 * - Real-time transcription and translation
 * - Audio playback of translations
 * - Role switching for seamless conversation flow
 * - Mobile-first responsive design
 * - Privacy-focused local processing
 */
const Index = () => {
  // Language settings - source is what's being spoken, target is translation output
  const [sourceLanguage, setSourceLanguage] = useState("en"); // Patient's language
  const [targetLanguage, setTargetLanguage] = useState("es"); // Provider's language
  
  // Transcript states - original input and translated output
  const [originalText, setOriginalText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  
  // Recording state management
  const [isRecording, setIsRecording] = useState(false);
  
  // Custom hooks for translation and text-to-speech functionality
  const { translateText, isTranslating } = useTranslation();
  const { speak, isSpeaking } = useTextToSpeech();
  const speakTimeout = useRef<NodeJS.Timeout | null>(null);
  const lastSpokenTranslation = useRef<string>("");

  // Auto-translate when original text changes
  useEffect(() => {
    if (originalText.trim()) {
      translateText(originalText, sourceLanguage, targetLanguage)
        .then((translation) => {
          setTranslatedText(translation);
          // Only speak if translation is new and not already spoken
          if (
            translation.trim() &&
            !isSpeaking &&
            translation !== lastSpokenTranslation.current
          ) {
            if (speakTimeout.current) clearTimeout(speakTimeout.current);
            speakTimeout.current = setTimeout(() => {
              speak(translation, targetLanguage);
              lastSpokenTranslation.current = translation;
            }, 400); // 400ms debounce
          }
        })
        .catch(console.error);
    } else {
      setTranslatedText("");
    }
  }, [originalText, sourceLanguage, targetLanguage, translateText, speak, isSpeaking]);

  /**
   * Switches roles between patient and provider by swapping languages
   * This allows seamless conversation flow without manual language changes
   */
  const switchRoles = () => {
    const tempLang = sourceLanguage;
    setSourceLanguage(targetLanguage);
    setTargetLanguage(tempLang);
    // Clear transcripts when switching roles to avoid confusion
    setOriginalText("");
    setTranslatedText("");
  };

  /** Plays audio of the translated text */
  const handleSpeak = () => {
    // Only speak if not already speaking and translation is new
    if (
      !isSpeaking &&
      translatedText.trim() &&
      translatedText !== lastSpokenTranslation.current
    ) {
      speak(translatedText, targetLanguage);
      lastSpokenTranslation.current = translatedText;
    }
  };

  /** Clears both original and translated text */
  const clearTranscripts = () => {
    setOriginalText("");
    setTranslatedText("");
    lastSpokenTranslation.current = "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Stethoscope className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                MedLingua Bridge
              </h1>
              <p className="text-sm text-muted-foreground">
                Healthcare Translation with AI
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Language Selection */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Languages className="h-5 w-5 text-primary" />
              Language Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <LanguageSelector
                label="Patient Language (Input)"
                value={sourceLanguage}
                onValueChange={setSourceLanguage}
              />
              <LanguageSelector
                label="Provider Language (Output)"
                value={targetLanguage}
                onValueChange={setTargetLanguage}
              />
            </div>
            {/* Role Switch Button - Swaps languages for bidirectional conversation */}
            <div className="flex justify-center mt-6">
              <Button
                variant="outline"
                onClick={switchRoles}
                className="flex items-center gap-2"
              >
                <ArrowLeftRight className="h-4 w-4" />
                Switch Roles
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Voice Recording */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-center">Voice Recording</CardTitle>
          </CardHeader>
          <CardContent>
            <VoiceRecorder
              onTranscript={setOriginalText}
              isRecording={isRecording}
              onRecordingChange={setIsRecording}
              language={sourceLanguage}
            />
          </CardContent>
        </Card>

        {/* Transcripts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TranscriptDisplay
            title="Original Transcript"
            text={originalText}
            language={sourceLanguage}
            onClear={() => setOriginalText("")}
          />
          <TranscriptDisplay
            title="Translation"
            text={isTranslating ? "Translating..." : translatedText}
            language={targetLanguage}
            onSpeak={handleSpeak}
            canSpeak={true}
            isSpeaking={isSpeaking}
            onClear={() => setTranslatedText("")}
          />
        </div>

        {/* Privacy Notice */}
        <Card className="bg-muted/50 border-dashed">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Privacy & Security</h3>
                <p className="text-sm text-muted-foreground">
                  This application processes speech locally in your browser. No audio data is stored 
                  on external servers. All translations are processed securely and in compliance 
                  with healthcare privacy standards.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      
      {/* User Guide - Floating help button */}
      <UserGuide />
    </div>
  );
};

export default Index;
