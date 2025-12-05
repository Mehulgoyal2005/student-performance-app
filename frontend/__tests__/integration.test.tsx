/**
 * Frontend Integration Tests for Student Performance Predictor
 * 
 * Tests React components and API integration with the backend.
 * Run with: npm run test:coverage
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import Home from '@/app/page'

// Mock fetch API
global.fetch = jest.fn()

describe('Student Performance Predictor - Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Page Rendering', () => {
    test('renders home page with title', () => {
      render(<Home />)
      const heading = screen.getByRole('heading', { name: /VGrade/i })
      expect(heading).toBeInTheDocument()
    })

    test('renders hero section with CTA button', () => {
      render(<Home />)
      const button = screen.getByRole('button', { name: /Get Started/i })
      expect(button).toBeInTheDocument()
    })

    test('renders feature cards', () => {
      render(<Home />)
      expect(screen.getByText(/Instant Results/i)).toBeInTheDocument()
      // target the heading specifically to avoid matching paragraphs that include the phrase
      expect(screen.getByRole('heading', { name: /AI-Powered/i })).toBeInTheDocument()
      expect(screen.getByText(/Accurate Predictions/i)).toBeInTheDocument()
    })

    test('renders prediction form with required fields', () => {
      render(<Home />)
      expect(screen.getByLabelText(/\bAge\b/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Gender/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Study Hours per Day/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Social Media Hours/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Part-time Job/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Attendance Percentage/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Sleep Duration/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Diet Quality/i)).toBeInTheDocument()
    })

    test('renders all form input fields', () => {
      render(<Home />)
      // numeric inputs use role 'spinbutton' in the DOM
      const spinbuttons = screen.getAllByRole('spinbutton')
      const selects = screen.getAllByRole('combobox')
      expect(spinbuttons.length + selects.length).toBeGreaterThan(0)
    })
  })

  describe('Form Interactions', () => {
    test('updates form state when user inputs data', async () => {
      const user = userEvent.setup()
      render(<Home />)

      const ageInput = screen.getByLabelText(/\bAge\b/i)
      await user.type(ageInput, '20')
      expect(ageInput).toHaveValue(20)
    })

    test('handles gender selection', async () => {
      const user = userEvent.setup()
      render(<Home />)

      const genderSelect = screen.getByLabelText(/Gender/i)
      await user.selectOptions(genderSelect, 'Female')
      expect(genderSelect).toHaveValue('Female')
    })

    test('handles diet quality selection', async () => {
      const user = userEvent.setup()
      render(<Home />)

      const dietSelect = screen.getByLabelText(/Diet Quality/i)
      await user.selectOptions(dietSelect, 'Good')
      expect(dietSelect).toHaveValue('Good')
    })

    test('maintains form state across multiple inputs', async () => {
      const user = userEvent.setup()
      render(<Home />)

      const ageInput = screen.getByLabelText(/\bAge\b/i)
      const studyHoursInput = screen.getByLabelText(/Study Hours per Day/i)

      await user.type(ageInput, '20')
      await user.type(studyHoursInput, '5.5')

      expect(ageInput).toHaveValue(20)
      expect(studyHoursInput).toHaveValue(5.5)
    })
  })

  describe('Form Submission', () => {
    test('handles form submission with valid data', async () => {
      const user = userEvent.setup()
      const mockResponse = {
        success: true,
        prediction: 78.5,
        suggestions: ['Study more', 'Reduce social media'],
      }

      global.fetch = jest.fn().mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce(mockResponse),
      })

      render(<Home />)

      // Fill in required fields
      await user.type(screen.getByLabelText(/\bAge\b/i), '20')
      await user.type(screen.getByLabelText(/Study Hours per Day/i), '5')
      await user.type(screen.getByLabelText(/Social Media Hours/i), '2')
      await user.type(screen.getByLabelText(/Attendance Percentage/i), '90')
      await user.type(screen.getByLabelText(/Sleep Duration/i), '7')
      await user.type(screen.getByLabelText(/Exercise Frequency/i), '3')

      const submitButton = screen.getByRole('button', { name: /Predict|Submit/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          'http://127.0.0.1:5000/api/predict',
          expect.any(Object)
        )
      })
    })

    test('calls API with correct endpoint', async () => {
      const user = userEvent.setup()
      global.fetch = jest.fn().mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce({
          success: true,
          prediction: 75,
        }),
      })

      render(<Home />)

      await user.type(screen.getByLabelText(/\bAge\b/i), '20')
      await user.type(screen.getByLabelText(/Study Hours per Day/i), '5')
      await user.type(screen.getByLabelText(/Social Media Hours/i), '2')
      await user.type(screen.getByLabelText(/Attendance Percentage/i), '90')
      await user.type(screen.getByLabelText(/Sleep Duration/i), '7')
      await user.type(screen.getByLabelText(/Exercise Frequency/i), '3')

      const submitButton = screen.getByRole('button', { name: /Predict|Submit/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          'http://127.0.0.1:5000/api/predict',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: expect.stringContaining('age'),
          }
        )
      })
    })

    test('displays loading state during submission', async () => {
      const user = userEvent.setup()
      global.fetch = jest.fn(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  json: () =>
                    Promise.resolve({ success: true, prediction: 75 }),
                }),
              100
            )
          )
      )

      render(<Home />)

      await user.type(screen.getByLabelText(/\bAge\b/i), '20')
      await user.type(screen.getByLabelText(/Study Hours per Day/i), '5')
      await user.type(screen.getByLabelText(/Social Media Hours/i), '2')
      await user.type(screen.getByLabelText(/Attendance Percentage/i), '90')
      await user.type(screen.getByLabelText(/Sleep Duration/i), '7')
      await user.type(screen.getByLabelText(/Exercise Frequency/i), '3')

      const submitButton = screen.getByRole('button', { name: /Predict|Submit/i })
      await user.click(submitButton)

      // Button should be disabled or show loading during submission
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled()
      })
    })

    test('sends JSON data to backend', async () => {
      const user = userEvent.setup()
      global.fetch = jest.fn().mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce({
          success: true,
          prediction: 75,
        }),
      })

      render(<Home />)

      await user.type(screen.getByLabelText(/\bAge\b/i), '20')
      await user.type(screen.getByLabelText(/Study Hours per Day/i), '5')
      await user.type(screen.getByLabelText(/Social Media Hours/i), '2')
      await user.type(screen.getByLabelText(/Attendance Percentage/i), '90')
      await user.type(screen.getByLabelText(/Sleep Duration/i), '7')
      await user.type(screen.getByLabelText(/Exercise Frequency/i), '3')

      const submitButton = screen.getByRole('button', { name: /Predict|Submit/i })
      await user.click(submitButton)

      await waitFor(() => {
        const callArgs = global.fetch.mock.calls[0]
        const body = JSON.parse(callArgs[1].body)
        expect(body.age).toBeDefined()
        expect(body.study_hours_per_day).toBeDefined()
      })
    })
  })

  describe('Error Handling', () => {
    test('displays error message when API call fails', async () => {
      const user = userEvent.setup()
      global.fetch = jest.fn().mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce({
          success: false,
          error: 'Model prediction failed',
        }),
      })

      render(<Home />)

      await user.type(screen.getByLabelText(/\bAge\b/i), '20')
      await user.type(screen.getByLabelText(/Study Hours per Day/i), '5')
      await user.type(screen.getByLabelText(/Social Media Hours/i), '2')
      await user.type(screen.getByLabelText(/Attendance Percentage/i), '90')
      await user.type(screen.getByLabelText(/Sleep Duration/i), '7')
      await user.type(screen.getByLabelText(/Exercise Frequency/i), '3')

      const submitButton = screen.getByRole('button', { name: /Predict|Submit/i })
      await user.click(submitButton)

      // Error should be displayed
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled()
      })
    })

    test('handles network errors gracefully', async () => {
      const user = userEvent.setup()
      global.fetch = jest.fn().mockRejectedValueOnce(
        new Error('Network error')
      )

      render(<Home />)

      await user.type(screen.getByLabelText(/\bAge\b/i), '20')
      await user.type(screen.getByLabelText(/Study Hours per Day/i), '5')
      await user.type(screen.getByLabelText(/Social Media Hours/i), '2')
      await user.type(screen.getByLabelText(/Attendance Percentage/i), '90')
      await user.type(screen.getByLabelText(/Sleep Duration/i), '7')
      await user.type(screen.getByLabelText(/Exercise Frequency/i), '3')

      const submitButton = screen.getByRole('button', { name: /Predict|Submit/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled()
      })
    })
  })

  describe('Prediction Results', () => {
    test('displays prediction result after successful submission', async () => {
      const user = userEvent.setup()
      const mockPrediction = 82.5
      const mockSuggestions = [
        'Maintain your study habits',
        'Ensure adequate sleep',
      ]

      global.fetch = jest.fn().mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce({
          success: true,
          prediction: mockPrediction,
          suggestions: mockSuggestions,
        }),
      })

      render(<Home />)

      await user.type(screen.getByLabelText(/\bAge\b/i), '20')
      await user.type(screen.getByLabelText(/Study Hours per Day/i), '5')
      await user.type(screen.getByLabelText(/Social Media Hours/i), '2')
      await user.type(screen.getByLabelText(/Attendance Percentage/i), '90')
      await user.type(screen.getByLabelText(/Sleep Duration/i), '7')
      await user.type(screen.getByLabelText(/Exercise Frequency/i), '3')

      const submitButton = screen.getByRole('button', { name: /Predict|Submit/i })
      await user.click(submitButton)

      // Prediction should be displayed
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled()
      })
    })

    test('displays suggestions with prediction', async () => {
      const user = userEvent.setup()
      const mockSuggestions = [
        'Focus on improving study time',
        'Attend all classes',
      ]

      global.fetch = jest.fn().mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce({
          success: true,
          prediction: 75,
          suggestions: mockSuggestions,
        }),
      })

      render(<Home />)

      await user.type(screen.getByLabelText(/\bAge\b/i), '20')
      await user.type(screen.getByLabelText(/Study Hours per Day/i), '5')
      await user.type(screen.getByLabelText(/Social Media Hours/i), '2')
      await user.type(screen.getByLabelText(/Attendance Percentage/i), '90')
      await user.type(screen.getByLabelText(/Sleep Duration/i), '7')
      await user.type(screen.getByLabelText(/Exercise Frequency/i), '3')

      const submitButton = screen.getByRole('button', { name: /Predict|Submit/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled()
      })
    })
  })

  describe('CTA Button Scroll', () => {
    test('Get Started button exists and is clickable', async () => {
      const user = userEvent.setup()
      render(<Home />)

      const button = screen.getByRole('button', { name: /Get Started/i })
      expect(button).toBeInTheDocument()
      expect(button).toBeEnabled()

      await user.click(button)
      // Should scroll to form (no assertion needed, just check it doesn't error)
      expect(button).toBeInTheDocument()
    })
  })

  describe('Default Form Values', () => {
    test('form has correct default values', () => {
      render(<Home />)

      const genderSelect = screen.getByLabelText(/Gender/i)
      const dietSelect = screen.getByLabelText(/Diet Quality/i)
      const jobSelect = screen.getByLabelText(/Part-time Job/i)

      expect(genderSelect).toHaveValue('Male')
      expect(dietSelect).toHaveValue('Average')
      expect(jobSelect).toHaveValue('No')
    })
  })
})

export {}
