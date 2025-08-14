import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return new Response(
        JSON.stringify({ error: 'Invoice ID is required' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        }
      )
    }

    // For demo purposes, return a mock invoice
    const mockInvoice = {
      v: 1,
      net: "mantle",
      token: "USDC",
      dec: 6,
      to: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
      amt: "1250000", // $1.25
      memo: "Demo payment for Sozu Cash",
      nonce: "0x" + Math.random().toString(16).substring(2, 42),
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
      sig: "0x" + Math.random().toString(16).substring(2, 130),
    }

    return new Response(JSON.stringify(mockInvoice), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, max-age=300', // 5 minutes
      },
    })

  } catch (error) {
    console.error('Error resolving invoice:', error)
    
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    )
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
