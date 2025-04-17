// DOMContentLoaded per fare in modo che il codice venga eseguito solo dopo che l'intero documento è completamente carico
document.addEventListener('DOMContentLoaded', () => {
    // Avendo assegnato gli id agli elementi HTML e non classi, chiamo i vari elementi per ID
    const flagContainer = document.getElementById('flag-container');
    const flagImg = document.getElementById('flag');
    const optionsContainer = document.getElementById('options-container');
    const nextBtn = document.getElementById('next-btn');
    const resultText = document.getElementById('result');
    const darkModeButton = document.getElementById('dark-button');
    const correctSound = new Audio('assets/correct.mp3');
    const wrongSound = new Audio('assets/wrong.mp3');

    // Tengo traccia della modalità di gioco
    let isHardMode = false;

    // Chiedo all'utente se vuole abilitare la modalità Hard
    isHardMode = window.confirm("Vuoi abilitare la modalità Hard? (Ok per Hard Mode, Annulla per Easy Mode)");

    // Creo l'array delle nazioni e la variabile per la nazione corrente
    let countries = [];
    let currentCountry = {};

    // Creo le variabili per il punteggio
    let totalAnswers = 0;
    let correctAnswers = 0;

    // Funzione per recuperare le nazioni dall'API e partire con la prossima domanda
    async function fetchCountries() {
        const response = await fetch('https://restcountries.com/v3.1/all');
        countries = await response.json();
        newQuestion();
    }

    // Funzione per generare una nuova domanda
    function newQuestion() {
        // Resetto il risultato, nascondo il pulsante "Next" e svuoto le scelte
        resultText.textContent = '';
        nextBtn.style.display = 'none';
        optionsContainer.innerHTML = '';

        // Seleziono 4 nazioni casuali
        const randomCountries = getRandomCountries(4);
        // Scelgo una nazione casuale tra quelle selezionate, assicurandomi di scegliere dentro l'array
        currentCountry = randomCountries[Math.floor(Math.random() * randomCountries.length)];

        // Mostro la bandiera della nazione casuale
        flagImg.src = currentCountry.flags.png;

        // Setup della modalità hard
        if (isHardMode) {
            // Contenitore per input e pulsante
            const inputContainer = document.createElement('div');
            // Usa Flexbox per allineare gli elementi
            inputContainer.style.display = 'flex';
            // Spaziatura tra input e pulsante
            inputContainer.style.gap = '10px';

            // Creo l'input per la risposta
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = 'Nome della nazione in inglese';
            input.id = 'answer-input';

            // Creo il pulsante di invio
            const submitButton = document.createElement('button');
            submitButton.textContent = 'Invia';
            submitButton.addEventListener('click', () => {
                const userAnswer = input.value.trim();
                checkAnswerHard(userAnswer);
            });

            // Aggiungo input e pulsante al contenitore
            inputContainer.appendChild(input);
            inputContainer.appendChild(submitButton);

            // Aggiungo il contenitore al DOM
            optionsContainer.appendChild(inputContainer);
        } else { // Setup della modalità easy
            // Creo i pulsanti per le varie nazioni dell'array
            randomCountries.forEach(country => {
                // Creo il pulsante nel DOM
                const button = document.createElement('button');
                // Nomino il pulsante con il nome della nazione
                button.textContent = country.name.common;
                // Creo un evento al click del pulsante che controlla se la risposta è corretta
                button.addEventListener('click', () => checkAnswerEasy(country));
                // Aggiungo il pulsante al contenitore delle opzioni per renderlo visibile
                optionsContainer.appendChild(button);
            });
        }
    }

    // Funzione per mescolare le nazioni 
    function getRandomCountries(count) {
        // Uso il metodo sort per mescolare l'array
        const shuffled = countries.sort(() => 0.5 - Math.random());
        // Restituisco le prime 'count' nazioni dall'array mescolato
        return shuffled.slice(0, count);
    }

    // Funzione per controllare la risposta in modalità easy
    function checkAnswerEasy(selectedCountry) {
        const buttons = optionsContainer.querySelectorAll('button');
        console.log('Pulsanti trovati:', buttons);

        // Controllo se la nazione selezionata è uguale alla nazione corrente
        if (selectedCountry.name.common === currentCountry.name.common) {
            console.log('Risposta corretta:', selectedCountry.name.common);
            // Se è corretta, mostro il messaggio di successo e riproduco il suono
            resultText.textContent = 'Corretto!';
            resultText.style.color = 'green';
            correctSound.play();
            // Coloro di verde il pulsante corretto
            buttons.forEach(button => {
                if (button.textContent === currentCountry.name.common) {
                    console.log('Pulsante corretto trovato:', button);
                    button.classList.add('correct');
                }
            });
            // Incremento il punteggio delle risposte corrette
            correctAnswers++;
        } else {
            console.log('Risposta sbagliata:', selectedCountry.name.common);
            // Se è sbagliata, mostro il messaggio di errore e la risposta corretta, inoltre riproduco il suono
            resultText.textContent = `Sbagliato! La risposta corretta era ${currentCountry.name.common}.`;
            resultText.style.color = 'red';
            wrongSound.play();
            // Coloro di rosso il pulsante sbagliato e di verde il corretto
            const buttons = optionsContainer.querySelectorAll('button');
            buttons.forEach(button => {
                if (button.textContent === selectedCountry.name.common) {
                    console.log('Pulsante sbagliato trovato:', button);
                    button.classList.add('wrong');
                }
                if (button.textContent === currentCountry.name.common) {
                    console.log('Pulsante corretto trovato:', button)
                    button.classList.add('correct');
                }
            });
        }

        // Incremento il numero di risposte
        totalAnswers++;
        // Aggiorno il punteggio
        updateScore();

        // Disabilito i pulsanti delle opzioni per evitare ulteriori clicks
        buttons.forEach(button => {
            button.disabled = true;
        });

        // Mostro il pulsante "Next" per passare alla prossima domanda
        nextBtn.style.display = 'block';
    }

    // Funzione per controllare la risposta in modalità hard
    function checkAnswerHard(userAnswer) {
        // Controllo se la risposta dell'utente è corretta
        if (userAnswer.toLowerCase() === currentCountry.name.common.toLowerCase()) {
            // Se è corretta, mostro il messaggio di successo e riproduco il suono
            resultText.textContent = 'Corretto!';
            resultText.style.color = 'green';
            correctSound.play();
            // Incremento il punteggio delle risposte corrette
            correctAnswers++;
        } else {
            // Se è sbagliata, mostro il messaggio di errore e la risposta corretta, inoltre riproduco il suono
            resultText.textContent = `Sbagliato! La risposta corretta era ${currentCountry.name.common}.`;
            resultText.style.color = 'red';
            wrongSound.play();
        }
    
        // Incremento il numero di risposte
        totalAnswers++;
        // Aggiorno il punteggio
        updateScore();
    
        // Disabilito l'input e il pulsante di invio
        const input = document.getElementById('answer-input');
        input.disabled = true;
        const submitButton = optionsContainer.querySelector('button');
        submitButton.disabled = true;
    
        // Mostro il pulsante "Next" per passare alla prossima domanda
        nextBtn.style.display = 'block';
    }

    // Funzione per la gestione del punteggio
    function updateScore() {
        const percentage = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;
        const scoreElement = document.getElementById('punteggio-numero');
        scoreElement.textContent = `${correctAnswers} / ${totalAnswers} - ${percentage}%`;
    }

    // Evento di reset del punteggio
    const resetButton = document.getElementById('punteggio-reset');
    resetButton.addEventListener('click', () => {
        totalAnswers = 0;
        correctAnswers = 0;
        updateScore();
    });

    // Assegno al bottone "Next" l'evento per passare alla prossima domanda
    nextBtn.addEventListener('click', newQuestion);
    
    // Game loop: recupero le nazioni dall'API e inizio il gioco
    fetchCountries();

       
    // Aggiungo un evento click all'immagine per attivare/disattivare la dark mode
    darkModeButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });

});
