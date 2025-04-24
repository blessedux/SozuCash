var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/// <reference types="chrome"/>import { encrypt, decrypt } from '@metamask/browser-passworder';
import { Buffer } from 'buffer';
export class PasswordService {
    constructor() {
        this.password = null;
    }
    static getInstance() {
        if (!PasswordService.instance) {
            PasswordService.instance = new PasswordService();
        }
        return PasswordService.instance;
    }
    initializePassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            // Hash the password before storing
            const hashedPassword = yield this.hashPassword(password);
            yield chrome.storage.local.set({ hashedPassword });
            this.password = password;
        });
    }
    verifyPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            const { hashedPassword } = yield chrome.storage.local.get('hashedPassword');
            if (!hashedPassword)
                return false;
            const hashedInput = yield this.hashPassword(password);
            return hashedInput === hashedPassword;
        });
    }
    getPassword() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.password) {
                throw new Error('Password not initialized');
            }
            return this.password;
        });
    }
    hashPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            const encoder = new TextEncoder();
            const data = encoder.encode(password);
            const hash = yield crypto.subtle.digest('SHA-256', data);
            return Array.from(new Uint8Array(hash))
                .map(b => b.toString(16).padStart(2, '0'))
                .join('');
        });
    }
    encryptData(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Temporary simple encryption until we resolve the build issues
            const password = yield this.getPassword();
            const encoder = new TextEncoder();
            const dataStr = JSON.stringify(data);
            const encrypted = encoder.encode(dataStr + password);
            return Buffer.from(encrypted).toString('base64');
        });
    }
    decryptData(encryptedData) {
        return __awaiter(this, void 0, void 0, function* () {
            // Temporary simple decryption
            const password = yield this.getPassword();
            const decoder = new TextDecoder();
            const decoded = Buffer.from(encryptedData, 'base64');
            const decrypted = decoder.decode(decoded);
            return JSON.parse(decrypted.replace(password, ''));
        });
    }
}
