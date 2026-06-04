/* SilentSpeak — Dashboard TTS Engine */
document.addEventListener('DOMContentLoaded', () => {

  /* ── Quick Phrases ── */
  const PHRASES = [
    "Hello! How are you?", "Yes, please.", "No, thank you.",
    "I need help.", "Please wait a moment.", "I understand.",
    "Can you repeat that?", "Where is the restroom?",
    "I need some water.", "Please call my family.",
    "I am doing fine.", "Thank you very much.",
    "I am in pain.", "Please get a doctor.",
    "I am hungry.", "I need to go now."
  ];

  const grid = document.getElementById('phrasesGrid');
  if (grid) {
    PHRASES.forEach(p => {
      const chip = document.createElement('button');
      chip.className = 'phrase-chip';
      chip.textContent = p;
      chip.addEventListener('click', () => {
        const ta = document.getElementById('messageInput');
        if (ta) { ta.value = p; updateCharCount(); }
        speakText(p);
      });
      grid.appendChild(chip);
    });
  }

  /* ── Character Count ── */
  const textarea = document.getElementById('messageInput');
  const charCount = document.getElementById('charCount');
  function updateCharCount() {
    if (textarea && charCount) charCount.textContent = textarea.value.length;
  }
  if (textarea) textarea.addEventListener('input', updateCharCount);

  /* ── Voice Setup ── */
  const voiceSelect = document.getElementById('voiceSelect');
  const speedRange = document.getElementById('speedRange');
  const pitchRange = document.getElementById('pitchRange');
  const speedVal = document.getElementById('speedVal');
  const pitchVal = document.getElementById('pitchVal');
  const speakBtn = document.getElementById('speakBtn');
  const stopBtn = document.getElementById('stopBtn');
  const clearBtn = document.getElementById('clearBtn');
  const statusText = document.getElementById('ttsStatusText');

  let voices = [];

  function loadVoices() {
    voices = window.speechSynthesis.getVoices();
    if (!voiceSelect) return;
    voiceSelect.innerHTML = '';
    const englishVoices = voices.filter(v => v.lang.startsWith('en'));
    const list = englishVoices.length ? englishVoices : voices;
    list.forEach((v, i) => {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = `${v.name} (${v.lang})`;
      if (v.default) opt.selected = true;
      voiceSelect.appendChild(opt);
    });
    if (voiceSelect.options.length === 0) {
      const opt = document.createElement('option');
      opt.textContent = 'Default Voice';
      voiceSelect.appendChild(opt);
    }
  }

  if ('speechSynthesis' in window) {
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  } else {
    if (statusText) statusText.textContent = 'TTS Not Supported';
  }

  if (speedRange) {
    speedRange.addEventListener('input', () => {
      if (speedVal) speedVal.textContent = parseFloat(speedRange.value).toFixed(1) + '×';
    });
  }
  if (pitchRange) {
    pitchRange.addEventListener('input', () => {
      if (pitchVal) pitchVal.textContent = parseFloat(pitchRange.value).toFixed(1);
    });
  }

  /* ── Speak Function ── */
  function speakText(text) {
    if (!text || !text.trim()) return;
    if (!('speechSynthesis' in window)) {
      alert('Text-to-Speech is not supported in your browser.');
      return;
    }
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text.trim());
    utt.rate = speedRange ? parseFloat(speedRange.value) : 1;
    utt.pitch = pitchRange ? parseFloat(pitchRange.value) : 1;

    if (voiceSelect && voices.length) {
      const idx = parseInt(voiceSelect.value);
      const englishVoices = voices.filter(v => v.lang.startsWith('en'));
      const list = englishVoices.length ? englishVoices : voices;
      if (list[idx]) utt.voice = list[idx];
    }

    utt.onstart = () => {
      if (speakBtn) { speakBtn.classList.add('speaking'); speakBtn.querySelector('span').textContent = 'Speaking…'; }
      if (statusText) statusText.textContent = 'Speaking…';
    };
    utt.onend = utt.onerror = () => {
      if (speakBtn) { speakBtn.classList.remove('speaking'); speakBtn.querySelector('span').textContent = 'Speak Now'; }
      if (statusText) statusText.textContent = 'TTS Ready';
    };

    window.speechSynthesis.speak(utt);
    saveMessage(text.trim());
  }

  /* ── Button Handlers ── */
  if (speakBtn) {
    speakBtn.addEventListener('click', () => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      } else {
        const text = textarea ? textarea.value : '';
        speakText(text);
      }
    });
  }

  if (stopBtn) {
    stopBtn.addEventListener('click', () => {
      window.speechSynthesis.cancel();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (textarea) { textarea.value = ''; updateCharCount(); textarea.focus(); }
    });
  }

  /* ── Keyboard Shortcut: Ctrl+Enter to Speak ── */
  if (textarea) {
    textarea.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        speakText(textarea.value);
      }
    });
  }

  /* ── Recent Item Replay ── */
  document.querySelectorAll('.recent-replay').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.closest('.recent-item').dataset.text;
      if (text) speakText(text);
    });
  });

  /* ── Save to DB ── */
  let saveTimer;
  function saveMessage(text) {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      const csrfToken = document.cookie.split('; ')
        .find(r => r.startsWith('csrftoken='))?.split('=')[1];
      fetch('/api/save-message/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrfToken || '' },
        body: JSON.stringify({ text })
      }).catch(() => {});
    }, 500);
  }

});
