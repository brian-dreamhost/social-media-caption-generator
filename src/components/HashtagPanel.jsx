// Hashtag panel showing generated hashtags with tier badges

const TIER_STYLES = {
  high:   { label: 'Broad', color: 'text-coral',     border: 'border-coral/30',  bg: 'bg-coral/10',     dot: 'bg-coral' },
  medium: { label: 'Medium', color: 'text-tangerine', border: 'border-tangerine/30', bg: 'bg-tangerine/10', dot: 'bg-tangerine' },
  niche:  { label: 'Niche', color: 'text-turtle',    border: 'border-turtle/30', bg: 'bg-turtle/10',    dot: 'bg-turtle' },
}

export default function HashtagPanel({ hashtags, keywords }) {
  if (!hashtags || hashtags.length === 0) return null

  // Group by tier for display
  const byTier = { niche: [], medium: [], high: [] }
  for (const h of hashtags) {
    byTier[h.tier]?.push(h)
  }

  const allTags = hashtags.map(h => h.tag).join(' ')

  return (
    <div className="card-gradient border border-metal/20 rounded-2xl p-4 md:p-5 animate-fadeIn">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-azure" aria-hidden="true">
            <line x1="4" y1="9" x2="20" y2="9" />
            <line x1="4" y1="15" x2="20" y2="15" />
            <line x1="10" y1="3" x2="8" y2="21" />
            <line x1="16" y1="3" x2="14" y2="21" />
          </svg>
          Generated Hashtags
        </h3>
        <CopyButton text={allTags} label="Copy all hashtags" />
      </div>

      {/* Keywords extracted */}
      {keywords?.single?.length > 0 && (
        <div className="mb-3">
          <p className="text-[11px] text-galactic mb-1.5 uppercase tracking-wide font-medium">Extracted keywords</p>
          <div className="flex flex-wrap gap-1.5">
            {keywords.single.slice(0, 10).map(kw => (
              <span key={kw} className="px-2 py-0.5 rounded-md bg-midnight text-xs text-cloudy border border-metal/20">
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tier legend */}
      <div className="flex gap-4 mb-3 text-[11px]">
        {Object.entries(TIER_STYLES).map(([tier, style]) => (
          <div key={tier} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${style.dot}`} />
            <span className={`${style.color} font-medium`}>{style.label}</span>
            <span className="text-galactic">
              {tier === 'niche' ? '= less competition' : tier === 'high' ? '= wide reach' : '= balanced'}
            </span>
          </div>
        ))}
      </div>

      {/* Hashtag chips */}
      <div className="flex flex-wrap gap-1.5">
        {hashtags.map((h, i) => {
          const style = TIER_STYLES[h.tier] || TIER_STYLES.medium
          return (
            <span
              key={i}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border ${style.border} ${style.bg} ${style.color} cursor-default`}
              title={`Source: ${h.source} | Reach: ${style.label}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${style.dot} flex-shrink-0`} />
              {h.tag}
            </span>
          )
        })}
      </div>
    </div>
  )
}

function CopyButton({ text, label }) {
  const [copied, setCopied] = React.useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      onClick={handleCopy}
      aria-label={label}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-azure focus:ring-offset-2 focus:ring-offset-oblivion
        ${copied
          ? 'bg-turtle/20 text-turtle border border-turtle/40'
          : 'bg-metal/20 text-galactic border border-metal/30 hover:bg-azure/20 hover:text-azure hover:border-azure/40'
        }`}
    >
      {copied ? (
        <>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
          </svg>
          Copy All
        </>
      )}
    </button>
  )
}

import React from 'react'
