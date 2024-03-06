const express = require('express');
const TokeniseService = require('./tokeniseService');
const TokenRepository = require('./tokenRepository');

const app = express();
const port = 3000;

const tokenRepo = new TokenRepository();
const tokeniseSvc = new TokeniseService(tokenRepo);

app.use(express.json());

// Route to tokenise card numbers
app.post('/tokenize', (req, res) => {
    let tokens = [];

    if (!req.body.length) {
        return res.status(400).send('Card number is required');
    }

    for (var i=0; i<req.body.length; i++) {
        const cardNumber = req.body[i];

        // Basic card validation
        if (!cardNumber || cardNumber.length < 12 || cardNumber.length > 19) {
            return res.status(400).send('Invalid card number');
        }

        // Encrypt and store card number
        const token = tokeniseSvc.tokenise(cardNumber);

        tokens.push(token);
    }

    // Return tokens response
    res.status(201).json(tokens);
});

// Route to detokenise encrypted card numbers
app.post('/detokenize', (req, res) => {
    let cardNumbers = [];

    if (!req.body.length) {
        return res.status(400).send('Token is required');
    }

    for (var i=0; i<req.body.length; i++) {
        const token = req.body[i];

        // Decrypt token
        const cardNumber = tokeniseSvc.detokenise(token);

        if (!cardNumber) {
            return res.status(404).send(`Token ${token} not found`);
        }

        cardNumbers.push(cardNumber);
    }

    // Return the card number
    res.status(200).json(cardNumbers);
});

if (require.main === module) {
    app.listen(port, () => {
        console.log(`Tokenisation service running at http://localhost:${port}`);
    });
}

module.exports = app;
