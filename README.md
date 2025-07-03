# MedLingua Bridge: Healthcare Translation Web App

## Overview
MedLingua Bridge is a web-based prototype that enables real-time, multilingual translation between patients and healthcare providers. It leverages generative AI for accurate medical translation, voice-to-text, and text-to-speech, all within a mobile-first, privacy-focused interface.

---

## Code Structure

- **src/pages/Index.tsx**: Main app UI, role switching, transcript display, and all core logic.
- **src/components/VoiceRecorder.tsx**: Handles voice input and speech-to-text using the Web Speech API.
- **src/hooks/useTranslation.tsx**: Integrates Groq (LLM) for medical-context translation.
- **src/hooks/useTextToSpeech.ts**: Uses Web Speech API for audio playback of translated text.
- **src/components/TranscriptDisplay.tsx**: Displays original and translated transcripts.
- **src/components/LanguageSelector.tsx**: Language selection UI.
- **src/components/UserGuide.tsx**: In-app user guide.
- **src/components/ui/**: Reusable UI components (Card, Button, etc.).

---

## AI Tools Used

- **Groq LLM API**: For context-aware, accurate medical translation. Prompting ensures use of correct terminology and privacy.
- **Web Speech **: For both speech recognition (voice-to-text) and speech synthesis (text-to-speech playback).

---

## Security & Data Privacy Considerations

- **No Data Storage**: All processing is done in-browser. No audio or transcript data is stored or sent to external servers (except for translation API calls).
- **API Key Handling**: API keys are referenced via environment variables in the frontend (prototype only). For production, a backend proxy is recommended but not implemented in this prototype.
- **Privacy Notice**: The UI clearly states that no data is stored and all processing is real-time.
- **Error Handling**: Sensitive errors are not exposed to the user; only generic messages are shown.

---

## User Guide

1. **Select Role**: Choose "Patient" or "Provider" to set the direction of translation.
2. **Choose Languages**: Set input (spoken) and output (translated) languages.
3. **Record Speech**: Hold the microphone button to record your message. Release to stop.
4. **View Transcripts**: See both the original and translated text in real-time.
5. **Audio Playback**: Press the "Speak" button to hear the translated text.
6. **Switch Roles**: Use the tab navigation to switch between patient and provider perspectives.
7. **Clear Transcripts**: Use the "Clear All" button to reset the conversation.
8. **Privacy & Security**: Review the privacy notice at the bottom of the app for details on data handling.

---

## Generative AI Approach

- **Translation**: Uses Groq LLM with a strict system prompt to ensure medical accuracy, confidentiality, and appropriate tone. The prompt instructs the AI to return only the translated text, with no extra commentary.
- **Speech Recognition**: Web Speech API is used for real-time, in-browser voice-to-text, supporting multiple languages.
- **Text-to-Speech**: Web Speech API is used for audio playback, making the app accessible for users with different needs.
- **Rapid Prototyping**: Generative AI was used to accelerate both code generation and translation logic, enabling completion within 48 hours.

---

## Data Privacy and Security (Summary)
- No patient data is stored or logged.
- All processing is local except for translation API calls.
- API keys are not hardcoded in production; use a backend proxy for deployment.
- The app is fully responsive and mobile-friendly, with clear privacy messaging.

---

## Technologies Used
- React + Vite + TypeScript
- Tailwind CSS + shadcn-ui
- Groq LLM API
- Web Speech API

---

## Deployment
- Deployable to Vercel, Netlify, or similar platforms.
- Ensure environment variables are set securely and use HTTPS.

---

## Contact & Support
For questions or support, contact the developer or refer to the in-app user guide.
