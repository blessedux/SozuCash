import { NextApiRequest, NextApiResponse } from 'next';
import { oktoSDK } from '../../lib/okto';
import { verifyAuth0Token } from '../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { auth0Token } = req.body;

    // Verify Auth0 token
    const userData = await verifyAuth0Token(auth0Token);
    if (!userData) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Initialize or get user's wallet using Okto SDK
    const wallet = await oktoSDK.auth.authenticate({
      userId: userData.sub,
      email: userData.email
    });

    // Store wallet info in your database if needed
    
    res.status(200).json({
      success: true,
      wallet: {
        address: wallet.address,
        // Add other relevant wallet info
      }
    });
  } catch (error) {
    console.error('Authentication failed:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
} 