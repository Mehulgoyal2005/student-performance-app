// Jest setup file
import '@testing-library/jest-dom'

// Mock fetch for tests
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
)

// Reset fetch mock after each test
afterEach(() => {
  jest.clearAllMocks()
})

// Mock scrollIntoView which is not implemented in JSDOM
if (typeof window !== 'undefined' && window.HTMLElement && !window.HTMLElement.prototype.scrollIntoView) {
  window.HTMLElement.prototype.scrollIntoView = function() {}
}
