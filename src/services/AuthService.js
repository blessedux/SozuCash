var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/// <reference types="chrome"/>import { ethers } from 'ethers';
import { twitterConfig } from '../config/twitter';
import { SessionManager } from '../utils/SessionManager';
export class AuthService {
    constructor() {
        this.sessionManager = SessionManager.getInstance();
    }
    static getInstance() {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }
    initiateTwitterAuth() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Generate a random state value for security
                const state = Math.random().toString(36).substring(2, 15);
                // Store state in local storage to verify later
                yield chrome.storage.local.set({ oauth_state: state });
                // Create the OAuth URL
                const authUrl = new URL(twitterConfig.authUrl);
                authUrl.searchParams.append('response_type', 'code');
                authUrl.searchParams.append('client_id', twitterConfig.clientId);
                authUrl.searchParams.append('redirect_uri', twitterConfig.redirectUri);
                authUrl.searchParams.append('scope', twitterConfig.scopes.join(' '));
                authUrl.searchParams.append('state', state);
                authUrl.searchParams.append('code_challenge_method', 'S256');
                // Generate code challenge for PKCE
                const codeVerifier = this.generateCodeVerifier();
                const codeChallenge = yield this.generateCodeChallenge(codeVerifier);
                // Store the code verifier for later use
                yield chrome.storage.local.set({ code_verifier: codeVerifier });
                authUrl.searchParams.append('code_challenge', codeChallenge);
                // Launch the OAuth popup
                chrome.identity.launchWebAuthFlow({
                    url: authUrl.toString(),
                    interactive: true
                }, (redirectUrl) => {
                    if (chrome.runtime.lastError) {
                        console.error('OAuth error:', chrome.runtime.lastError);
                        return;
                    }
                    if (redirectUrl) {
                        this.handleRedirect(redirectUrl);
                    }
                });
            }
            catch (error) {
                console.error('Error initiating Twitter auth:', error);
            }
        });
    }
    handleRedirect(redirectUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const url = new URL(redirectUrl);
                const code = url.searchParams.get('code');
                const returnedState = url.searchParams.get('state');
                // Verify state to prevent CSRF attacks
                const { oauth_state, code_verifier } = yield chrome.storage.local.get(['oauth_state', 'code_verifier']);
                if (returnedState !== oauth_state) {
                    throw new Error('OAuth state does not match');
                }
                if (!code || !code_verifier) {
                    throw new Error('Missing auth code or code verifier');
                }
                // Exchange code for access token
                yield this.exchangeCodeForToken(code, code_verifier);
            }
            catch (error) {
                console.error('Error handling redirect:', error);
            }
        });
    }
    exchangeCodeForToken(code, codeVerifier) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tokenUrl = twitterConfig.tokenUrl;
                const body = new URLSearchParams({
                    grant_type: 'authorization_code',
                    client_id: twitterConfig.clientId,
                    redirect_uri: twitterConfig.redirectUri,
                    code_verifier: codeVerifier,
                    code: code
                });
                const response = yield fetch(tokenUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: body.toString()
                });
                if (!response.ok) {
                    throw new Error(`Token exchange failed: ${response.status}`);
                }
                const tokenData = yield response.json();
                // Store tokens
                yield chrome.storage.local.set({
                    access_token: tokenData.access_token,
                    refresh_token: tokenData.refresh_token,
                    expires_at: Date.now() + tokenData.expires_in * 1000
                });
                // Fetch user data
                yield this.fetchUserData(tokenData.access_token);
            }
            catch (error) {
                console.error('Error exchanging code for token:', error);
            }
        });
    }
    fetchUserData(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch('https://api.twitter.com/2/users/me?user.fields=profile_image_url', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                if (!response.ok) {
                    throw new Error(`Failed to fetch user data: ${response.status}`);
                }
                const userData = yield response.json();
                const user = {
                    id: userData.data.id,
                    username: userData.data.username,
                    profile_image_url: userData.data.profile_image_url || ''
                };
                // Store user data
                yield chrome.storage.local.set({ user: user });
                // Generate or retrieve wallet for this user
                yield this.getOrCreateWallet(user);
            }
            catch (error) {
                console.error('Error fetching user data:', error);
            }
        });
    }
    getOrCreateWallet(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // First check if wallet already exists for this user
                const { wallets } = yield chrome.storage.local.get('wallets');
                const userWallets = wallets ? (wallets[user.id] || []) : null;
                if (userWallets && userWallets.length > 0) {
                    // User already has wallet(s), use the first one
                    const wallet = Object.assign(Object.assign({}, userWallets[0]), { user });
                    yield this.setCurrentWallet(wallet);
                    return;
                }
                // If no wallet exists, create one
                const wallet = yield this.createWallet(user);
                yield this.setCurrentWallet(wallet);
            }
            catch (error) {
                console.error('Error getting or creating wallet:', error);
            }
        });
    }
    createWallet(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Generate a new wallet
                const walletInstance = ethers.Wallet.createRandom();
                // Seed the wallet with a deterministic but secure seed based on the user's Twitter ID
                // NOTE: In a production app, you'd use a proper key derivation function with additional security
                const walletSeed = `twitter-${user.id}-${Date.now()}-${Math.random().toString(36).substring(2)}`;
                const derivedWallet = ethers.Wallet.fromPhrase(ethers.Mnemonic.fromEntropy(ethers.id(walletSeed)).phrase);
                // Create wallet object
                const wallet = {
                    address: derivedWallet.address,
                    balance: '0.0',
                    user,
                    privateKey: derivedWallet.privateKey // WARNING: In production, encrypt this before storing!
                };
                // Store wallet in local storage (ideally with encryption in a real app)
                yield this.saveWallet(user.id, wallet);
                return wallet;
            }
            catch (error) {
                console.error('Error creating wallet:', error);
                throw new Error('Failed to create wallet');
            }
        });
    }
    saveWallet(userId, wallet) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Fetch existing wallets
                const { wallets = {} } = yield chrome.storage.local.get('wallets');
                // Add new wallet to user's collection
                if (!wallets[userId]) {
                    wallets[userId] = [];
                }
                // Make a clean copy without the user reference to avoid circular references
                const walletToSave = Object.assign({}, wallet);
                delete walletToSave.user;
                wallets[userId].push(walletToSave);
                // Save updated wallets
                yield chrome.storage.local.set({ wallets });
            }
            catch (error) {
                console.error('Error saving wallet:', error);
            }
        });
    }
    setCurrentWallet(wallet) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Store current wallet in session
                yield chrome.storage.local.set({
                    currentWallet: wallet,
                    isAuthenticated: true
                });
                // Notify any listeners that auth state has changed
                chrome.runtime.sendMessage({
                    type: 'AUTH_STATE_CHANGED',
                    data: {
                        isAuthenticated: true,
                        currentWallet: wallet
                    }
                });
            }
            catch (error) {
                console.error('Error setting current wallet:', error);
            }
        });
    }
    getCurrentAuthState() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { isAuthenticated, currentWallet } = yield chrome.storage.local.get([
                    'isAuthenticated',
                    'currentWallet'
                ]);
                return {
                    isAuthenticated: !!isAuthenticated,
                    currentWallet: currentWallet || undefined
                };
            }
            catch (error) {
                console.error('Error getting current auth state:', error);
                return { isAuthenticated: false };
            }
        });
    }
    logout() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Clear auth data but keep wallets
                yield chrome.storage.local.remove([
                    'access_token',
                    'refresh_token',
                    'expires_at',
                    'user',
                    'currentWallet',
                    'isAuthenticated',
                    'oauth_state',
                    'code_verifier'
                ]);
                // Notify any listeners
                chrome.runtime.sendMessage({
                    type: 'AUTH_STATE_CHANGED',
                    data: {
                        isAuthenticated: false
                    }
                });
            }
            catch (error) {
                console.error('Error during logout:', error);
            }
        });
    }
    // Helper methods for PKCE
    generateCodeVerifier() {
        const array = new Uint8Array(32);
        window.crypto.getRandomValues(array);
        return this.base64UrlEncode(array);
    }
    generateCodeChallenge(codeVerifier) {
        return __awaiter(this, void 0, void 0, function* () {
            const digest = yield window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(codeVerifier));
            return this.base64UrlEncode(new Uint8Array(digest));
        });
    }
    base64UrlEncode(buffer) {
        // Convert Uint8Array to string without iteration
        const binary = Array.from(buffer)
            .map(byte => String.fromCharCode(byte))
            .join('');
        // Convert to base64 and make URL safe
        const base64 = btoa(binary)
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
        return base64;
    }
}
