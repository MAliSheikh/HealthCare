import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { HelpCircle, Mic, Volume2, ArrowLeftRight, Languages } from "lucide-react";

/**
 * UserGuide Component
 * 
 * Provides an interactive help dialog that guides users through 
 * the healthcare translation application features and functionality.
 * 
 * Features:
 * - Step-by-step usage instructions
 * - Visual icons for better understanding
 * - Modal dialog for non-intrusive help
 */
export function UserGuide() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="fixed bottom-4 right-4 z-50">
          <HelpCircle className="h-4 w-4 mr-2" />
          Help
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            How to Use MedLingua Bridge
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Step 1: Language Setup */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Languages className="h-5 w-5 text-primary" />
                1. Set Up Languages
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                • Choose the <strong>Patient Language</strong> (what the patient will speak)
              </p>
              <p className="text-sm text-muted-foreground">
                • Choose the <strong>Provider Language</strong> (what the provider will hear)
              </p>
              <p className="text-sm text-muted-foreground">
                • Use the <strong>Switch Roles</strong> button to quickly swap languages when roles change
              </p>
            </CardContent>
          </Card>

          {/* Step 2: Recording */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Mic className="h-5 w-5 text-primary" />
                2. Start Recording
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                • Click the microphone button to start recording
              </p>
              <p className="text-sm text-muted-foreground">
                • Speak clearly and at a normal pace
              </p>
              <p className="text-sm text-muted-foreground">
                • The app will show live transcription as you speak
              </p>
              <p className="text-sm text-muted-foreground">
                • Click the stop button or wait for automatic stop
              </p>
            </CardContent>
          </Card>

          {/* Step 3: Translation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ArrowLeftRight className="h-5 w-5 text-primary" />
                3. View Translation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                • Translation appears automatically in the right panel
              </p>
              <p className="text-sm text-muted-foreground">
                • Original transcript shows on the left for reference
              </p>
              <p className="text-sm text-muted-foreground">
                • Both transcripts can be copied or cleared using the action buttons
              </p>
            </CardContent>
          </Card>

          {/* Step 4: Audio Playback */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Volume2 className="h-5 w-5 text-primary" />
                4. Play Audio Translation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                • Click the <strong>Speak</strong> button to hear the translation
              </p>
              <p className="text-sm text-muted-foreground">
                • Audio plays in the target language with proper pronunciation
              </p>
              <p className="text-sm text-muted-foreground">
                • Volume and playback speed are optimized for medical contexts
              </p>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-lg">💡 Pro Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                • <strong>Switch Roles:</strong> When the provider needs to respond, use the role switch button instead of manually changing languages
              </p>
              <p className="text-sm text-muted-foreground">
                • <strong>Clear Speech:</strong> Speak medical terms slowly and clearly for better accuracy
              </p>
              <p className="text-sm text-muted-foreground">
                • <strong>Privacy:</strong> All processing happens locally in your browser - no data is sent to external servers
              </p>
              <p className="text-sm text-muted-foreground">
                • <strong>Mobile Ready:</strong> Works on tablets and phones for bedside consultations
              </p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}