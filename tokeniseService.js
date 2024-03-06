const { encrypt, decrypt } = require('./encryption');

class TokeniseService {
    constructor(tokenRepository) {
        this.tokenRepository = tokenRepository;
    }
    
    tokenise (cardNumber) {
        // Mask card number for storage purpose
        const maskedStr = this.mask(cardNumber);
    
        // Generate token
        const token = encrypt(cardNumber);
    
        // Store new card number and token otherwise just return token
        const exist = this.tokenRepository.findOne('cards', {'cardNumber': maskedStr});
        if (exist == null) {
            // Store the mapping of masked number and token
            this.tokenRepository.insert('cards', { cardNumber: maskedStr, token: token });
        } else {
            return exist.token;
        }
    
        return token;
    };
    
    detokenise (token) {
        // Read toke from cards doc
        const exist = this.tokenRepository.findOne('cards', {'token': token});
    
        // Not exist in db
        if (!exist) return null;
    
        // If token exists, decrypt and return card number
        // NOTE: Should return masked card number but only return actual number from code exercise requirment
        return decrypt(token);
    }

    mask(cardNumber) {
        // Ensure the card number is a string
        cardNumber = String(cardNumber);
      
        // Check if the card number length is less than or equal to 4, return as is
        if (cardNumber.length <= 4) return cardNumber;
      
        // Mask all but the first and last 4 characters of the card number
        const maskedStr = cardNumber.slice(4, -4).replace(/\d/g, 'X');
        const first4Digits = cardNumber.slice(0, 4);
        const last4Digits = cardNumber.slice(-4);
      
        return first4Digits + maskedStr + last4Digits;
    }
}

module.exports = TokeniseService;