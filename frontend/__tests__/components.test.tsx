import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import Logo from '@/components/Logo'
import ScoreDial from '@/components/ScoreDial'

describe('UI Component smoke tests', () => {
  test('Logo renders an SVG element', () => {
    const { container } = render(<Logo />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  test('ScoreDial renders and shows performance level for high score', async () => {
    // Drive the rAF-based animation deterministically without deep recursion.
    // Queue callbacks and invoke them with increasing timestamps.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const origRAF = global.requestAnimationFrame

    const queue: FrameRequestCallback[] = []
    // @ts-ignore
    global.requestAnimationFrame = (cb: FrameRequestCallback) => {
      queue.push(cb)
      return queue.length
    }

    try {
      render(<ScoreDial score={85} size={120} />)

      // Run queued frames with increasing timestamps until queue drains or timeout
      let time = 0
      const maxTime = 2000
      while (queue.length > 0 && time <= maxTime) {
        const cbs = queue.splice(0)
        time += 16
        cbs.forEach(cb => cb(time))
      }

      // performance level text should appear
      await waitFor(() => {
        expect(screen.getByText(/Excellent/i)).toBeInTheDocument()
      })

      // numeric score should be present (rounded)
      expect(screen.getByText(/85/)).toBeInTheDocument()
      expect(screen.getByText(/out of 100/i)).toBeInTheDocument()
    } finally {
      // Restore original rAF
      // @ts-ignore
      global.requestAnimationFrame = origRAF
    }
  })
})

export {}
