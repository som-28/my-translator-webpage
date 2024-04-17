document.addEventListener('DOMContentLoaded', function () {
    const sourceLanguages = document.getElementById('source-languages');
    const targetLanguages = document.getElementById('target-languages');
    const inputText = document.querySelector('.input');
    const outputText = document.querySelector('.output');
    const translateButton = document.getElementById('translate-button');
    const clearButton = document.getElementById('clear-button');
    const voiceButton = document.getElementById('voice-button');
    const listeningIndicator = document.getElementById('listening-indicator');

    // Voice recognition setup
    let recognition = null;

    function startRecognition() {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.lang = sourceLanguages.value;
        recognition.interimResults = false;

        // Show the listening indicator
        listeningIndicator.style.display = 'block';

        recognition.onresult = function (event) {
            const speechResult = event.results[0][0].transcript;
            inputText.value = speechResult;
            translateText(speechResult);
        };

        recognition.onerror = function (event) {
            console.error('Speech recognition error:', event.error);
            alert('Speech recognition error occurred. Please try again.');
        };

        recognition.onend = function () {
            // Hide the listening indicator
            listeningIndicator.style.display = 'none';
            voiceButton.disabled = false;
        };

        recognition.start();
        voiceButton.disabled = true;
    }

    function translateText(text) {
        const targetLang = targetLanguages.value;
        // Update the API URL and headers as needed
        fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLanguages.value}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`, {
            method: 'GET'
        })
            .then(response => response.json())
            .then(data => {
                const translated = data[0][0][0];
                outputText.value = translated;
            })
            .catch(error => {
                console.error('Translation error:', error);
                alert('Translation error occurred. Please try again.');
            });
    }

    // Event listeners
    voiceButton.addEventListener('click', startRecognition);
    translateButton.addEventListener('click', function () {
        translateText(inputText.value);
    });
    clearButton.addEventListener('click', function () {
        inputText.value = '';
        outputText.value = '';
    });
});