// Ensure buttons only work after web page is fully loaded
window.addEventListener('DOMContentLoaded', () => {
    const encodeButton = document.getElementById('encodeButton'); 
    // Assign encodeButton constant to any button with encodeButton id
    const encodedParagraphButton = document.getElementById('encodedParagraphButton'); 
    // Assign encodedParagraphButton constant to any button with encodedParagraphButton id

    // Add listeners to buttons to trigger functions on click
    encodeButton.addEventListener('click', () => encodeMessageFromInput('messageInput', 'encodedOutputMessage')); 
    // Trigger encodeMessageFromInput function on click, 
    // Takes messageInput and encodedOutputMessage as parameters 1 and 2 respectively.
    encodedParagraphButton.addEventListener('click', () => encodeRandomParagraphFromFile('messages.txt', 'encodedOutputParagraph'));
    // Trigger encodeRandomParagraphFromFile function on click, 
    // Takes messages.txt and encodedOutputParagraph as parameters 1 and 2 respectively.
});

// Encode a message using the scrambled key via substiution
function scrambleAlphabetEncoder(message, scrambledKey) {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'; 
    // Create a string of the alphabet
    if (scrambledKey.length !== 26 || new Set(scrambledKey).size !== 26) {
        // Check to make sure that the scrambled key is 26 characters long
        // and contains no duplicates
        throw new Error('Scramble key must be a permutation of the alphabet.'); 
        // Return an error message if the scramble key is not valid
    }
    // If the scrambled key is valid, encode the message
    return [...message.toLowerCase()].map(char => { 
        // Convert message to lowercase to avoid errors with sensitivity
        const index = alphabet.indexOf(char); 
        // Find index of each character based on the alphabet string
        // i.e a = 0, b = 1, c = 2
        if (index === -1) return char; 
        // Returns the character unchanged if its not in alphabet
        return scrambledKey[index]; 
        // For each character get the new character from the scrambledKey
        // i.e 0 = b , 1 = m , 2 = a
    }).join('');
    // Join the encoded characters into a single string and return it
}

// Generate a random scrambled key using Fisher-Yates shuffle algorithm
function generateRandomScrambledKey() {
    const alphabetArray = [...'abcdefghijklmnopqrstuvwxyz'];
    // Create an array of characters from the alphabet. 
    // "..." spreads the string into an array of characters.
    for (let i = alphabetArray.length - 1; i > 0; i--) {
        // Loops through the array in reverse order
        const j = Math.floor(Math.random() * (i + 1));
        // Generate a random index between 0 and i
        [alphabetArray[i], alphabetArray[j]] = [alphabetArray[j], alphabetArray[i]];
        // Swap the elements at indices i and j to ensure the array is shuffled
    }
    return alphabetArray.join(''); 
    // Return the shuffled array as a string and join the characters together
}

// Update the encoded output with details
function updateEncodedOutput(encodedMessage, unencodedMessage, scrambledKey) {
    // Takes all three parameters and returns a string of HTML
    return `
        <strong>Unencoded Message:</strong> ${unencodedMessage}<br>
        <strong>Encoded Message:</strong> ${encodedMessage}<br>
        <strong>Alphabet:</strong> abcdefghijklmnopqrstuvwxyz<br>
        <strong>Scramble Key:</strong> ${scrambledKey}
    `; // Return the information formatted for HTML
}

// Encode a custom message from an input by the user
function encodeMessageFromInput(inputId, outputElementId) {
    // inputId and outputElementId reflect messageInput and encodedOutputMessage respectively.
    const message = document.getElementById(inputId).value.trim(); 
    // Gets input message and removes any whitespace
    if (!message) {
        // If the message is empty
        document.getElementById(outputElementId).textContent = 'Input message cannot be empty.';
        return;
        // Display error message and return
    }
    try {
        // If the message is not empty trys to encode it
        const scrambledKey = generateRandomScrambledKey(); 
        // Runs the function to generate a random scrambled key
        // The resulting key is stored in the scrambledkey constant
        const encodedMessage = scrambleAlphabetEncoder(message, scrambledKey); 
        // Takes the message and scrambled key and runs the scrambleAlphabetEncoder function
        // The resulting encoded message is stored in the encodedMessage constant
        document.getElementById(outputElementId).innerHTML = updateEncodedOutput(encodedMessage, message, scrambledKey); 
        // Formats the output of the function to be shown in HTML
        // outputElementId is passed out of the encodeMessageFromInput function as encodedOutputMessage
    } catch (error) {
        document.getElementById(outputElementId).textContent = error.message; 
        // Display any error messages that come up during encoding
    }
}

// Encode a random paragraph from a file
function encodeRandomParagraphFromFile(source, outputElementId) {
    // source is the file path and outputElementId is the id of the output element
    fetch(source)
    // Fetches the file from the defined source (messages.txt)
        .then(response => {
            if (!response.ok) {
                // Check if the file can be fetched
                throw new Error(`Failed to fetch file: ${response.statusText}`); 
                // If the file cannot be fetched, throw an error message
            }
            return response.text(); 
            // If found returns the file's contents as text
        })
        .then(data => {
            const lines = data.split(/\r?\n/).filter(Boolean); 
            // Split the file into lines and remove empty space
            if (lines.length === 0) {
                // Check the file actually contains lines
                throw new Error('The file is empty or contains only blank lines.'); 
                // Throw an error if the file is empty or blank
            }
            const randomLine = lines[Math.floor(Math.random() * lines.length)]; 
            // Use Math.random to select a random line from the file
            const scrambledKey = generateRandomScrambledKey(); 
            //  Use the generateRandomScrambledKey function to create a new key
            const encodedMessage = scrambleAlphabetEncoder(randomLine, scrambledKey); 
            // Encode a random line using the scrambleAlphabetEncoder function
            document.getElementById(outputElementId).innerHTML = updateEncodedOutput(encodedMessage, randomLine, scrambledKey); 
            // Format the output of the function to be shown in HTML
        })
        .catch(error => {
            document.getElementById(outputElementId).textContent = `Error: ${error.message}`; 
            // Display any error messages
        });
}