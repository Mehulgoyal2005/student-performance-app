'use client'

export default function BackgroundDesign() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Animated gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      
      {/* Geometric grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="bgGrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#bgGrid)" className="text-blue-600"/>
        </svg>
      </div>
      
      {/* Floating geometric shapes */}
      <div className="absolute top-20 left-10 w-72 h-72 border border-blue-300/10 rotate-45 animate-float"></div>
      <div className="absolute top-40 right-20 w-48 h-48 border border-indigo-300/10 rotate-12 animate-float animation-delay-2000"></div>
      <div className="absolute bottom-32 left-1/4 w-64 h-64 border border-purple-300/10 -rotate-12 animate-float animation-delay-4000"></div>
      
      {/* Hexagon pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="bgHexagons" width="100" height="86.6" patternUnits="userSpaceOnUse">
              <polygon points="50,0 100,25 100,75 50,100 0,75 0,25" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#bgHexagons)" className="text-blue-500"/>
        </svg>
      </div>
      
      {/* Animated lines */}
      <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/20 to-transparent animate-pulse"></div>
      <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-400/20 to-transparent animate-pulse animation-delay-2000"></div>
      <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/20 to-transparent animate-pulse animation-delay-4000"></div>
    </div>
  )
}

