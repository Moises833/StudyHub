export const speak = (text) => {
    // Check if voice is enabled in localStorage
    const isEnabled = localStorage.getItem("studyhub_voice_enabled") === "true";
    if (!isEnabled) return;

    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // Cancel previous speech
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES'; // Set language to Spanish

        // Try to select a better voice
        const voices = window.speechSynthesis.getVoices();
        // Priority: Google, Microsoft, then any Spanish voice
        const preferredVoice = voices.find(v => v.lang.includes('es') && (v.name.includes('Google') || v.name.includes('Microsoft'))) ||
            voices.find(v => v.lang.includes('es'));

        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        window.speechSynthesis.speak(utterance);
    }
};

export const cancelSpeech = () => {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }
};
