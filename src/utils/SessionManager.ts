export class SessionManager {
  private static instance: SessionManager;

  private constructor() {}

  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  async clearSession() {
    await chrome.storage.local.clear();
  }
} 