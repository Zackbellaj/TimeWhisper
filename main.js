import { omk } from './omk.js'; 

const OMEKA_PARAMS = {
    api: "http://localhost/omk_THyp_25-26_clone/api/", // 
    key: "f0ZFyyK7WhqDr4gZKoMbFiu6IS35lQtj",
    ident: "f0ZFyyK7WhqDr4gZKoMbFiu6IS35lQtj",          
    mail: "bmamak11@gmail.com",
    vocabs: ['dcterms', 'tw', 'o'],
};
const OMK_RT_QUERY_LABEL = "Question utilisateur"; 
const TW_USER_QUERY_CLASS = 'tw:UserQuery';
const TW_USER_AUDIO_FILE_PROP = 'tw:userAudioFile'; 

// =========================================================
// Classe TimeWhisper : Logique principale
// =========================================================

class TimeWhisper {
    constructor(omkParams) {
        // Initialisation de omk
        this.omk = new omk(omkParams); 
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.audioBlob = null;
        this.audioStream = null;

        // Éléments de l'interface
        this.recordBtn = document.querySelector('#recordBtn');
        this.stopBtn = document.querySelector('#stopBtn');
        this.submitBtn = document.querySelector('#submitBtn');
        this.soundClips = document.querySelector('.sound-clips');
        this.statusDisplay = document.querySelector('#status');

        this.stopBtn.disabled = true; 
        this.submitBtn.disabled = true;
        
        // Configuration des événements
        this.recordBtn.onclick = () => this.startRecording();
        this.stopBtn.onclick = () => this.stopRecording();
        this.submitBtn.onclick = () => this.submitQueryToOmeka();
        
        this.updateStatus("Prêt. Vous pouvez enregistrer.");
    }

    updateStatus(message, isError = false) {
        this.statusDisplay.textContent = message;
        this.statusDisplay.style.color = isError ? 'red' : 'white';
        this.statusDisplay.style.backgroundColor = isError ? '#333' : '#495057';
    }

    // --- LOGIQUE D'ENREGISTREMENT ---
    
    async startRecording() {
        try {
            this.audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.audioChunks = [];
            
            this.mediaRecorder = new MediaRecorder(this.audioStream, { mimeType: 'audio/webm' }); 

            this.mediaRecorder.ondataavailable = event => this.audioChunks.push(event.data);
            this.mediaRecorder.onstop = () => this.handleRecordingStop();

            this.mediaRecorder.start();
            
            this.recordBtn.disabled = true;
            this.stopBtn.disabled = false;
            this.submitBtn.disabled = true;
            this.updateStatus("🔴 Enregistrement en cours...");

        } catch (err) {
            this.updateStatus(`Erreur micro: ${err.name}. Vérifiez l'accès.`, true);
        }
    }

    stopRecording() {
        if (!this.mediaRecorder || this.mediaRecorder.state !== 'recording') return;
        this.mediaRecorder.stop();
        this.audioStream.getTracks().forEach(track => track.stop()); 
    }

    handleRecordingStop() {
        this.audioBlob = new Blob(this.audioChunks, { type: this.mediaRecorder.mimeType });
        const audioUrl = URL.createObjectURL(this.audioBlob); 
        
        this.addClipToDOM(audioUrl); 

        this.recordBtn.disabled = false;
        this.stopBtn.disabled = true;
        this.submitBtn.disabled = false;
        this.updateStatus("Enregistrement terminé. Prêt à être lu et soumis.");
    }

    // --- LECTURE et Affichage Local ---

    addClipToDOM(audioUrl) {
        const clipContainer = document.createElement('article');
        const clipLabel = document.createElement('p');
        const audio = document.createElement('audio');
        
        clipContainer.className = 'clip';
        audio.setAttribute('controls', '');
        audio.src = audioUrl;

        clipLabel.textContent = `Clip enregistré à ${new Date().toLocaleTimeString()}`;

        clipContainer.appendChild(audio);
        clipContainer.appendChild(clipLabel);
        this.soundClips.prepend(clipContainer); 
    }
    
    // --- SOUMISSION À OMEKA S ---

    submitQueryToOmeka() {
        if (!this.audioBlob) {
            this.updateStatus("Aucun enregistrement à soumettre.", true);
            return;
        }
        
        this.submitBtn.disabled = true;
        const audioUrl = URL.createObjectURL(this.audioBlob); 
        const timestamp = new Date().toISOString();
        const queryLabel = `Requête vocale du ${timestamp.substring(0, 19)}`;

        this.updateStatus("Soumission à Omeka S en cours...");

        const itemData = {
            'o:resource_template': OMK_RT_QUERY_LABEL, 
            'o:resource_class': TW_USER_QUERY_CLASS,
            
            'dcterms:title': queryLabel, 
            
            // Stockage de l'URL temporaire dans la propriété personnalisée
            [TW_USER_AUDIO_FILE_PROP]: audioUrl 
        };

        this.omk.createItem(
            itemData, 
            (response) => {
                this.updateStatus(`✅ Enregistré dans Omeka S! ID: ${response['o:id']}.`, false);
            },
            false 
        );
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TimeWhisper(OMEKA_PARAMS);
});