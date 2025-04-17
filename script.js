// DOMContentLoaded per fare in modo che il codice venga eseguito solo dopo che l'intero documento è completamente carico
document.addEventListener('DOMContentLoaded', () => {
    // Avendo assegnato gli id agli elementi HTML e non classi, chiamo i vari elementi per ID
    const flagContainer = document.getElementById('flag-container');
    const flagImg = document.getElementById('flag');
    const optionsContainer = document.getElementById('options-container');
    const nextBtn = document.getElementById('next-btn');
    const resultText = document.getElementById('result');

    // creo l'array delle nazioni e la variabile per la nazione corrente
    let countries = [];
    let currentCountry = {};

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

        // Creo i pulsanti per le varie nazioni dell'array
        randomCountries.forEach(country => {
            // Creo il pulsante nel DOM
            const button = document.createElement('button');
            // Nomino il pulsante con il nome della nazione
            button.textContent = country.name.common;
            // Creo un evento al click del pulsante che controlla se la risposta è corretta
            button.addEventListener('click', () => checkAnswer(country));
            // Aggiungo il pulsante al contenitore delle opzioni per renderlo visibile
            optionsContainer.appendChild(button);
        });
    }

    // Funzione per mescolare le nazioni 
    function getRandomCountries(count) {
        // Uso il metodo sort per mescolare l'array
        const shuffled = countries.sort(() => 0.5 - Math.random());
        // Restituisco le prime 'count' nazioni dall'array mescolato
        return shuffled.slice(0, count);
    }

    // Funzione per controllare se la risposta è corretta
    function checkAnswer(selectedCountry) {
        // Controllo se la nazione selezionata è uguale alla nazione corrente
        if (selectedCountry.name.common === currentCountry.name.common) {
            // Se è corretta, mostro il messaggio di successo
            resultText.textContent = 'Corretto!';
            resultText.style.color = 'green';
        } else {
            // Se è sbagliata, mostro il messaggio di errore e la risposta corretta
            resultText.textContent = `Sbagliato! La risposta corretta era ${currentCountry.name.common}.`;
            resultText.style.color = 'red';
        }
        // Mostro il pulsante "Next" per passare alla prossima domanda
        nextBtn.style.display = 'block';
    }

    // Assegno al bottone "Next" l'evento per passare alla prossima domanda
    nextBtn.addEventListener('click', newQuestion);
    
    // Game loop: recupero le nazioni dall'API e inizio il gioco
    fetchCountries();
});
