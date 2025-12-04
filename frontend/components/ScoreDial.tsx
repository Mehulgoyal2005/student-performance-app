'use client'

import { useEffect, useState } from 'react'

interface ScoreDialProps {
  score: number
  size?: number
}

export default function ScoreDial({ score, size = 200 }: ScoreDialProps) {
  const [animatedScore, setAnimatedScore] = useState(0)
  const radius = size / 2 - 20
  const circumference = 2 * Math.PI * radius
  const strokeWidth = 12

  useEffect(() => {
    let startTime: number | null = null
    const duration = 1500 // 1.5 seconds

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      
      // Easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3)
      const currentScore = easeOutCubic * score
      
      setAnimatedScore(currentScore)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setAnimatedScore(score)
      }
    }

    setAnimatedScore(0)
    requestAnimationFrame(animate)
  }, [score])

  const getColor = (score: number) => {
    if (score >= 80) return '#10b981' // green
    if (score >= 60) return '#f59e0b' // yellow/amber
    return '#ef4444' // red
  }

  const getPerformanceLevel = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    return 'Needs Improvement'
  }

  const offset = circumference - (animatedScore / 100) * circumference
  const color = getColor(score)
  const performanceLevel = getPerformanceLevel(score)

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
            className="opacity-30"
          />
          {/* Animated progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-300 ease-out"
            style={{
              filter: `drop-shadow(0 0 8px ${color}40)`,
            }}
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-center">
            <div className="text-5xl font-extrabold mb-1" style={{ color }}>
              {Math.round(animatedScore)}
            </div>
            <div className="text-sm text-slate-500 font-medium">out of 100</div>
            <div 
              className="text-xs font-semibold mt-2 px-3 py-1 rounded-full"
              style={{ 
                backgroundColor: `${color}15`,
                color: color
              }}
            >
              {performanceLevel}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

