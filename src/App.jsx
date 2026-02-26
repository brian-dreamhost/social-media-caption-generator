import { useState, useCallback } from 'react'
import InputForm from './components/InputForm.jsx'
import CaptionCard from './components/CaptionCard.jsx'
import { PLATFORM_ORDER, generateCaption } from './utils/captionUtils.js'

const DEFAULT_VALUES = {
  topic: '',
  cta: '',
  tone: 'friendly',
  includeHashtags: true,
  selectedPlatforms: [...PLATFORM_ORDER],
}

const EXAMPLE_VALUES = {
  topic: 'New blog post: 5 ways to improve your website speed',
  cta: 'Read the full guide',
  tone: 'friendly',
  includeHashtags: true,
  selectedPlatforms: [...PLATFORM_ORDER],
}

export default function App() {
  const [formValues, setFormValues] = useState(DEFAULT_VALUES)
  const [captions, setCaptions] = useState({})
  const [hasGenerated, setHasGenerated] = useState(false)

  const handleChange = useCallback((field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }))
  }, [])

  const handleGenerate = useCallback(() => {
    const { topic, cta, tone, includeHashtags, selectedPlatforms } = formValues
    if (!topic.trim() || selectedPlatforms.length === 0) return
    const generated = {}
    selectedPlatforms.forEach((platform) => {
      generated[platform] = generateCaption(platform, { topic, cta, tone, includeHashtags })
    })
    setCaptions(generated)
    setHasGenerated(true)
  }, [formValues])

  const handleExample = useCallback(() => {
    setFormValues(EXAMPLE_VALUES)
    // Auto-generate after loading example
    const generated = {}
    PLATFORM_ORDER.forEach((platform) => {
      generated[platform] = generateCaption(platform, {
        topic: EXAMPLE_VALUES.topic,
        cta: EXAMPLE_VALUES.cta,
        tone: EXAMPLE_VALUES.tone,
        includeHashtags: EXAMPLE_VALUES.includeHashtags,
      })
    })
    setCaptions(generated)
    setHasGenerated(true)
  }, [])

  // Determine which platforms to show in results (selected ones in order)
  const visiblePlatforms = PLATFORM_ORDER.filter((p) =>
    formValues.selectedPlatforms.includes(p)
  )

  return (
    <div className="bg-abyss bg-glow bg-grid min-h-screen flex flex-col">
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10 md:py-12">

        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-galactic" aria-label="Breadcrumb">
          <ol className="flex items-center flex-wrap gap-1">
            <li>
              <a
                href="https://seo-tools-tau.vercel.app/"
                className="text-azure hover:text-white transition-colors duration-200"
              >
                Free Tools
              </a>
            </li>
            <li aria-hidden="true" className="mx-1 text-metal">/</li>
            <li>
              <a
                href="https://seo-tools-tau.vercel.app/social-media/"
                className="text-azure hover:text-white transition-colors duration-200"
              >
                Social Media Tools
              </a>
            </li>
            <li aria-hidden="true" className="mx-1 text-metal">/</li>
            <li className="text-cloudy" aria-current="page">Social Media Caption Generator</li>
          </ol>
        </nav>

        {/* Page header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="border border-turtle text-turtle rounded-full px-4 py-1.5 text-sm font-medium">
              Free Tool
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
            Social Media Caption Generator
          </h1>
          <p className="text-cloudy text-lg max-w-2xl leading-relaxed">
            Enter your topic, set your tone, and get platform-optimized captions for Instagram, LinkedIn, X, TikTok, and Facebook — instantly, no sign-up required.
          </p>
        </header>

        {/* Two-column layout: form + results */}
        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-8 items-start">

          {/* Left: Form */}
          <div className="lg:sticky lg:top-8">
            <InputForm
              values={formValues}
              onChange={handleChange}
              onGenerate={handleGenerate}
              onExample={handleExample}
            />
          </div>

          {/* Right: Caption cards */}
          <div>
            {visiblePlatforms.length === 0 ? (
              <div className="card-gradient border border-metal/20 rounded-2xl p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-metal/20 flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-galactic">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M3 9h18M9 21V9" />
                  </svg>
                </div>
                <p className="text-galactic text-sm">Select at least one platform to see captions.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {visiblePlatforms.map((platform) => (
                  <CaptionCard
                    key={platform}
                    platform={platform}
                    caption={captions[platform] || ''}
                    hasGenerated={hasGenerated && !!captions[platform]}
                  />
                ))}
              </div>
            )}

            {/* Tips panel — shown after generation */}
            {hasGenerated && visiblePlatforms.length > 0 && (
              <div className="mt-6 card-gradient border border-metal/20 rounded-2xl p-5 animate-fadeIn">
                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-azure" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  Tips for better performance
                </h3>
                <ul className="space-y-2">
                  {[
                    { label: 'Instagram', tip: 'Post during peak hours (6–9 AM or 6–8 PM) and reply to comments within the first hour to boost reach.' },
                    { label: 'LinkedIn', tip: 'Tuesday–Thursday mornings drive the highest B2B engagement. End with a question to encourage comments.' },
                    { label: 'X (Twitter)', tip: 'Threads outperform single tweets. Consider turning this into a 3-tweet thread for more impressions.' },
                    { label: 'TikTok', tip: 'The caption matters less — focus on a strong hook in the first 2 seconds of your video.' },
                    { label: 'Facebook', tip: 'Native video and link-in-comment posts often outperform posts with external links in the caption.' },
                  ]
                    .filter(({ label }) => visiblePlatforms.some((p) =>
                      (p === 'twitter' && label === 'X (Twitter)') || p === label.toLowerCase()
                    ))
                    .map(({ label, tip }) => (
                      <li key={label} className="flex gap-2 text-xs text-galactic leading-relaxed">
                        <span className="text-azure font-semibold flex-shrink-0 w-16">{label}:</span>
                        <span>{tip}</span>
                      </li>
                    ))
                  }
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-metal/30 mt-12 py-6 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-galactic">
          <p>
            Free marketing tools by{' '}
            <a
              href="https://www.dreamhost.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-azure hover:text-white transition-colors duration-200"
            >
              DreamHost
            </a>
          </p>
          <p className="text-xs">Captions generated client-side — your data never leaves your browser.</p>
        </div>
      </footer>
    </div>
  )
}
