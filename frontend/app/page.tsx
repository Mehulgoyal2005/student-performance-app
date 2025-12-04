'use client'

import { useState, FormEvent } from 'react'
import Logo from '@/components/Logo'
import ScoreDial from '@/components/ScoreDial'
import BackgroundDesign from '@/components/BackgroundDesign'

interface PredictionResponse {
  success: boolean
  prediction?: number
  error?: string
  suggestions?: string[]
}

export default function Home() {
  const [formData, setFormData] = useState({
    age: '',
    gender: 'Male',
    study_hours_per_day: '',
    social_media_hours: '',
    part_time_job: 'No',
    attendance_percentage: '',
    sleep_hours: '',
    diet_quality: 'Average',
    exercise_frequency: '',
    parental_education_level: 'High School',
    internet_Resource_accessibility: 'Average',
    extracurricular_participation: 'No',
  })

  const [prediction, setPrediction] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const scrollToForm = () => {
    const formSection = document.getElementById('prediction-form')
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setPrediction(null)
    setSuggestions([])

    try {
      const response = await fetch('http://127.0.0.1:5000/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data: PredictionResponse = await response.json()

      if (data.success && data.prediction !== undefined) {
        setPrediction(data.prediction)
        setSuggestions(data.suggestions || [])
        // Scroll to result section after prediction
        setTimeout(() => {
          const resultSection = document.getElementById('prediction-result')
          if (resultSection) {
            resultSection.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
        }, 100)
      } else {
        setError(data.error || 'Failed to get prediction')
        setSuggestions([])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative">
      {/* Background Design */}
      <BackgroundDesign />
      
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 py-12 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          {/* Logo and Title */}
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center justify-center gap-5 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                <Logo className="w-24 h-24 md:w-32 md:h-32 relative z-10" />
              </div>
              <div className="text-left">
                <h1 className="text-6xl md:text-8xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2 tracking-tight">
                  VGrade
                </h1>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <p className="text-base md:text-lg text-slate-600 font-semibold">
                    AI-Powered Performance Analytics
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Description */}
          <div className="mb-10 space-y-8 animate-fade-in-delay">
            <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed text-center">
              Predict student exam scores with{' '}
              <span className="text-blue-600 font-semibold">advanced machine learning</span>
              . Get instant, accurate performance predictions based on comprehensive student data analysis.
            </p>
            
            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-10">
              {/* Feature 1 - Instant Results */}
              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-blue-100 hover:border-blue-300 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">Instant Results</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">Get predictions in seconds with our optimized ML pipeline</p>
                </div>
              </div>

              {/* Feature 2 - AI-Powered */}
              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-indigo-100 hover:border-indigo-300 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">AI-Powered</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">Leveraging cutting-edge machine learning algorithms</p>
                </div>
              </div>

              {/* Feature 3 - Accurate Predictions */}
              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-purple-100 hover:border-purple-300 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">Accurate Predictions</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">High precision forecasts based on comprehensive data analysis</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* CTA Button */}
          <div className="animate-fade-in-delay-2">
            <button
              onClick={scrollToForm}
              className="group relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-bold py-5 px-10 rounded-2xl shadow-2xl hover:shadow-blue-500/50 transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 mx-auto overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                <span className="text-lg">Get Started</span>
                <svg className="w-5 h-5 group-hover:translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            </button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl relative z-10">

        <div className="grid lg:grid-cols-3 gap-8" id="prediction-form">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 md:p-10 lg:p-12 relative overflow-hidden">
              {/* Decorative gradient overlay */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100/30 to-purple-100/30 rounded-full blur-3xl -z-0"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-200/60">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">Student Information</h2>
                    <p className="text-sm text-slate-500 mt-1">Fill in the details to get your prediction</p>
                  </div>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Age */}
                  <div className="space-y-2 group">
                    <label htmlFor="age" className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <span>Age</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        id="age"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        min="10"
                        max="30"
                        required
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none bg-white/50 backdrop-blur-sm hover:border-blue-300 hover:bg-white group-hover:shadow-md"
                        placeholder="e.g., 18"
                      />
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Valid: 10-30 years
                    </p>
                  </div>

                  {/* Gender */}
                  <div className="space-y-2">
                    <label htmlFor="gender" className="block text-sm font-semibold text-slate-700">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none bg-white/50 backdrop-blur-sm hover:border-blue-300 hover:bg-white cursor-pointer shadow-sm hover:shadow-md"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Study Hours */}
                  <div className="space-y-2">
                    <label htmlFor="study_hours_per_day" className="block text-sm font-semibold text-slate-700">
                      Study Hours per Day <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="study_hours_per_day"
                      name="study_hours_per_day"
                      value={formData.study_hours_per_day}
                      onChange={handleChange}
                      step="0.1"
                      min="0"
                      max="24"
                      required
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none bg-white/50 backdrop-blur-sm hover:border-blue-300 hover:bg-white shadow-sm hover:shadow-md"
                      placeholder="e.g., 4.5"
                    />
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Typical: 0-12 hours
                    </p>
                  </div>

                  {/* Social Media Hours */}
                  <div className="space-y-2">
                    <label htmlFor="social_media_hours" className="block text-sm font-semibold text-slate-700">
                      Social Media Hours <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="social_media_hours"
                      name="social_media_hours"
                      value={formData.social_media_hours}
                      onChange={handleChange}
                      step="0.1"
                      min="0"
                      max="24"
                      required
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none bg-white/50 backdrop-blur-sm hover:border-blue-300 hover:bg-white shadow-sm hover:shadow-md"
                      placeholder="e.g., 2.0"
                    />
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Hours per day
                    </p>
                  </div>

                  {/* Part-time Job */}
                  <div className="space-y-2">
                    <label htmlFor="part_time_job" className="block text-sm font-semibold text-slate-700">
                      Part-time Job <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="part_time_job"
                      name="part_time_job"
                      value={formData.part_time_job}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none bg-white/50 backdrop-blur-sm hover:border-blue-300 hover:bg-white cursor-pointer shadow-sm hover:shadow-md"
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>

                  {/* Attendance Percentage */}
                  <div className="space-y-2">
                    <label htmlFor="attendance_percentage" className="block text-sm font-semibold text-slate-700">
                      Attendance Percentage <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="attendance_percentage"
                      name="attendance_percentage"
                      value={formData.attendance_percentage}
                      onChange={handleChange}
                      min="0"
                      max="100"
                      step="0.1"
                      required
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none bg-white/50 backdrop-blur-sm hover:border-blue-300 hover:bg-white shadow-sm hover:shadow-md"
                      placeholder="e.g., 85.5"
                    />
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Valid: 0-100%
                    </p>
                  </div>

                  {/* Sleep Hours */}
                  <div className="space-y-2">
                    <label htmlFor="sleep_hours" className="block text-sm font-semibold text-slate-700">
                      Sleep Duration <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="sleep_hours"
                      name="sleep_hours"
                      value={formData.sleep_hours}
                      onChange={handleChange}
                      step="0.1"
                      min="0"
                      max="24"
                      required
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none bg-white/50 backdrop-blur-sm hover:border-blue-300 hover:bg-white shadow-sm hover:shadow-md"
                      placeholder="e.g., 7.5"
                    />
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                      Recommended: 6-9 hours
                    </p>
                  </div>

                  {/* Diet Quality */}
                  <div className="space-y-2">
                    <label htmlFor="diet_quality" className="block text-sm font-semibold text-slate-700">
                      Diet Quality <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="diet_quality"
                      name="diet_quality"
                      value={formData.diet_quality}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none bg-white/50 backdrop-blur-sm hover:border-blue-300 hover:bg-white cursor-pointer shadow-sm hover:shadow-md"
                    >
                      <option value="Poor">Poor</option>
                      <option value="Average">Average</option>
                      <option value="Good">Good</option>
                      <option value="Excellent">Excellent</option>
                    </select>
                  </div>

                  {/* Exercise Frequency */}
                  <div className="space-y-2">
                    <label htmlFor="exercise_frequency" className="block text-sm font-semibold text-slate-700">
                      Exercise Frequency
                    </label>
                    <input
                      type="number"
                      id="exercise_frequency"
                      name="exercise_frequency"
                      value={formData.exercise_frequency}
                      onChange={handleChange}
                      min="0"
                      max="7"
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none bg-white/50 backdrop-blur-sm hover:border-blue-300 hover:bg-white shadow-sm hover:shadow-md"
                      placeholder="e.g., 3"
                    />
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Days per week (0-7)
                    </p>
                  </div>

                  {/* Parental Education Level */}
                  <div className="space-y-2">
                    <label htmlFor="parental_education_level" className="block text-sm font-semibold text-slate-700">
                      Parental Education Level <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="parental_education_level"
                      name="parental_education_level"
                      value={formData.parental_education_level}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none bg-white/50 backdrop-blur-sm hover:border-blue-300 hover:bg-white cursor-pointer shadow-sm hover:shadow-md"
                    >
                      <option value="None">None</option>
                      <option value="High School">High School</option>
                      <option value="Bachelor">Bachelor</option>
                      <option value="Master">Master</option>
                    </select>
                  </div>

                  {/* Internet Resource Accessibility */}
                  <div className="space-y-2">
                    <label htmlFor="internet_Resource_accessibility" className="block text-sm font-semibold text-slate-700">
                      Internet Access <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="internet_Resource_accessibility"
                      name="internet_Resource_accessibility"
                      value={formData.internet_Resource_accessibility}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none bg-white/50 backdrop-blur-sm hover:border-blue-300 hover:bg-white cursor-pointer shadow-sm hover:shadow-md"
                    >
                      <option value="Poor">Poor</option>
                      <option value="Average">Average</option>
                      <option value="Good">Good</option>
                    </select>
                  </div>

                  {/* Extracurricular Participation */}
                  <div className="space-y-2">
                    <label htmlFor="extracurricular_participation" className="block text-sm font-semibold text-slate-700">
                      Extracurricular Participation <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="extracurricular_participation"
                      name="extracurricular_participation"
                      value={formData.extracurricular_participation}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none bg-white/50 backdrop-blur-sm hover:border-blue-300 hover:bg-white cursor-pointer shadow-sm hover:shadow-md"
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-8 border-t border-slate-200/60 mt-8">
                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-bold py-5 px-6 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-blue-500/50 transform hover:-translate-y-1 transition-all duration-300 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex items-center justify-center gap-3 overflow-hidden"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-lg">Analyzing Data...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-6 h-6 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span className="text-lg">Predict Score</span>
                      </>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  </button>
                </div>
                </form>
              </div>
            </div>
          </div>

          {/* Prediction Result Section */}
          <div className="lg:col-span-1" id="prediction-result">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 sticky top-8 relative overflow-hidden">
              {/* Decorative gradient overlay */}
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-indigo-100/40 to-purple-100/40 rounded-full blur-3xl -z-0"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-200/60">
                  <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">Prediction Result</h2>
                    <p className="text-sm text-slate-500 mt-1">Your performance score</p>
                  </div>
                </div>
              
              {loading && (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-100"></div>
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
                  </div>
                  <p className="mt-4 text-slate-600 font-medium">Analyzing data...</p>
                  <p className="mt-1 text-sm text-slate-500">This may take a moment</p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-red-800 text-sm font-bold mb-1">Prediction Error</p>
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {prediction !== null && !loading && !error && (
                <div className="text-center">
                  {/* Animated Dial */}
                  <div className="mb-6 flex justify-center">
                    <ScoreDial score={prediction} size={220} />
                  </div>
                  
                  {/* Score Interpretation */}
                  <div className="mt-6 space-y-4">
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600 font-medium text-sm">Performance Level:</span>
                        <span className={`font-bold text-base px-3 py-1 rounded-lg ${
                          prediction >= 80 ? 'bg-green-100 text-green-700' :
                          prediction >= 60 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {prediction >= 80 ? 'Excellent' :
                           prediction >= 60 ? 'Good' :
                           'Needs Improvement'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-slate-500 font-medium">
                        <span>Score Breakdown</span>
                        <span>{prediction.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden shadow-inner">
                        <div
                          className={`h-3 rounded-full transition-all duration-700 ease-out shadow-sm ${
                            prediction >= 80 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                            prediction >= 60 ? 'bg-gradient-to-r from-yellow-500 to-amber-500' :
                            'bg-gradient-to-r from-red-500 to-rose-500'
                          }`}
                          style={{ width: `${prediction}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* AI Suggestions */}
                  {suggestions.length > 0 && (
                    <div className="mt-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200/50">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg">
                          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-slate-800">Improvement Suggestions</h3>
                          <p className="text-xs text-slate-500 mt-0.5">Personalized recommendations for better performance</p>
                        </div>
                      </div>
                      <ul className="space-y-3">
                        {suggestions.map((suggestion, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                              {index + 1}
                            </div>
                            <p className="text-slate-700 text-sm leading-relaxed flex-1">{suggestion}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {!prediction && !loading && !error && (
                <div className="text-center py-12">
                  <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-6">
                    <svg className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-slate-700 font-semibold mb-2">Ready to Predict</h3>
                  <p className="text-sm text-slate-500 max-w-xs mx-auto">
                    Fill out the form on the left and click "Predict Score" to get instant performance predictions
                  </p>
                </div>
              )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-16 pt-12 border-t border-slate-200/60 relative z-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Logo className="w-8 h-8" />
            <p className="text-slate-700 font-bold text-lg">VGrade</p>
          </div>
          <p className="text-slate-600 text-base font-medium mb-2">AI-Powered Student Performance Prediction System</p>
          <div className="flex items-center justify-center gap-6 mt-6 mb-4">
            <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
            <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
              </svg>
            </a>
          </div>
          <p className="text-slate-400 text-xs mt-4">© 2024 VGrade. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}

