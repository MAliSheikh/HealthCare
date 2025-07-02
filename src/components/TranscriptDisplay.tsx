import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Volume2, Copy, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TranscriptDisplayProps {
  title: string;
  text: string;
  language: string;
  onSpeak?: () => void;
  canSpeak?: boolean;
  onClear: () => void;
  isSpeaking?: boolean;
}

export function TranscriptDisplay({ 
  title, 
  text, 
  language, 
  onSpeak, 
  canSpeak = false,
  onClear,
  isSpeaking = false
}: TranscriptDisplayProps) {
  const { toast } = useToast();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied",
        description: "Text copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy text",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="h-full shadow-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">
            {title}
          </CardTitle>
          <div className="flex gap-2">
            {text && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  className="h-8 w-8 p-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClear}
                  className="h-8 w-8 p-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
            {canSpeak && text && onSpeak && (
              <Button
                variant="speak"
                size="sm"
                onClick={onSpeak}
                className="h-8 px-3"
                disabled={isSpeaking}
              >
                <Volume2 className="h-4 w-4 mr-1" />
                Speak
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="min-h-[120px] max-h-[300px] overflow-y-auto">
          {text ? (
            <p className="text-foreground leading-relaxed whitespace-pre-wrap">
              {text}
            </p>
          ) : (
            <p className="text-muted-foreground italic">
              {title.includes("Original") 
                ? "Start recording to see your speech transcribed here..."
                : "Translation will appear here once you start speaking..."
              }
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}