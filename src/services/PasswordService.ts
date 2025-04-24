/// <reference types="chrome"/>

/**
 * A simplified PasswordService for testing
 * This doesn't do real encryption, just for testing purposes
 */
export class PasswordService {
  private static instance: PasswordService;
  
  private constructor() {}
  
  static getInstance(): PasswordService {
    if (!PasswordService.instance) {
      PasswordService.instance = new PasswordService();
    }
    return PasswordService.instance;
  }
  
  // Mock encrypt/decrypt methods
  async encryptData(data: string): Promise<string> {
    // Simple base64 encoding (NOT secure, just for testing)
    return btoa(data);
  }
  
  async decryptData(encryptedData: string): Promise<string> {
    // Simple base64 decoding (NOT secure, just for testing)
    return atob(encryptedData);
  }
  
  // Generate a random password (simplified)
  generateRandomPassword(length: number = 12): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let result = '';
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
  }
} 