import { useState, useCallback } from 'react'
import InputForm from './components/InputForm.jsx'
import CaptionCard from './components/CaptionCard.jsx'
import HashtagPanel from './components/HashtagPanel.jsx'
import { PLATFORM_ORDER, generateCaptions } from './utils/captionEngine.js'

const DEFAULT_VALUES = {
  topic: '',
  description: '',
  cta: '',
  tone: 'casual',
  includeHashtags: true,
  selectedPlatforms: [...PLATFORM_ORDER],
}

const EXAMPLE_VALUES = {
  topic: 'Launch of our new website speed optimization service for small businesses',
  description: 'We help small businesses cut page load times by 50% or more. Our service includes Core Web Vitals auditing, image compression, CDN setup, and caching optimization. Starting at $299/month with a free initial audit.',
  cta: 'Book your free speed audit',
  tone: 'casual',
  includeHashtags: true,
  selectedPlatforms: [...PLATFORM_ORDER],
}

export default function App() {
  const [formValues, setFormValues] = useState(DEFAULT_VALUES)
  const [results, setResults] = useState({})
  const [hasGenerated, setHasGenerated] = useState(false)
  const [genCounter, setGenCounter] = useState(0)

  const handleChange = useCallback((field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }))
  }, [])

  const doGenerate = useCallback((values) => {
    const { topic, description, cta, tone, includeHashtags, selectedPlatforms } = values
    if (!topic.trim() || selectedPlatforms.length === 0) return

    // Combine topic + description for richer keyword extraction
    const combinedTopic = description
      ? `${topic}. ${description}`
      : topic

    const generated = {}
    selectedPlatforms.forEach((platform) => {
      generated[platform] = generateCaptions(platform, {
        topic: combinedTopic,
        cta,
        tone,
        includeHashtags,
      })
    })
    setResults(generated)
    setHasGenerated(true)
    setGenCounter(c => c + 1)
  }, [])

  const handleGenerate = useCallback(() => {
    doGenerate(formValues)
  }, [formValues, doGenerate])

  const handleExample = useCallback(() => {
    setFormValues(EXAMPLE_VALUES)
    doGenerate(EXAMPLE_VALUES)
  }, [doGenerate])

  const fillTestData = useCallback(() => {
    const testValues = {
      topic: 'Summer sale on all web hosting plans — up to 60% off for new customers',
      description: 'Our biggest sale of the year is here. All shared hosting plans are up to 60% off for the first year, including free domain, free SSL, and unlimited email. Perfect for bloggers, small businesses, and side projects launching this summer.',
      cta: 'Grab the deal before it ends Sunday',
      tone: 'bold',
      includeHashtags: true,
      selectedPlatforms: ['instagram', 'twitter', 'linkedin'],
    }
    setFormValues(testValues)
    doGenerate(testValues)
  }, [doGenerate])

  // Determine which platforms to show in results (selected ones in order)
  const visiblePlatforms = PLATFORM_ORDER.filter((p) =>
    formValues.selectedPlatforms.includes(p)
  )

  // Get hashtag data from first platform result (same keywords apply)
  const firstResult = results[visiblePlatforms[0]]
  const hashtagData = firstResult?.hashtags
  const keywordData = firstResult?.keywords

  return (
    <div className="bg-abyss bg-glow bg-grid min-h-screen flex flex-col">
      <main className="flex-1 max-w-[1600px] mx-auto w-full px-4 py-10 md:py-12">

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
            Generate 5 unique caption angles per platform — each scored for hook strength, engagement, readability, and platform fit. Topic-relevant hashtags, not generic ones.
          </p>
        </header>

        <div className="flex justify-end mb-4">
          <button
            type="button"
            onClick={fillTestData}
            className="px-3 py-1.5 text-xs font-mono bg-prince/20 text-prince border border-prince/30 rounded hover:bg-prince/30 transition-colors focus:outline-none focus:ring-2 focus:ring-prince focus:ring-offset-2 focus:ring-offset-abyss"
          >
            Fill Test Data
          </button>
        </div>

        {/* Two-column layout: form + results */}
        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6 lg:gap-8 items-start">

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
          <div className="space-y-5">
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
              <>
                {/* Hashtag panel — shown after generation */}
                {hasGenerated && hashtagData && hashtagData.length > 0 && formValues.includeHashtags && (
                  <HashtagPanel hashtags={hashtagData} keywords={keywordData} />
                )}

                {/* Caption cards */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                  {visiblePlatforms.map((platform, index) => (
                    <div key={`${platform}-${genCounter}`} className="animate-slideUp" style={{ animationDelay: `${index * 0.08}s` }}>
                      <CaptionCard
                        platform={platform}
                        captionData={results[platform] || null}
                        hasGenerated={hasGenerated && !!results[platform]}
                      />
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Tips panel — shown after generation */}
            {hasGenerated && visiblePlatforms.length > 0 && (
              <div className="card-gradient border border-metal/20 rounded-2xl p-5 animate-fadeIn">
                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-azure" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  How to use these captions
                </h3>
                <ul className="space-y-2.5">
                  <li className="flex gap-2 text-xs text-galactic leading-relaxed">
                    <span className="text-azure font-semibold flex-shrink-0">1.</span>
                    <span><strong className="text-cloudy">Pick the highest-scoring angle</strong> — the overall score reflects hook strength, engagement potential, readability, and platform fit combined.</span>
                  </li>
                  <li className="flex gap-2 text-xs text-galactic leading-relaxed">
                    <span className="text-azure font-semibold flex-shrink-0">2.</span>
                    <span><strong className="text-cloudy">Edit in the textarea</strong> — each caption is fully editable. Personalize it with your brand voice, specific data, or customer quotes.</span>
                  </li>
                  <li className="flex gap-2 text-xs text-galactic leading-relaxed">
                    <span className="text-azure font-semibold flex-shrink-0">3.</span>
                    <span><strong className="text-cloudy">Mix hashtag tiers</strong> — combine niche (low competition) with broad (high reach) hashtags. The tiered system shows you which is which.</span>
                  </li>
                  <li className="flex gap-2 text-xs text-galactic leading-relaxed">
                    <span className="text-azure font-semibold flex-shrink-0">4.</span>
                    <span><strong className="text-cloudy">Re-generate for variety</strong> — each click produces different variations. Generate multiple times and pick your favorites.</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-metal/30 mt-12 py-6 px-4">
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-galactic">
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
