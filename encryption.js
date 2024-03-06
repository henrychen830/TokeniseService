const CryptoJS = require("crypto-js");

// Secret key, keep this key secure.
// NOTE: Store the scret key in secure key management system for production
const secretKey = 'secret-key';

const encrypt = (text) => {
  return CryptoJS.AES.encrypt(text, secretKey).toString();
};

const decrypt = (encryptedText) => {
  const bytes = CryptoJS.AES.decrypt(encryptedText, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

module.exports = { encrypt, decrypt };
