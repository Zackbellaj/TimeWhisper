# TimeWhisper

TimeWhisper est une application web interactive qui permettra aux utilisateurs de poser des questions orales sur des événements historiques et d’obtenir des réponses **vocales et visuelles**.

---

## Objectif

- Fournir des résumés historiques fiables  
- Relier documents d’archives  
- Afficher les événements sur une **timeline interactive**  

---

## Public cible

- Étudiants

---

## Technologies prévues

- **Front-end :** HTML5, CSS3, JavaScript, TypeScript, React, Bootstrap / TailwindCSS  
- **Back-end :** PHP / Laravel  
- **Base de données :** MongoDB  
- **API :** REST API  
- **Données et multimédia :** JSON / XML, D3.js (visualisation de données), WebRTC (communication temps réel)  
- **Outils :** Git / GitHub / GitLab  
- **IA / NLP :** Whisper API (transcription vocale), Llama (génération contextuelle), No-code / Low-code

---

## Fonctionnalités prévues

- Moteur de recherche  
- Carte interactive  
- Système de filtres et tris  
- Chatbot ou assistant virtuel  
- Timeline dynamique  
- Galerie multimédia  

---
## Diagramme Entité-Relation

```mermaid
erDiagram
    USER {
        int id PK
        string name
        string email
        string role
    }

    QUESTION {
        int id PK
        int user_id FK
        string content
        datetime created_at
    }

    ANSWER {
        int id PK
        int question_id FK
        string content
        string audio_url
        datetime created_at
    }

    EVENT {
        int id PK
        string title
        date start_date
        date end_date
        string location
        string description
    }

    MEDIA {
        int id PK
        int event_id FK
        string type
        string url
    }

    USER ||--o{ QUESTION : "pose"
    QUESTION ||--o{ ANSWER : "reçoit"
    ANSWER ||--|{ EVENT : "fait référence à"
    EVENT ||--o{ MEDIA : "contient"
```
## Lien du projet

[GitHub Repository](https://github.com/Zackbellaj/TimeWhisper)
