import React, { useState } from 'react';
import { walletManager } from '../services/wallet';

interface WalletCreationProps {
  onComplete: () => void;
  twitterUsername: string;
}

const WalletCreation: React.FC<WalletCreationProps> = ({ onComplete, twitterUsername }) => {
  const [isImporting, setIsImporting] = useState(false);
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [walletName, setWalletName] = useState(`${twitterUsername}'s Wallet`);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validatePassword = () => {
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    return true;
  };

  const handleCreateWallet = async () => {
    setError('');
    
    if (!validatePassword()) {
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Set password in wallet manager
      await walletManager.unlock(password);
      
      // Create a new wallet
      await walletManager.createWallet(twitterUsername, walletName);
      
      setIsLoading(false);
      onComplete();
    } catch (error) {
      setIsLoading(false);
      setError(error instanceof Error ? error.message : 'Failed to create wallet');
    }
  };

  const handleImportWallet = async () => {
    setError('');
    
    if (!validatePassword()) {
      return;
    }
    
    if (!address || !address.match(/^0x[a-fA-F0-9]{40}$/)) {
      setError('Invalid wallet address format');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Set password in wallet manager
      await walletManager.unlock(password);
      
      // Import the wallet
      await walletManager.importWallet(twitterUsername, address, walletName);
      
      setIsLoading(false);
      onComplete();
    } catch (error) {
      setIsLoading(false);
      setError(error instanceof Error ? error.message : 'Failed to import wallet');
    }
  };

  return (
    <div className="wallet-creation">
      <h2>{isImporting ? 'Import Existing Wallet' : 'Create New Wallet'}</h2>
      
      <div className="tabs">
        <button 
          className={!isImporting ? 'active' : ''} 
          onClick={() => setIsImporting(false)}
        >
          Create New
        </button>
        <button 
          className={isImporting ? 'active' : ''} 
          onClick={() => setIsImporting(true)}
        >
          Import Existing
        </button>
      </div>
      
      <div className="form">
        {isImporting && (
          <div className="form-group">
            <label htmlFor="wallet-address">Wallet Address</label>
            <input
              id="wallet-address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="0x..."
            />
          </div>
        )}
        
        <div className="form-group">
          <label htmlFor="wallet-name">Wallet Name</label>
          <input
            id="wallet-name"
            type="text"
            value={walletName}
            onChange={(e) => setWalletName(e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a secure password"
          />
          <small>Must be at least 8 characters</small>
        </div>
        
        <div className="form-group">
          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
          />
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <button 
          onClick={isImporting ? handleImportWallet : handleCreateWallet}
          disabled={isLoading}
          className="primary-button"
        >
          {isLoading ? 'Processing...' : isImporting ? 'Import Wallet' : 'Create Wallet'}
        </button>
      </div>
    </div>
  );
};

export default WalletCreation; 