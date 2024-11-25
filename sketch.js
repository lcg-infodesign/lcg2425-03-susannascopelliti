let riversData;
let maxLength = 0; //lunghezza massima del fiume
let yPositionOffset = 0; // scroll verticale
let xPositionOffset = 0; // scroll orizzontale
let totalWidth = 0; // Larghezza totale per tutte le righe, calcolare scrolling orizz.

function preload() {
    riversData = loadTable('data/rivers.csv', 'csv', 'header');
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    // Valore lunghezza massima per normalizzare le linee
    for (let i = 0; i < riversData.getRowCount(); i++) {
        let riverLength = riversData.getNum(i, 'length'); //lunghezza del fiume
        if (riverLength > maxLength) {
            maxLength = riverLength;
        }
    }

    // Calcola la larghezza totale per lo scrolling orizzontale
    for (let i = 0; i < riversData.getRowCount(); i++) {
        let riverLength = riversData.getNum(i, 'length'); //lunghezza del fiume
        let countries = riversData.getString(i, 'countries').split(","); //ottnego paesi attraversati dal fiume

        // Calcola la lunghezza della linea del fiume in base alla larghezza della finestra 
        let lineLength = map(riverLength, 0, maxLength, 0, width - 150); 

        // Calcola la larghezza tot. occupata dai rettangoli dei paesi
        let totalCountryWidth = 0;
        for (let j = 0; j < countries.length; j++) {
            let country = countries[j].trim();
            totalCountryWidth += textWidth(country) + 20; // Somma la larghezza di ogni rettangolo
        }

        // La larghezza totale per quella riga: include linea del fiume e rettangoli
        totalWidth += lineLength + totalCountryWidth + 80; // 80px di margine extra
    }

    noLoop(); // Disegna solo una volta
}

function draw() {
    background('#c5a875');

    // Disegno il titolo e sottotitolo (solo in alto)
    if (yPositionOffset === 0) {
        textSize(32);
        fill(0); 
        textAlign(CENTER, TOP);
        text("Rivers in the World", width / 2, 20); 

        // sottotitolo
        textSize(20);
        fill(0); 
        textAlign(CENTER, TOP);
        text("Che paesi attraversano questi fiumi e quanto sono lunghi?", width / 2, 60); // Sottotitolo sotto il titolo
    }

    // Distanza tra il sottotitolo e la prima riga
    let spaceAfterSubtitle = 100; // Maggiore distanza tra il sottotitolo e la prima riga

    // Posizione verticale per la prima riga
    let yPosition = 60 + spaceAfterSubtitle - yPositionOffset; // Inizia dopo il sottotitolo e con un offset verticale

    let gap = 50; // Spazio tra le righe
    let rectHeight = 30; // Altezza dei rettangoli paesi
    let xStart = 50 - xPositionOffset; // Posizione orizzontale iniziale per la linea

    // Ciclo per ogni fiume
    for (let i = 0; i < riversData.getRowCount(); i++) {
        let riverName = riversData.getString(i, 'name');
        let riverLength = riversData.getNum(i, 'length');
        let countries = riversData.getString(i, 'countries').split(","); // paesi attraversati dal fiume

        // calcolo per la lunghezza della linea del fiume
        let lineLength = map(riverLength, 0, maxLength, 0, width - 150); // Mappa la lunghezza del fiume

        // Calcola la larghezza totale rettangoli paesi
        let totalCountryWidth = 0;
        for (let j = 0; j < countries.length; j++) {
            let country = countries[j].trim();
            totalCountryWidth += textWidth(country) + 20; // Somma la larghezza di ogni rettangolo
        }

        // La linea del fiume ora deve coprire sia la sua lunghezza che quella dei rettangoli dei paesi
        let totalLineLength = lineLength + totalCountryWidth;

        //Margine fisso per fare in modo che la linea superi l'ultimo rettangolo
        totalLineLength = max(totalLineLength, lineLength + totalCountryWidth + 80); 

        // Disegna la linea del fiume 
        stroke(0, 0, 300); 
        strokeWeight(6); 
        line(xStart, yPosition, xStart + totalLineLength, yPosition); 

        // Disegna i rettangoli per i paesi attraversati 
        let countrySpacing = 50; // Spazio tra i rettangoli
        let xOffset = xStart + lineLength + countrySpacing; // Inizia a disegnare rettangoli dopo la linea

        for (let j = 0; j < countries.length; j++) {
            let country = countries[j].trim();
            let rectWidth = textWidth(country) + 20; // Calcola la larghezza del rettangolo in base al nome del paese
            noStroke(); 
            fill(160, 79, 23); 
            rect(xOffset, yPosition - rectHeight / 2, rectWidth, rectHeight); 

            // nome del paese 
            fill(255); 
            textSize(12); 
            textAlign(CENTER, CENTER);
            text(country, xOffset + rectWidth / 2, yPosition); // Nome del paese nel rettangolo

            xOffset += rectWidth + 10; // Spazio tra i rettangoli
        }

        // Nome del fiume sotto la linea
        textSize(16);
        textStyle(BOLD);  
        fill(0, 0, 255); 
        textAlign(LEFT, TOP); // Allinea il testo a sinistra, sopra la linea
        text(riverName, xStart, yPosition + 10); // Nome del fiume sotto la linea
        textStyle(NORMAL); // Ripristina lo stile normale per il resto del testo

        // Aggiorna la posizione verticale per la prossima riga
        yPosition += gap + rectHeight; // Spazio per la prossima riga
    }
}

//ridimensiona il canvas se la finestra cambia dimensione
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

// Aggiungi una funzione per gestire lo scrolling
function mouseWheel(event) {
    // Modifica l'offset verticale per lo scrolling 
    if (event.deltaY !== 0) {
        yPositionOffset += event.deltaY;
        yPositionOffset = constrain(yPositionOffset, 0, (riversData.getRowCount() * (50 + 2 * 30) - height)); 
    }

    
    if (event.deltaX !== 0) {
        xPositionOffset += event.deltaX;
        xPositionOffset = constrain(xPositionOffset, 0, totalWidth - width); 
    }

    redraw();
}
