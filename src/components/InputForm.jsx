import { PLATFORMS, PLATFORM_ORDER, TONES } from '../utils/captionEngine.js'
import PlatformIcon from './PlatformIcon.jsx'

const PLATFORM_LABELS = {
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  twitter: 'X (Twitter)',
  tiktok: 'TikTok',
  facebook: 'Facebook',
}

const PLATFORM_ICON_COLORS = {
  instagram: 'text-[#E1306C]',
  linkedin: 'text-[#0A66C2]',
  twitter: 'text-white',
  tiktok: 'text-[#69C9D0]',
  facebook: 'text-[#1877F2]',
}

export default function InputForm({ values, onChange, onGenerate, onExample }) {
  const { topic, description, cta, tone, includeHashtags, selectedPlatforms } = values

  function togglePlatform(p) {
    const next = selectedPlatforms.includes(p)
      ? selectedPlatforms.filter((x) => x !== p)
      : [...selectedPlatforms, p]
    onChange('selectedPlatforms', next)
  }

  const allSelected = selectedPlatforms.length === PLATFORM_ORDER.length
  const noneSelected = selectedPlatforms.length === 0

  function handleSelectAll() {
    onChange('selectedPlatforms', allSelected ? [] : [...PLATFORM_ORDER])
  }

  const canGenerate = topic.trim().length > 0 && selectedPlatforms.length > 0

  return (
    <div className="card-gradient border border-metal/20 rounded-2xl p-4 md:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="text-lg font-bold text-white">Caption Details</h2>
        <button
          type="button"
          onClick={onExample}
          className="text-sm text-azure hover:text-white transition-colors duration-200 flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-azure rounded-lg px-2 py-2 min-h-[36px]"
          aria-label="Load example data"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
          Load Example
        </button>
      </div>

      <div className="space-y-5">
        {/* Topic */}
        <div>
          <label htmlFor="topic" className="block text-sm font-semibold text-cloudy mb-2">
            Topic / Subject <span className="text-coral" aria-hidden="true">*</span>
          </label>
          <input
            id="topic"
            type="text"
            value={topic}
            onChange={(e) => onChange('topic', e.target.value)}
            placeholder="e.g. Launch of our new website speed optimization service"
            required
            aria-required="true"
            className="w-full bg-midnight/60 border border-metal/30 rounded-xl px-4 py-3 text-sm text-white placeholder-galactic focus:outline-none focus:ring-2 focus:ring-azure focus:border-azure/50 transition-colors duration-200"
          />
          <p className="mt-1.5 text-xs text-galactic">
            Keywords are extracted from this to generate relevant hashtags. Be specific.
          </p>
        </div>

        {/* Description / Extra context */}
        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-cloudy mb-2">
            Details / Key Points <span className="text-galactic font-normal">(optional)</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => onChange('description', e.target.value)}
            placeholder="Add key details, benefits, or context that should appear in captions. More detail = better, more specific captions."
            rows={3}
            className="w-full bg-midnight/60 border border-metal/30 rounded-xl px-4 py-3 text-sm text-white placeholder-galactic focus:outline-none focus:ring-2 focus:ring-azure focus:border-azure/50 transition-colors duration-200 resize-y"
            style={{ minHeight: '72px' }}
          />
          <p className="mt-1.5 text-xs text-galactic">
            Additional keywords here will also be used for hashtag generation.
          </p>
        </div>

        {/* CTA */}
        <div>
          <label htmlFor="cta" className="block text-sm font-semibold text-cloudy mb-2">
            Call to Action <span className="text-galactic font-normal">(optional)</span>
          </label>
          <input
            id="cta"
            type="text"
            value={cta}
            onChange={(e) => onChange('cta', e.target.value)}
            placeholder="e.g. Read the full post, Shop now, Book a free call"
            className="w-full bg-midnight/60 border border-metal/30 rounded-xl px-4 py-3 text-sm text-white placeholder-galactic focus:outline-none focus:ring-2 focus:ring-azure focus:border-azure/50 transition-colors duration-200"
          />
        </div>

        {/* Tone */}
        <div>
          <label className="block text-sm font-semibold text-cloudy mb-2">
            Tone
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" role="radiogroup" aria-label="Caption tone">
            {Object.entries(TONES).map(([key, data]) => {
              const isSelected = tone === key
              return (
                <button
                  key={key}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => onChange('tone', key)}
                  className={`flex flex-col items-start px-3 py-2.5 rounded-xl text-left border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-azure focus:ring-offset-2 focus:ring-offset-oblivion min-h-[44px]
                    ${isSelected
                      ? 'bg-azure/15 border-azure/50 ring-1 ring-azure/30'
                      : 'bg-metal/10 border-metal/20 hover:border-metal/40'
                    }`}
                >
                  <span className={`text-sm font-semibold ${isSelected ? 'text-azure' : 'text-cloudy'}`}>
                    {data.label}
                  </span>
                  <span className="text-[11px] text-galactic leading-snug mt-0.5">
                    {data.desc}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Hashtags toggle */}
        <div>
          <label className="flex items-center gap-3 cursor-pointer select-none group" htmlFor="hashtags-toggle">
            <div className="relative flex-shrink-0">
              <input
                id="hashtags-toggle"
                type="checkbox"
                checked={includeHashtags}
                onChange={(e) => onChange('includeHashtags', e.target.checked)}
                className="sr-only"
                role="switch"
                aria-checked={includeHashtags}
              />
              <div
                className={`w-11 h-6 rounded-full transition-colors duration-200 focus-within:ring-2 focus-within:ring-azure focus-within:ring-offset-2 focus-within:ring-offset-oblivion
                  ${includeHashtags ? 'bg-azure' : 'bg-metal/50'}`}
                aria-hidden="true"
              />
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200
                  ${includeHashtags ? 'translate-x-5' : 'translate-x-0'}`}
                aria-hidden="true"
              />
            </div>
            <div>
              <span className="text-sm font-semibold text-cloudy group-hover:text-white transition-colors duration-200">
                Include Hashtags
              </span>
              <p className="text-xs text-galactic mt-0.5">Generated from your topic keywords, not generic</p>
            </div>
          </label>
        </div>

        {/* Platform selector */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-cloudy" id="platforms-label">
              Platforms
            </span>
            <button
              type="button"
              onClick={handleSelectAll}
              className="text-xs text-azure hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-azure rounded px-2 py-1.5 min-h-[32px]"
              aria-label={allSelected ? 'Deselect all platforms' : 'Select all platforms'}
            >
              {allSelected ? 'Deselect all' : 'Select all'}
            </button>
          </div>
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-labelledby="platforms-label"
          >
            {PLATFORM_ORDER.map((p) => {
              const selected = selectedPlatforms.includes(p)
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => togglePlatform(p)}
                  aria-pressed={selected}
                  className={`flex items-center gap-2 px-3 py-2.5 min-h-[44px] rounded-xl text-sm font-medium border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-azure focus:ring-offset-2 focus:ring-offset-oblivion
                    ${selected
                      ? 'bg-azure/20 border-azure/60 text-white'
                      : 'bg-metal/10 border-metal/20 text-galactic hover:border-metal/40 hover:text-cloudy'
                    }`}
                >
                  <span className={selected ? PLATFORM_ICON_COLORS[p] : 'text-galactic'}>
                    <PlatformIcon platform={p} size={16} />
                  </span>
                  {PLATFORM_LABELS[p]}
                </button>
              )
            })}
          </div>
          {noneSelected && (
            <p className="mt-2 text-xs text-coral" role="alert">Select at least one platform.</p>
          )}
        </div>

        {/* Generate button */}
        <button
          type="button"
          onClick={onGenerate}
          disabled={!canGenerate}
          aria-disabled={!canGenerate}
          className={`w-full py-3.5 px-6 rounded-xl font-bold text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-azure focus:ring-offset-2 focus:ring-offset-oblivion flex items-center justify-center gap-2
            ${canGenerate
              ? 'bg-azure hover:bg-azure-hover text-white shadow-lg shadow-azure/20 hover:shadow-azure/30 active:scale-[0.99]'
              : 'bg-metal/30 text-galactic cursor-not-allowed'
            }`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          Generate 5 Caption Angles
        </button>

        <p className="text-[11px] text-galactic text-center leading-relaxed">
          Generates 5 different angles per platform: Hook, Story, Stat, Benefit, and Curiosity — each scored for effectiveness.
        </p>
      </div>
    </div>
  )
}
