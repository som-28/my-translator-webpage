document.addEventListener('DOMContentLoaded', function () {
    // --- ELEMENTS ---
    const body = document.body;
    // Hamburger menu
    const hamburgerToggle = document.getElementById('hamburger-toggle');
    const settingsMenu = document.getElementById('settings-menu');
    const closeSettings = document.getElementById('close-settings');
    // Settings controls
    const accentColorMenu = document.getElementById('accent-color-menu');
    const fontSizeMenu = document.getElementById('font-size-menu');
    const bgPatternMenu = document.getElementById('bg-pattern-menu');
    const themeToggleMenu = document.getElementById('theme-toggle-menu');
    // Translator controls
    const sourceLanguages = document.getElementById('source-languages');
    const targetLanguages = document.getElementById('target-languages');
    const inputText = document.querySelector('.input');
    const outputText = document.querySelector('.output');
    const translateButton = document.getElementById('translate-button');
    const clearButton = document.getElementById('clear-button');
    const voiceButton = document.getElementById('voice-button');
    const listeningIndicator = document.getElementById('listening-indicator');
    const switchButton = document.querySelector('.switch-button');
    const copyOutputBtn = document.getElementById('copy-output');
    const speakOutputBtn = document.getElementById('speak-output');
    const downloadOutputBtn = document.getElementById('download-output');
    const shareOutputBtn = document.getElementById('share-output');
    const historyList = document.getElementById('translation-history');
    const inputCount = document.getElementById('input-count');
    const outputCount = document.getElementById('output-count');

    // --- HAMBURGER MENU LOGIC ---
    function openMenu() {
        settingsMenu.classList.add('open');
        setTimeout(() => settingsMenu.focus(), 10);
        document.body.style.overflow = 'hidden';
    }
    function closeMenu() {
        settingsMenu.classList.remove('open');
        document.body.style.overflow = '';
    }
    hamburgerToggle.addEventListener('click', openMenu);
    closeSettings.addEventListener('click', closeMenu);
    document.addEventListener('keydown', function(e) {
        if (settingsMenu.classList.contains('open')) {
            if (e.key === 'Escape') closeMenu();
            // Trap focus in menu
            const focusable = settingsMenu.querySelectorAll('button, input, select');
            if (e.key === 'Tab') {
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault(); last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault(); first.focus();
                }
            }
        }
    });
    document.addEventListener('mousedown', function(e) {
        if (settingsMenu.classList.contains('open') && !settingsMenu.contains(e.target) && e.target !== hamburgerToggle) {
            closeMenu();
        }
    });

    // --- SETTINGS IN MENU ---
    function syncMenuSettings() {
        accentColorMenu.value = localStorage.getItem('accentColor') || '#1e90ff';
        fontSizeMenu.value = localStorage.getItem('fontSize') || 'medium';
        bgPatternMenu.value = localStorage.getItem('bgPattern') || 'gradient';
        themeToggleMenu.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
    }
    syncMenuSettings();
    accentColorMenu.addEventListener('input', function () {
        document.documentElement.style.setProperty('--primary-accent', accentColorMenu.value);
        localStorage.setItem('accentColor', accentColorMenu.value);
    });
    fontSizeMenu.addEventListener('change', function () {
        localStorage.setItem('fontSize', fontSizeMenu.value);
        if (fontSizeMenu.value === 'small') document.documentElement.style.fontSize = '15px';
        else if (fontSizeMenu.value === 'large') document.documentElement.style.fontSize = '19px';
        else document.documentElement.style.fontSize = '17px';
    });
    bgPatternMenu.addEventListener('change', function () {
        localStorage.setItem('bgPattern', bgPatternMenu.value);
        document.body.classList.remove('bg-dots', 'bg-grid');
        if (bgPatternMenu.value === 'dots') document.body.classList.add('bg-dots');
        else if (bgPatternMenu.value === 'grid') document.body.classList.add('bg-grid');
    });
    themeToggleMenu.addEventListener('click', function () {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            themeToggleMenu.textContent = '☀️';
            localStorage.setItem('theme', 'dark');
        } else {
            themeToggleMenu.textContent = '🌙';
            localStorage.setItem('theme', 'light');
        }
    });
    document.body.addEventListener('classChange', syncMenuSettings);
    const origAdd = document.body.classList.add;
    const origRemove = document.body.classList.remove;
    document.body.classList.add = function(...args) { origAdd.apply(this, args); this.dispatchEvent(new Event('classChange')); };
    document.body.classList.remove = function(...args) { origRemove.apply(this, args); this.dispatchEvent(new Event('classChange')); };

    // --- TOAST/SNACKBAR ---
    function showToast(message) {
        let toast = document.getElementById('toast-snackbar');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'toast-snackbar';
            toast.setAttribute('aria-live', 'polite');
            toast.className = 'visually-hidden';
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.classList.remove('visually-hidden');
        toast.classList.add('visible');
        setTimeout(() => {
            toast.classList.remove('visible');
            toast.classList.add('visually-hidden');
        }, 2600);
    }

    // --- TRANSLATION HISTORY ---
    function getHistory() {
        return JSON.parse(localStorage.getItem('translationHistory') || '[]');
    }
    function saveHistory(entry) {
        let history = getHistory();
        history = history.filter(h => !(h.input === entry.input && h.source === entry.source && h.target === entry.target));
        history.unshift(entry);
        if (history.length > 5) history = history.slice(0, 5);
        localStorage.setItem('translationHistory', JSON.stringify(history));
        renderHistory();
    }
    function renderHistory() {
        const history = getHistory();
        historyList.innerHTML = '';
        if (history.length === 0) {
            historyList.innerHTML = '<li style="opacity:0.7;">No recent translations.</li>';
            return;
        }
        history.forEach((item, idx) => {
            const li = document.createElement('li');
            li.tabIndex = 0;
            li.innerHTML = `<span class='history-lang'>${getLangName(item.source)}</span> ➔ <span class='history-lang'>${getLangName(item.target)}</span> <span style='flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;'>${item.input}</span>`;
            li.addEventListener('click', () => {
                sourceLanguages.value = item.source;
                targetLanguages.value = item.target;
                inputText.value = item.input;
                outputText.value = item.output;
                updateCounts();
            });
            li.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') li.click();
            });
            historyList.appendChild(li);
        });
    }
    function getLangName(code) {
        if (code === 'auto') return 'Auto';
        const map = {zh:'Chinese',en:'English',fr:'French',de:'German',el:'Greek',hi:'Hindi',ja:'Japanese',es:'Spanish',ta:'Tamil',te:'Telugu'};
        return map[code] || code;
    }
    renderHistory();

    // --- CHARACTER/WORD COUNT ---
    function countWords(str) {
        return str.trim() ? str.trim().split(/\s+/).length : 0;
    }
    function updateCounts() {
        inputCount.textContent = `${inputText.value.length} chars, ${countWords(inputText.value)} words`;
        outputCount.textContent = `${outputText.value.length} chars, ${countWords(outputText.value)} words`;
    }
    inputText.addEventListener('input', updateCounts);
    outputText.addEventListener('input', updateCounts);
    updateCounts();

    // --- OFFLINE MODE: CACHE TRANSLATIONS ---
    function getCache() {
        return JSON.parse(localStorage.getItem('translationCache') || '[]');
    }
    function saveCache(entry) {
        let cache = getCache();
        cache = cache.filter(h => !(h.input === entry.input && h.source === entry.source && h.target === entry.target));
        cache.unshift(entry);
        if (cache.length > 5) cache = cache.slice(0, 5);
        localStorage.setItem('translationCache', JSON.stringify(cache));
    }
    function getCachedTranslation(input, source, target) {
        const cache = getCache();
        return cache.find(h => h.input === input && h.source === source && h.target === target);
    }

    // --- TRANSLATION LOGIC ---
    function getSourceLang() {
        return sourceLanguages.value === 'auto' ? 'auto' : sourceLanguages.value;
    }
    function setTranslateLoading(loading) {
        if (loading) {
            translateButton.disabled = true;
            translateButton.innerHTML = '🌐<span class="loading-spinner"></span>';
            translateButton.style.opacity = '0.7';
            translateButton.style.cursor = 'wait';
        } else {
            translateButton.disabled = false;
            translateButton.innerHTML = '🌐';
            translateButton.style.opacity = '';
            translateButton.style.cursor = '';
        }
    }
    function validateInput() {
        if (!inputText.value.trim()) {
            showToast('Please enter text to translate.');
            return false;
        }
        if (inputText.value.length > 1000) {
            showToast('Input too long (max 1000 characters).');
            return false;
        }
        return true;
    }
    function translateText(text) {
        const targetLang = targetLanguages.value;
        const sourceLang = getSourceLang();
        setTranslateLoading(true);
        fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`, {
            method: 'GET'
        })
            .then(response => response.json())
            .then(data => {
                const translated = data[0][0][0];
                outputText.value = translated;
                outputText.focus();
                updateCounts();
                saveHistory({
                    input: text,
                    output: translated,
                    source: sourceLanguages.value,
                    target: targetLanguages.value
                });
                saveCache({
                    input: text,
                    output: translated,
                    source: sourceLanguages.value,
                    target: targetLanguages.value
                });
            })
            .catch(error => {
                const cached = getCachedTranslation(text, sourceLanguages.value, targetLanguages.value);
                if (cached) {
                    outputText.value = cached.output;
                    outputText.focus();
                    updateCounts();
                    showToast('Offline: showing cached translation');
                } else {
                    showToast('Translation error occurred. Please try again.');
                }
            })
            .finally(() => {
                setTranslateLoading(false);
            });
    }

    // --- OUTPUT ACTIONS ---
    copyOutputBtn.addEventListener('click', function () {
        if (outputText.value.trim() !== '') {
            navigator.clipboard.writeText(outputText.value)
                .then(() => showToast('Copied to clipboard!'))
                .catch(() => showToast('Failed to copy.'));
        } else {
            showToast('Nothing to copy!');
        }
    });
    speakOutputBtn.addEventListener('click', function () {
        if (outputText.value.trim() !== '') {
            const utter = new SpeechSynthesisUtterance(outputText.value);
            utter.lang = targetLanguages.value;
            window.speechSynthesis.speak(utter);
        } else {
            showToast('Nothing to speak!');
        }
    });
    downloadOutputBtn.addEventListener('click', function () {
        if (outputText.value.trim() !== '') {
            const blob = new Blob([outputText.value], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'translation.txt';
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);
        } else {
            showToast('Nothing to download!');
        }
    });
    shareOutputBtn.addEventListener('click', function () {
        if (outputText.value.trim() !== '') {
            const shareText = `Translation (${getLangName(sourceLanguages.value)} ➔ ${getLangName(targetLanguages.value)}):\n${inputText.value}\n→\n${outputText.value}`;
            if (navigator.share) {
                navigator.share({text: shareText}).catch(() => showToast('Share cancelled.'));
            } else {
                navigator.clipboard.writeText(shareText)
                    .then(() => showToast('Translation copied for sharing!'))
                    .catch(() => showToast('Failed to copy for sharing.'));
            }
        } else {
            showToast('Nothing to share!');
        }
    });

    // --- LANGUAGE SWITCH BUTTON ---
    switchButton.addEventListener('click', function () {
        const tempLang = sourceLanguages.value;
        sourceLanguages.value = targetLanguages.value;
        targetLanguages.value = tempLang;
        localStorage.setItem('sourceLang', sourceLanguages.value);
        localStorage.setItem('targetLang', targetLanguages.value);
        const tempText = inputText.value;
        inputText.value = outputText.value;
        outputText.value = tempText;
        switchButton.classList.add('switch-animate');
        setTimeout(() => switchButton.classList.remove('switch-animate'), 500);
    });

    // --- VOICE RECOGNITION ---
    let recognition = null;
    function setVoiceActive(active) {
        if (active) {
            voiceButton.style.background = 'linear-gradient(90deg, #e74c3c, #ff7675)';
            voiceButton.style.color = '#fff';
            voiceButton.style.boxShadow = '0 0 16px #e74c3c88';
        } else {
            voiceButton.style.background = '';
            voiceButton.style.color = '';
            voiceButton.style.boxShadow = '';
        }
    }
    function startRecognition() {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.lang = sourceLanguages.value;
        recognition.interimResults = false;
        listeningIndicator.style.display = 'block';
        setVoiceActive(true);
        recognition.onresult = function (event) {
            const speechResult = event.results[0][0].transcript;
            inputText.value = speechResult;
            translateText(speechResult);
        };
        recognition.onerror = function (event) {
            showToast('Speech recognition error occurred. Please try again.');
        };
        recognition.onend = function () {
            listeningIndicator.style.display = 'none';
            voiceButton.disabled = false;
            setVoiceActive(false);
        };
        recognition.start();
        voiceButton.disabled = true;
    }
    voiceButton.addEventListener('click', startRecognition);

    // --- TRANSLATE, CLEAR BUTTONS ---
    translateButton.addEventListener('click', function () {
        if (validateInput()) {
            translateText(inputText.value);
        }
    });
    clearButton.addEventListener('click', function () {
        inputText.value = '';
        outputText.value = '';
        updateCounts();
    });

    // --- KEYBOARD SHORTCUTS ---
    document.addEventListener('keydown', function (e) {
        // Translate: Ctrl+Enter
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            if (validateInput()) {
                translateText(inputText.value);
                showToast('Translated! (Ctrl+Enter)');
            }
        }
        // Clear: Ctrl+L
        if (e.ctrlKey && (e.key === 'l' || e.key === 'L')) {
            e.preventDefault();
            inputText.value = '';
            outputText.value = '';
            updateCounts();
            showToast('Cleared! (Ctrl+L)');
        }
        // Switch: Ctrl+Shift+S
        if (e.ctrlKey && e.shiftKey && (e.key === 's' || e.key === 'S')) {
            e.preventDefault();
            switchButton.click();
            showToast('Switched! (Ctrl+Shift+S)');
        }
        // Copy output: Ctrl+Shift+C
        if (e.ctrlKey && e.shiftKey && (e.key === 'c' || e.key === 'C')) {
            e.preventDefault();
            copyOutputBtn.click();
        }
        // Speak output: Ctrl+Shift+V
        if (e.ctrlKey && e.shiftKey && (e.key === 'v' || e.key === 'V')) {
            e.preventDefault();
            speakOutputBtn.click();
        }
        // Download output: Ctrl+Shift+D
        if (e.ctrlKey && e.shiftKey && (e.key === 'd' || e.key === 'D')) {
            e.preventDefault();
            downloadOutputBtn.click();
        }
        // Focus history: Ctrl+Shift+H
        if (e.ctrlKey && e.shiftKey && (e.key === 'h' || e.key === 'H')) {
            e.preventDefault();
            const firstHistory = document.querySelector('.history-list li');
            if (firstHistory) firstHistory.focus();
        }
    });
});