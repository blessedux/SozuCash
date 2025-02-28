import { encrypt, decrypt } from '@metamask/browser-passworder';
import { Buffer } from 'buffer';

export class PasswordService {
  private static instance: PasswordService;
  private password: string | null = null;

  private constructor() {}

  static getInstance(): PasswordService {
    if (!PasswordService.instance) {
      PasswordService.instance = new PasswordService();
    }
    return PasswordService.instance;
  }

  async initializePassword(password: string): Promise<void> {
    // Hash the password before storing
    const hashedPassword = await this.hashPassword(password);
    await chrome.storage.local.set({ hashedPassword });
    this.password = password;
  }

  async verifyPassword(password: string): Promise<boolean> {
    const { hashedPassword } = await chrome.storage.local.get('hashedPassword');
    if (!hashedPassword) return false;
    
    const hashedInput = await this.hashPassword(password);
    return hashedInput === hashedPassword;
  }

  async getPassword(): Promise<string> {
    if (!this.password) {
      throw new Error('Password not initialized');
    }
    return this.password;
  }

  private async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  async encryptData(data: any): Promise<string> {
    // Temporary simple encryption until we resolve the build issues
    const password = await this.getPassword();
    const encoder = new TextEncoder();
    const dataStr = JSON.stringify(data);
    const encrypted = encoder.encode(dataStr + password);
    return Buffer.from(encrypted).toString('base64');
  }

  async decryptData(encryptedData: string): Promise<any> {
    // Temporary simple decryption
    const password = await this.getPassword();
    const decoder = new TextDecoder();
    const decoded = Buffer.from(encryptedData, 'base64');
    const decrypted = decoder.decode(decoded);
    return JSON.parse(decrypted.replace(password, ''));
  }
} 