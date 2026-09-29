import CryptoJS from 'crypto-js';

// Gunakan Key 32 byte (256 bit) dan IV 16 byte (128 bit)
// SEBAIKNYA INI DIAMBIL DARI .env
const SECRET_KEY_STRING = '12345678901234567890123456789012'; // 32 chars
const SECRET_IV_STRING = '1234567890123456'; // 16 chars

const SECRET_KEY = CryptoJS.enc.Utf8.parse(SECRET_KEY_STRING);
const SECRET_IV = CryptoJS.enc.Utf8.parse(SECRET_IV_STRING);

export const encryptPayload = (data: any): string => {
    try {
        const jsonString = JSON.stringify(data);
        const encrypted = CryptoJS.AES.encrypt(jsonString, SECRET_KEY, {
            iv: SECRET_IV,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        return encrypted.toString(); // Output Base64
    } catch (error) {
        console.error('Error encrypting payload:', error);
        throw error;
    }
};

export const decryptPayload = (ciphertext: string): any => {
    try {
        const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY, {
            iv: SECRET_IV,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
        return JSON.parse(decryptedString);
    } catch (error) {
        console.error('Error decrypting payload:', error);
        throw error;
    }
};
