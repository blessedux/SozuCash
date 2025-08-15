'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '../../ui/Input';
import { useWallet } from '../../../_context/WalletContext';

interface UserProfile {
  pfp: string;
  name: string;
  handle: string;
}

interface UserSearchProps {
  onUserSelect?: (user: UserProfile) => void;
  onUserConfirm?: (user: UserProfile) => void;
}

export function UserSearch({ onUserSelect, onUserConfirm }: UserSearchProps) {
  const [searchHandle, setSearchHandle] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [userFound, setUserFound] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isUserConfirmed, setIsUserConfirmed] = useState(false);
  const { isConnectedToX } = useWallet();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (searchHandle.trim()) {
      setIsSearching(true);
      
      // Debounce the search
      timeoutId = setTimeout(async () => {
        try {
          // Mock API call - replace with actual Twitter API integration
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const mockUser = {
            pfp: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face",
            name: "John Doe",
            handle: searchHandle.toLowerCase()
          };
          
          setUserProfile(mockUser);
          setUserFound(true);
          onUserSelect?.(mockUser);
          
        } catch (error) {
          console.error('Error searching user:', error);
          setUserFound(false);
          setUserProfile(null);
        } finally {
          setIsSearching(false);
        }
      }, 500);
    } else {
      setUserFound(false);
      setUserProfile(null);
      setIsUserConfirmed(false);
    }
    
    return () => clearTimeout(timeoutId);
  }, [searchHandle, onUserSelect]);

  const handleUserConfirmation = () => {
    if (userProfile) {
      setIsUserConfirmed(!isUserConfirmed);
      if (!isUserConfirmed) {
        onUserConfirm?.(userProfile);
      }
    }
  };

  if (!isConnectedToX) {
    return (
      <div className="text-center text-white/70">
        Please connect your X account to search for users.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <Input
        type="text"
        value={searchHandle}
        onChange={(e) => {
          const newHandle = e.target.value.replace('@', '');
          setSearchHandle(newHandle);
        }}
        placeholder="username"
        leftIcon={<span className="text-lg">@</span>}
        disabled={isSearching}
      />

      {/* Search Status */}
      <AnimatePresence mode="wait">
        {isSearching && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center"
          >
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white/30 mx-auto mb-2" />
            <p className="text-white/50 text-sm">Searching for user...</p>
          </motion.div>
        )}

        {/* User Profile Display */}
        {userFound && userProfile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <button
              onClick={handleUserConfirmation}
              className={`
                w-16 h-16 
                rounded-full 
                overflow-hidden 
                mx-auto mb-2 
                transition-all 
                duration-200
                ${isUserConfirmed 
                  ? 'ring-2 ring-green-400 scale-110' 
                  : 'ring-2 ring-white/20 hover:ring-white/40'
                }
              `}
            >
              <img 
                src={userProfile.pfp} 
                alt={userProfile.name}
                className="w-full h-full object-cover"
              />
            </button>
            <p className="text-white font-semibold text-sm">{userProfile.name}</p>
            <p className="text-white/50 text-xs">@{userProfile.handle}</p>
            <p className="text-white/30 text-xs mt-1">
              {isUserConfirmed ? '✓ Confirmed' : 'Tap to confirm'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
