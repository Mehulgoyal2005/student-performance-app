export default function Logo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className} relative`}>
      <svg
        viewBox="0 0 140 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-2xl"
      >
        <defs>
          {/* Futuristic gradient */}
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
          
          {/* Glow effect */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          {/* Outer glow */}
          <filter id="outerGlow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
            </feMerge>
          </filter>
          
          {/* Radial gradient for depth */}
          <radialGradient id="radialGrad" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.8"/>
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.3"/>
          </radialGradient>
        </defs>
        
        {/* Outer glow circle */}
        <circle cx="70" cy="70" r="65" fill="url(#radialGrad)" filter="url(#outerGlow)" opacity="0.6"/>
        
        {/* Main background circle with gradient */}
        <circle cx="70" cy="70" r="58" fill="url(#logoGradient)" stroke="url(#logoGradient)" strokeWidth="2" filter="url(#glow)"/>
        
        {/* Inner geometric pattern */}
        <circle cx="70" cy="70" r="50" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="4 4"/>
        <circle cx="70" cy="70" r="42" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" strokeDasharray="2 2"/>
        
        {/* Tech grid lines */}
        <line x1="20" y1="70" x2="120" y2="70" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
        <line x1="70" y1="20" x2="70" y2="120" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
        <line x1="35" y1="35" x2="105" y2="105" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"/>
        <line x1="105" y1="35" x2="35" y2="105" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"/>
        
        {/* Futuristic V Shape with glow */}
        <path
          d="M 40 50 L 70 85 L 100 50"
          stroke="white"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          filter="url(#glow)"
        />
        
        {/* Inner V accent */}
        <path
          d="M 45 55 L 70 80 L 95 55"
          stroke="rgba(147, 197, 253, 0.6)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        
        {/* Grade indicator - futuristic bars */}
        <rect x="30" y="95" width="80" height="6" rx="3" fill="white" opacity="0.9" filter="url(#glow)"/>
        <rect x="35" y="105" width="70" height="4" rx="2" fill="white" opacity="0.7"/>
        <rect x="40" y="112" width="60" height="3" rx="1.5" fill="white" opacity="0.5"/>
        
        {/* Corner accent dots */}
        <circle cx="25" cy="25" r="2" fill="white" opacity="0.6"/>
        <circle cx="115" cy="25" r="2" fill="white" opacity="0.6"/>
        <circle cx="25" cy="115" r="2" fill="white" opacity="0.6"/>
        <circle cx="115" cy="115" r="2" fill="white" opacity="0.6"/>
      </svg>
    </div>
  )
}
