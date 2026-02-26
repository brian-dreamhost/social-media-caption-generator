import { useState, useCallback, useEffect } from 'react'
import { PLATFORMS } from '../utils/captionUtils.js'
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

function getCharCountColor(count, platform) {
  const { limit, preview } = PLATFORMS[platform]
  if (count > limit) return 'text-coral'
  if (count > preview) return 'text-tangerine'
  return 'text-turtle'
}

function getCharCountLabel(platform) {
  const { limit, preview } = PLATFORMS[platform]
  if (platform === 'facebook') return 'No limit'
  if (platform === 'twitter') return `/${limit} chars`
  return `Preview cutoff: ${preview} · Max: ${limit}`
}

export default function CaptionCard({ platform, caption, hasGenerated }) {
  const [text, setText] = useState(caption)
  const [copied, setCopied] = useState(false)
  const platformData = PLATFORMS[platform]
  const charCount = text.length

  // Sync local text state when a new caption is generated
  useEffect(() => {
    setText(caption)
  }, [caption])

  const handleCopy = useCallback(async () => {
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [text])

  const charColorClass = getCharCountColor(charCount, platform)
  const isOverLimit = charCount > platformData.limit
  const isOverPreview = charCount > platformData.preview && platform !== 'facebook'

  return (
    <div className="card-gradient border border-metal/20 rounded-2xl overflow-hidden animate-fadeIn">
      {/* Platform header */}
      <div className={`flex items-center justify-between px-5 py-4 border-b border-metal/20 bg-gradient-to-r ${PLATFORM_COLORS[platform]}`}>
        <div className="flex items-center gap-3">
          <span className={`${PLATFORM_ICON_COLORS[platform]} flex-shrink-0`}>
            <PlatformIcon platform={platform} size={22} />
          </span>
          <span className="font-semibold text-white text-base">{platformData.name}</span>
        </div>
        <div className="flex items-center gap-3">
          {hasGenerated && text && (
            <span className={`text-xs font-medium ${charColorClass} tabular-nums`}>
              {platform === 'twitter'
                ? `${charCount}/280`
                : platform === 'facebook'
                ? `${charCount.toLocaleString()} chars`
                : `${charCount}`}
            </span>
          )}
          <button
            onClick={handleCopy}
            disabled={!hasGenerated || !text}
            aria-label={`Copy ${platformData.name} caption`}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-azure focus:ring-offset-2 focus:ring-offset-oblivion
              ${!hasGenerated || !text
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
                Copied!
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

      {/* Caption body */}
      <div className="p-5">
        {hasGenerated && text ? (
          <>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={6}
              aria-label={`${platformData.name} caption`}
              className={`w-full bg-midnight/60 border rounded-xl px-4 py-3 text-sm text-cloudy leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-azure transition-colors duration-200
                ${isOverLimit
                  ? 'border-coral/50 focus:ring-coral'
                  : isOverPreview
                    ? 'border-tangerine/40 focus:ring-tangerine'
                    : 'border-metal/30 focus:ring-azure'
                }`}
              style={{ minHeight: '120px' }}
            />
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-galactic">{getCharCountLabel(platform)}</span>
              <span className={`text-xs font-medium tabular-nums ${charColorClass}`}>
                {isOverLimit
                  ? `${charCount - platformData.limit} over limit`
                  : isOverPreview && platform !== 'facebook'
                    ? 'Will be truncated in preview'
                    : 'Within preview limit'}
              </span>
            </div>
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
              to create your {platformData.name} caption.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
