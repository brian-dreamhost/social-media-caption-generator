// Score visualization — ring + number + label

function getScoreColor(score) {
  if (score >= 80) return { text: 'text-turtle', stroke: '#00CAAA', bg: 'bg-turtle/10' }
  if (score >= 60) return { text: 'text-azure', stroke: '#0073EC', bg: 'bg-azure/10' }
  if (score >= 40) return { text: 'text-tangerine', stroke: '#F59D00', bg: 'bg-tangerine/10' }
  return { text: 'text-coral', stroke: '#FF4A48', bg: 'bg-coral/10' }
}

export function ScoreRing({ score, size = 40, strokeWidth = 3 }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const colors = getScoreColor(score)

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke="currentColor" className="text-metal/30"
          strokeWidth={strokeWidth} fill="none"
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke={colors.stroke}
          strokeWidth={strokeWidth} fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <span className={`absolute text-xs font-bold ${colors.text} tabular-nums`}>
        {score}
      </span>
    </div>
  )
}

export function ScoreBar({ label, score }) {
  const colors = getScoreColor(score)

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-galactic w-20 flex-shrink-0 truncate">{label}</span>
      <div className="flex-1 h-1.5 bg-metal/20 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${score}%`, backgroundColor: colors.stroke }}
        />
      </div>
      <span className={`text-xs font-semibold tabular-nums w-7 text-right ${colors.text}`}>{score}</span>
    </div>
  )
}

export function ScoreBreakdown({ scores, compact = false }) {
  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <ScoreRing score={scores.overall} size={36} strokeWidth={3} />
        <div className="flex gap-3 flex-wrap">
          {[
            { label: 'Hook', value: scores.hookStrength },
            { label: 'Engage', value: scores.engagementPotential },
            { label: 'Read', value: scores.readability },
            { label: 'Fit', value: scores.platformFit },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <div className={`text-xs font-bold tabular-nums ${getScoreColor(value).text}`}>{value}</div>
              <div className="text-[10px] text-galactic">{label}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <ScoreBar label="Hook" score={scores.hookStrength} />
      <ScoreBar label="Engage" score={scores.engagementPotential} />
      <ScoreBar label="Readability" score={scores.readability} />
      <ScoreBar label="Platform Fit" score={scores.platformFit} />
    </div>
  )
}
