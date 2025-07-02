import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import "@/types/speech";

interface VoiceRecorderProps {
  onTranscript: (text: string) => void;
  isRecording: boolean;
  onRecordingChange: (recording: boolean) => void;
  language: string;
}

export function VoiceRecorder({ 
  onTranscript, 
  isRecording, 
  onRecordingChange,
  language 
}: VoiceRecorderProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true);
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = language;
        
        recognitionRef.current.onresult = (event) => {
          let finalTranscript = '';
          let interimTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript + ' ';
            } else {
              interimTranscript += transcript;
            }
          }
          
          if (finalTranscript || interimTranscript) {
            onTranscript(finalTranscript + interimTranscript);
          }
        };
        
        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsProcessing(false);
          onRecordingChange(false);
          toast({
            title: "Recognition Error",
            description: "There was an issue with speech recognition. Please try again.",
            variant: "destructive",
          });
        };
        
        recognitionRef.current.onend = () => {
          setIsProcessing(false);
          onRecordingChange(false);
        };
      }
    } else {
      setIsSupported(false);
      toast({
        title: "Not Supported",
        description: "Speech recognition is not supported in this browser.",
        variant: "destructive",
      });
    }
  }, [language, onTranscript, onRecordingChange, toast]);

  const startRecording = () => {
    if (recognitionRef.current && !isRecording) {
      setIsProcessing(true);
      onRecordingChange(true);
      recognitionRef.current.start();
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
    }
  };

  if (!isSupported) {
    return (
      <div className="text-center p-6 text-muted-foreground">
        <p>Speech recognition is not supported in this browser.</p>
        <p className="text-sm mt-2">Please use Chrome, Safari, or Edge for voice features.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <Button
        variant={isRecording ? "record" : "default"}
        size="icon"
        onMouseDown={startRecording}
        onMouseUp={stopRecording}
        onMouseLeave={stopRecording}
        onTouchStart={startRecording}
        onTouchEnd={stopRecording}
        disabled={isProcessing && !isRecording}
        className="relative"
      >
        {isProcessing && !isRecording ? (
          <Loader2 className="h-6 w-6 animate-spin" />
        ) : isRecording ? (
          <>
            <Square className="h-6 w-6" />
            <div className="absolute inset-0 rounded-full animate-pulse bg-destructive/20" />
          </>
        ) : (
          <Mic className="h-6 w-6" />
        )}
      </Button>
      
      <div className="text-center">
        <p className="text-sm font-medium text-foreground">
          {isRecording ? "Recording..." : "Hold to record"}
        </p>
        <p className="text-xs text-muted-foreground">
          {isRecording ? "Release to stop recording" : "Press and hold the button to record"}
        </p>
      </div>
    </div>
  );
}