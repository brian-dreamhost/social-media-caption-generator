import { useState, useCallback } from 'react'
import { PLATFORMS, ANGLES } from '../utils/captionEngine.js'
import { ScoreRing, ScoreBreakdown } from './ScoreBadge.jsx'
import PlatformIcon from './PlatformIcon.jsx'

const PLATFORM_COLORS = {
  instagram: 'from-[#E1306C]/20 to-transparent',
  linkedin: 'from-[#0A66C2]/20 to-transparent',
  twitter: 'from-metal/20 to-transparent',
  tiktok: 'from-[#69C9D0]/20 to-transparent',
  facebook: 'from-[#1877F2]/20 to-transparent',
}

const PLATFORM_ICON_COLORS = {
  instagram: 'text-[#E1306C]',
  linkedin: 'text-[#0A66C2]',
  twitter: 'text-white',
  tiktok: 'text-[#69C9D0]',
  facebook: 'text-[#1877F2]',
}

const ANGLE_ICONS = {
  hook: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  story: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
      <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
    </svg>
  ),
  stat: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  benefit: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  curiosity: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
}

function getCharCountColor(count, platform) {
  const { limit, preview } = PLATFORMS[platform]
  if (count > limit) return 'text-coral'
  if (count > preview) return 'text-tangerine'
  return 'text-turtle'
}

export default function CaptionCard({ platform, captionData, hasGenerated }) {
  const [activeAngle, setActiveAngle] = useState(0)
  const [editedTexts, setEditedTexts] = useState({})
  const [copied, setCopied] = useState(false)
  const [showScores, setShowScores] = useState(false)
  const platformData = PLATFORMS[platform]

  const captions = captionData?.captions || []
  const currentCaption = captions[activeAngle]
  const currentText = currentCaption
    ? (editedTexts[activeAngle] !== undefined ? editedTexts[activeAngle] : currentCaption.caption)
    : ''
  const charCount = currentText.length

  const handleTextChange = useCallback((e) => {
    setEditedTexts(prev => ({ ...prev, [activeAngle]: e.target.value }))
  }, [activeAngle])

  const handleCopy = useCallback(async () => {
    if (!currentText) return
    try {
      await navigator.clipboard.writeText(currentText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = currentText
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [currentText])

  const charColorClass = getCharCountColor(charCount, platform)
  const isOverLimit = charCount > platformData.limit

  return (
    <div className="card-gradient border border-metal/20 rounded-2xl overflow-hidden animate-fadeIn">
      {/* Platform header */}
      <div className={`flex items-center justify-between px-4 md:px-5 py-3 md:py-4 border-b border-metal/20 bg-gradient-to-r ${PLATFORM_COLORS[platform]}`}>
        <div className="flex items-center gap-2.5">
          <span className={`${PLATFORM_ICON_COLORS[platform]} flex-shrink-0`}>
            <PlatformIcon platform={platform} size={20} />
          </span>
          <span className="font-semibold text-white text-sm md:text-base">{platformData.name}</span>
        </div>
        <div className="flex items-center gap-2">
          {hasGenerated && currentCaption && (
            <ScoreRing score={currentCaption.scores.overall} size={32} strokeWidth={2.5} />
          )}
          <button
            onClick={handleCopy}
            disabled={!hasGenerated || !currentText}
            aria-label={`Copy ${platformData.name} caption`}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-azure focus:ring-offset-2 focus:ring-offset-oblivion
              ${!hasGenerated || !currentText
                ? 'opacity-30 cursor-not-allowed bg-metal/20 text-galactic'
                : copied
                  ? 'bg-turtle/20 text-turtle border border-turtle/40'
                  : 'bg-azure/20 text-azure border border-azure/40 hover:bg-azure hover:text-white'
              }`}
          >
            {copied ? (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="hidden sm:inline">Copied!</span>
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </svg>
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Angle tabs */}
      {hasGenerated && captions.length > 0 && (
        <div className="border-b border-metal/20 px-2 md:px-3">
          <div className="flex gap-0.5 overflow-x-auto scrollbar-none py-1.5" role="tablist" aria-label="Caption angles">
            {captions.map((c, idx) => {
              const angleInfo = ANGLES[c.angle]
              const isActive = idx === activeAngle
              return (
                <button
                  key={c.angle}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveAngle(idx)}
                  className={`flex items-center gap-1 px-2 md:px-2.5 py-1.5 md:py-2 rounded-lg text-[11px] md:text-xs font-medium whitespace-nowrap transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-azure min-h-[36px] flex-shrink-0
                    ${isActive
                      ? 'bg-azure/20 text-azure border border-azure/40'
                      : 'text-galactic hover:text-cloudy hover:bg-metal/10 border border-transparent'
                    }`}
                  title={angleInfo?.desc || ''}
                >
                  <span className="flex-shrink-0">{ANGLE_ICONS[c.angle]}</span>
                  <span className="hidden md:inline">{angleInfo?.label || c.angle}</span>
                  <span className={`ml-0.5 text-[10px] tabular-nums font-bold ${isActive ? 'text-azure' : 'text-metal'}`}>
                    {c.scores.overall}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Caption body */}
      <div className="p-4 md:p-5">
        {hasGenerated && currentCaption ? (
          <>
            <textarea
              value={currentText}
              onChange={handleTextChange}
              rows={7}
              aria-label={`${platformData.name} ${ANGLES[currentCaption.angle]?.label || ''} caption`}
              className={`w-full bg-midnight/60 border rounded-xl px-3 md:px-4 py-3 text-sm text-cloudy leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-azure transition-colors duration-200
                ${isOverLimit
                  ? 'border-coral/50 focus:ring-coral'
                  : 'border-metal/30 focus:ring-azure'
                }`}
              style={{ minHeight: '140px' }}
            />

            {/* Char count bar */}
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-galactic">
                {platform === 'twitter' ? `Max: ${platformData.limit}` :
                 platform === 'facebook' ? 'No strict limit' :
                 `Preview: ${platformData.preview} | Max: ${platformData.limit}`}
              </span>
              <span className={`font-medium tabular-nums ${charColorClass}`}>
                {platform === 'twitter'
                  ? `${charCount}/${platformData.limit}`
                  : `${charCount} chars`}
                {isOverLimit && ` (${charCount - platformData.limit} over)`}
              </span>
            </div>

            {/* Score toggle */}
            <button
              onClick={() => setShowScores(!showScores)}
              className="mt-3 flex items-center gap-1.5 text-xs text-galactic hover:text-azure transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-azure rounded px-1 py-1 min-h-[32px]"
              aria-expanded={showScores}
            >
              <svg
                width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                className={`transition-transform duration-200 ${showScores ? 'rotate-90' : ''}`}
                aria-hidden="true"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
              {showScores ? 'Hide' : 'Show'} score breakdown
            </button>

            {showScores && (
              <div className="mt-2 p-3 rounded-xl bg-midnight/40 border border-metal/20 animate-fadeIn">
                <ScoreBreakdown scores={currentCaption.scores} />
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-10 h-10 rounded-full bg-metal/20 flex items-center justify-center mb-3">
              <span className={`${PLATFORM_ICON_COLORS[platform]} opacity-40`}>
                <PlatformIcon platform={platform} size={18} />
              </span>
            </div>
            <p className="text-galactic text-sm">
              Fill in your details and click{' '}
              <span className="text-azure font-medium">Generate Captions</span>{' '}
              to create {platformData.name} captions with 5 different angles.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
