'use client'

export default function TestBlendPage() {
  return (
    <div className="min-h-screen p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-8">Mix-Blend-Mode Test Page</h1>
      
      {/* Test 1: Red Background */}
      <div className="p-8 bg-red-500 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Red Background Test</h2>
        <p 
          className="text-white text-xl mix-blend-difference"
          style={{
            mixBlendMode: 'difference',
            color: '#ffffff',
            WebkitTextFillColor: '#ffffff',
            textShadow: 'none'
          }}
        >
          This text should appear CYAN on red background
        </p>
      </div>

      {/* Test 2: Blue Background */}
      <div className="p-8 bg-blue-500 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Blue Background Test</h2>
        <p 
          className="text-white text-xl mix-blend-difference"
          style={{
            mixBlendMode: 'difference',
            color: '#ffffff',
            WebkitTextFillColor: '#ffffff',
            textShadow: 'none'
          }}
        >
          This text should appear YELLOW on blue background
        </p>
      </div>

      {/* Test 3: Green Background */}
      <div className="p-8 bg-green-500 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Green Background Test</h2>
        <p 
          className="text-white text-xl mix-blend-difference"
          style={{
            mixBlendMode: 'difference',
            color: '#ffffff',
            WebkitTextFillColor: '#ffffff',
            textShadow: 'none'
          }}
        >
          This text should appear MAGENTA on green background
        </p>
      </div>

      {/* Test 4: Black Background */}
      <div className="p-8 bg-black rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Black Background Test</h2>
        <p 
          className="text-white text-xl mix-blend-difference"
          style={{
            mixBlendMode: 'difference',
            color: '#ffffff',
            WebkitTextFillColor: '#ffffff',
            textShadow: 'none'
          }}
        >
          This text should appear WHITE on black background
        </p>
      </div>

      {/* Test 5: White Background */}
      <div className="p-8 bg-white rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-black">White Background Test</h2>
        <p 
          className="text-white text-xl mix-blend-difference"
          style={{
            mixBlendMode: 'difference',
            color: '#ffffff',
            WebkitTextFillColor: '#ffffff',
            textShadow: 'none'
          }}
        >
          This text should appear BLACK on white background
        </p>
      </div>

      {/* Test 6: SVG Logo Test */}
      <div className="p-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">SVG Logo Test</h2>
        <img
          src="/sozu-logo.svg"
          alt="Sozu Cash"
          width={200}
          height={75}
          className="mix-blend-difference"
          style={{
            mixBlendMode: 'difference',
            color: '#ffffff',
            WebkitTextFillColor: '#ffffff',
            textShadow: 'none'
          }}
        />
      </div>

      {/* Test 7: Normal Text for Comparison */}
      <div className="p-8 bg-gray-500 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Normal Text (No Blend)</h2>
        <p className="text-white text-xl">
          This is normal white text for comparison
        </p>
      </div>
    </div>
  )
}
