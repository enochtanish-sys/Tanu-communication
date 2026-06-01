# SilentSpeak — Voice to Voiceless Communication (Django)

A web application that helps speech-impaired (dumb/mute) individuals communicate by converting typed text to spoken audio using browser Text-to-Speech.

## Features
- **Login & Register** pages with role selection (Speech-Impaired User / Helper)
- **Communication Board** — type any message and speak it instantly
- **Quick Phrases** library for common expressions
- **Voice Settings** — choose voice, speed & pitch
- **Ctrl+Enter** shortcut to speak
- **Message History** — all spoken messages saved and replayable
- Django authentication with session management

## Setup & Run

### 1. Install dependencies
```bash
cd silentspeak
pip install -r requirements.txt
```

### 2. Apply migrations
```bash
python manage.py makemigrations communicate
python manage.py migrate
```

### 3. Create a superuser (optional, for admin)
```bash
python manage.py createsuperuser
```

### 4. Run the development server
```bash
python manage.py runserver
```

### 5. Open in browser
Visit: http://127.0.0.1:8000/

## Project Structure
```
silentspeak/
├── manage.py
├── requirements.txt
├── silentspeak/          # Django project config
│   ├── settings.py
│   └── urls.py
└── communicate/          # Main app
    ├── models.py         # UserProfile, MessageLog
    ├── views.py          # All views
    ├── forms.py          # Login & Register forms
    ├── urls.py
    ├── templates/communicate/
    │   ├── base.html
    │   ├── login.html
    │   ├── register.html
    │   ├── dashboard.html
    │   └── history.html
    └── static/communicate/
        ├── css/main.css
        └── js/
            ├── main.js
            └── dashboard.js
```

## Technology Stack
- **Backend**: Python 3, Django 4.2
- **Frontend**: HTML5, CSS3 (custom design), Vanilla JS
- **TTS**: Web Speech API (browser-native, no external API needed)
- **Database**: SQLite (dev) — swap to PostgreSQL for production
- **Fonts**: Syne + Outfit (Google Fonts)
