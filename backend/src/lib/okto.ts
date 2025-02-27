import { OktoSDK } from '@okto/sdk';

export const oktoSDK = new OktoSDK({
  apiKey: process.env.OKTO_API_KEY,
  environment: process.env.NODE_ENV === 'production' ? 'mainnet' : 'testnet',
  // Add other required configuration
}); 