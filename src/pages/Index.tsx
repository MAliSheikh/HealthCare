import { useState, useEffect, useRef } from "react";
import { LanguageSelector } from "@/components/LanguageSelector";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { TranscriptDisplay } from "@/components/TranscriptDisplay";
import { UserGuide } from "@/components/UserGuide";
import { useTranslation } from "@/hooks/useTranslation";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Stethoscope, Languages, Shield, User, UserCheck, HelpCircle, Volume2 } from "lucide-react";

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
  // Active tab state - "patient" or "provider"
  const [activeTab, setActiveTab] = useState("patient");
  
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
  const hasSpokenOnce = useRef<boolean>(false);

  // Auto-translate when original text changes
  useEffect(() => {
    if (originalText.trim()) {
      translateText(originalText, sourceLanguage, targetLanguage)
        .then((translation) => {
          setTranslatedText(translation);
          hasSpokenOnce.current = false; // Reset speak flag for new translation
        })
        .catch(console.error);
    } else {
      setTranslatedText("");
      hasSpokenOnce.current = false;
    }
  }, [originalText, sourceLanguage, targetLanguage, translateText]);

  /**
   * Switches roles between patient and provider by changing active tab
   * This allows seamless conversation flow
   */
  const switchToTab = (tab) => {
    setActiveTab(tab);
    if (tab === "patient") {
      // Patient tab: patient speaks (source), provider receives translation (target)
      // Keep current language settings
    } else {
      // Provider tab: provider speaks (source), patient receives translation (target)
      // Swap languages
      const tempLang = sourceLanguage;
      setSourceLanguage(targetLanguage);
      setTargetLanguage(tempLang);
    }
    // Clear transcripts when switching roles to avoid confusion
    setOriginalText("");
    setTranslatedText("");
    hasSpokenOnce.current = false;
  };

  /** Plays audio of the translated text - only once per translation */
  const handleSpeak = () => {
    if (!isSpeaking && translatedText.trim() && !hasSpokenOnce.current) {
      speak(translatedText, targetLanguage);
      hasSpokenOnce.current = true;
    }
  };

  /** Clears both original and translated text */
  const clearTranscripts = () => {
    setOriginalText("");
    setTranslatedText("");
    hasSpokenOnce.current = false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-xl border-b border-blue-200/50 shadow-lg shadow-blue-500/10">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-xl"></div>
              <div className="relative p-4 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-xl">
                <Stethoscope className="h-10 w-10 text-white" />
              </div>
            </div>
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                MedLingua Bridge
              </h1>
              <p className="text-lg text-blue-600/80 font-medium mt-1">
                Healthcare Translation with AI
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10 space-y-10">
        {/* Tab Navigation */}
        <div className="flex justify-center">
          <div className="bg-white/80 backdrop-blur-xl p-2 rounded-2xl shadow-2xl shadow-blue-500/20 border border-blue-200/50">
            <div className="flex space-x-2">
              <button
                onClick={() => switchToTab("patient")}
                className={`flex items-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform ${
                  activeTab === "patient"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-105"
                    : "text-blue-600 hover:bg-blue-50 hover:scale-105"
                }`}
              >
                <User className="h-5 w-5" />
                Patient
              </button>
              <button
                onClick={() => switchToTab("provider")}
                className={`flex items-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform ${
                  activeTab === "provider"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-105"
                    : "text-blue-600 hover:bg-blue-50 hover:scale-105"
                }`}
              >
                <UserCheck className="h-5 w-5" />
                Provider
              </button>
            </div>
          </div>
        </div>

        {/* Language Selection */}
        <Card className="mx-10 bg-white/80 backdrop-blur-xl shadow-2xl shadow-blue-500/10 border-blue-200/50 rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border-b border-blue-200/30">
            <CardTitle className="flex items-center gap-3 text-blue-900">
              <div className="p-2 bg-blue-600/10 rounded-xl">
                <Languages className="h-6 w-6 text-blue-600" />
              </div>
              Language Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <LanguageSelector
                  label={activeTab === "patient" ? "Patient Language (Input)" : "Provider Language (Input)"}
                  value={sourceLanguage}
                  onValueChange={setSourceLanguage}
                />
              </div>
              <div className="space-y-4">
                <LanguageSelector
                  label={activeTab === "patient" ? "Provider Language (Output)" : "Patient Language (Output)"}
                  value={targetLanguage}
                  onValueChange={setTargetLanguage}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Voice Recording */}
        <Card className="mx-10 bg-white/80 backdrop-blur-xl shadow-2xl shadow-blue-500/10 border-blue-200/50 rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border-b border-blue-200/30">
            <CardTitle className="text-center text-blue-900 text-2xl">
              Voice Recording - {activeTab === "patient" ? "Patient" : "Provider"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <VoiceRecorder
              onTranscript={setOriginalText}
              isRecording={isRecording}
              onRecordingChange={setIsRecording}
              language={sourceLanguage}
            />
          </CardContent>
        </Card>

        {/* Transcripts */}
        <div className="mx-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Original Transcript */}
          <Card className="bg-white/80 backdrop-blur-xl shadow-2xl shadow-blue-500/10 border-blue-200/50 rounded-3xl overflow-hidden transform hover:scale-105 transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border-b border-blue-200/30">
              <CardTitle className="text-blue-900">Original Transcript</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <TranscriptDisplay
                title="Original Transcript"
                text={originalText}
                language={sourceLanguage}
                onClear={() => setOriginalText("")}
              />
            </CardContent>
          </Card>

          {/* Translation */}
          <Card className="bg-white/80 backdrop-blur-xl shadow-2xl shadow-indigo-500/10 border-indigo-200/50 rounded-3xl overflow-hidden transform hover:scale-105 transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-indigo-600/10 to-cyan-600/10 border-b border-indigo-200/30">
              <CardTitle className="flex items-center justify-between text-indigo-900">
                Translation
                {translatedText && (
                  <Button
                    onClick={handleSpeak}
                    disabled={isSpeaking || hasSpokenOnce.current}
                    className="bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white shadow-lg shadow-indigo-500/30 rounded-xl px-4 py-2 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:scale-100"
                  >
                    <Volume2 className="h-4 w-4 mr-2" />
                    {isSpeaking ? "Speaking..." : hasSpokenOnce.current ? "Spoken" : "Speak"}
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <TranscriptDisplay
                title="Translation"
                text={isTranslating ? "Translating..." : translatedText}
                language={targetLanguage}
                onClear={() => setTranslatedText("")}
              />
            </CardContent>
          </Card>
        </div>

        {/* Clear All Button */}
        {(originalText || translatedText) && (
          <div className="flex justify-center">
            <Button
              onClick={clearTranscripts}
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg shadow-red-500/30 rounded-2xl px-8 py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Clear All Transcripts
            </Button>
          </div>
        )}

        {/* Privacy Notice */}
        <Card className="mx-10 bg-gradient-to-r from-emerald-50/80 to-teal-50/80 backdrop-blur-xl border-emerald-200/50 border-2 border-dashed rounded-3xl shadow-xl shadow-emerald-500/10">
          <CardContent className="p-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-600/10 rounded-2xl">
                <Shield className="h-8 w-8 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-emerald-900 mb-3">Privacy & Security</h3>
                <p className="text-lg text-emerald-800/80 leading-relaxed">
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
      <div className="fixed bottom-8 right-8">
        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-2xl shadow-blue-500/30 rounded-full p-4 transition-all duration-300 transform hover:scale-110">
          <HelpCircle className="h-8 w-8" />
        </Button>
      </div>
      
      <UserGuide />
    </div>
  );
};

export default Index;