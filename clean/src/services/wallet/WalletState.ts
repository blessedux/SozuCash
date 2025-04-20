/**
 * WalletState.ts
 * Centralized state management for wallet data
 */

// Wallet interface
export interface Wallet {
  address: string;
  name: string;
  balance?: string;
  twitterUsername?: string;
  isImported?: boolean;
  networkId?: string;
  created?: number;
}

// State change listener type
export type StateChangeListener = (state: WalletStateData) => void;

// Wallet state data interface
export interface WalletStateData {
  currentWallet: Wallet | null;
  wallets: Wallet[];
  isAuthenticated: boolean;
  currentNetwork: string;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: WalletStateData = {
  currentWallet: null,
  wallets: [],
  isAuthenticated: false,
  currentNetwork: 'mantle', // Default network
  isLoading: false,
  error: null
};

/**
 * Wallet state management singleton
 */
class WalletStateManager {
  private state: WalletStateData;
  private listeners: StateChangeListener[] = [];
  
  constructor() {
    this.state = { ...initialState };
  }
  
  /**
   * Get current state
   */
  getState(): WalletStateData {
    return { ...this.state };
  }
  
  /**
   * Update state with partial data
   */
  setState(newState: Partial<WalletStateData>): void {
    this.state = { ...this.state, ...newState };
    this.notifyListeners();
  }
  
  /**
   * Reset state to initial values
   */
  resetState(): void {
    this.state = { ...initialState };
    this.notifyListeners();
  }
  
  /**
   * Subscribe to state changes
   */
  subscribe(listener: StateChangeListener): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
  
  /**
   * Notify all listeners of state change
   */
  private notifyListeners(): void {
    const stateSnapshot = { ...this.state };
    this.listeners.forEach(listener => listener(stateSnapshot));
  }
  
  // --- Wallet Actions ---
  
  /**
   * Set the current active wallet
   */
  setCurrentWallet(wallet: Wallet | null): void {
    this.setState({
      currentWallet: wallet,
      error: null
    });
  }
  
  /**
   * Set the list of available wallets
   */
  setWallets(wallets: Wallet[]): void {
    this.setState({
      wallets,
      error: null
    });
    
    // If we have wallets but no current wallet, set the first one
    if (wallets.length > 0 && !this.state.currentWallet) {
      this.setCurrentWallet(wallets[0]);
    }
  }
  
  /**
   * Set the authentication status
   */
  setAuthenticated(isAuthenticated: boolean): void {
    this.setState({ isAuthenticated });
  }
  
  /**
   * Set the current network
   */
  setNetwork(network: string): void {
    this.setState({ currentNetwork: network });
  }
  
  /**
   * Add a new wallet to the list
   */
  addWallet(wallet: Wallet): void {
    const wallets = [...this.state.wallets, wallet];
    this.setWallets(wallets);
    this.setCurrentWallet(wallet);
  }
  
  /**
   * Update a wallet's properties
   */
  updateWallet(address: string, updates: Partial<Wallet>): void {
    const wallets = this.state.wallets.map(wallet => {
      if (wallet.address === address) {
        return { ...wallet, ...updates };
      }
      return wallet;
    });
    
    this.setWallets(wallets);
    
    // If updating the current wallet, also update that reference
    if (this.state.currentWallet?.address === address) {
      this.setCurrentWallet({ ...this.state.currentWallet, ...updates });
    }
  }
  
  /**
   * Set loading state
   */
  setLoading(isLoading: boolean): void {
    this.setState({ isLoading });
  }
  
  /**
   * Set error message
   */
  setError(error: string | null): void {
    this.setState({ error });
  }
  
  /**
   * Load wallets from storage
   */
  async loadWallets(twitterUsername?: string): Promise<void> {
    this.setLoading(true);
    this.setError(null);
    
    try {
      // Check if authenticated
      const authResult = await new Promise<{isAuthenticated: boolean}>(resolve => {
        chrome.runtime.sendMessage(
          { type: 'CHECK_AUTH_STATUS' },
          (response) => resolve(response || { isAuthenticated: false })
        );
      });
      
      this.setAuthenticated(authResult.isAuthenticated);
      
      if (!authResult.isAuthenticated) {
        this.setWallets([]);
        this.setCurrentWallet(null);
        this.setLoading(false);
        return;
      }
      
      // Get wallets from storage if authenticated
      if (twitterUsername) {
        const walletsResult = await new Promise<{success: boolean, wallets: Wallet[]}>(resolve => {
          chrome.runtime.sendMessage(
            { type: 'GET_WALLETS', username: twitterUsername },
            (response) => resolve(response || { success: false, wallets: [] })
          );
        });
        
        if (walletsResult.success) {
          this.setWallets(walletsResult.wallets);
        } else {
          this.setWallets([]);
        }
      }
    } catch (error) {
      this.setError(error instanceof Error ? error.message : 'Failed to load wallets');
      this.setWallets([]);
    } finally {
      this.setLoading(false);
    }
  }
  
  /**
   * Import a wallet
   */
  async importWallet(twitterUsername: string, address: string): Promise<void> {
    this.setLoading(true);
    this.setError(null);
    
    try {
      const result = await new Promise<{success: boolean, wallet: Wallet}>(resolve => {
        chrome.runtime.sendMessage(
          { type: 'IMPORT_WALLET', username: twitterUsername, address },
          (response) => resolve(response || { success: false, wallet: null })
        );
      });
      
      if (result.success && result.wallet) {
        this.addWallet(result.wallet);
      } else {
        throw new Error('Failed to import wallet');
      }
    } catch (error) {
      this.setError(error instanceof Error ? error.message : 'Failed to import wallet');
    } finally {
      this.setLoading(false);
    }
  }
}

// Create singleton instance
export const walletState = new WalletStateManager();

// Export default for convenience
export default walletState; 