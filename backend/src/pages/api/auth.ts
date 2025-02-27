import { NextApiRequest, NextApiResponse } from 'next';
import { OktoSDK } from '@okto/sdk';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { auth0Token } = req.body;
    // Initialize Okto SDK
    const okto = new OktoSDK({
      // Your Okto configuration
    });

    // Handle authentication and wallet creation
    const result = await okto.auth.authenticate(auth0Token);
    
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Authentication failed' });
  }
} 