export const PLATFORMS = {
  instagram: { name: 'Instagram', limit: 2200, preview: 125, color: '#E1306C' },
  linkedin: { name: 'LinkedIn', limit: 3000, preview: 210, color: '#0A66C2' },
  twitter: { name: 'X (Twitter)', limit: 280, preview: 280, color: '#000000' },
  tiktok: { name: 'TikTok', limit: 2200, preview: 150, color: '#010101' },
  facebook: { name: 'Facebook', limit: 63206, preview: 477, color: '#1877F2' },
}

export const PLATFORM_ORDER = ['instagram', 'linkedin', 'twitter', 'tiktok', 'facebook']

export const TONES = {
  friendly: {
    adj: 'friendly and approachable',
    cta_prefix: 'Would love for you to',
    openers: ["Here's something exciting!", "We've got good news!", "So excited to share this!"],
  },
  professional: {
    adj: 'professional and authoritative',
    cta_prefix: 'Learn more at',
    openers: ['Sharing a key insight today.', 'An important update for your business.', 'Worth your attention:'],
  },
  playful: {
    adj: 'playful and fun',
    cta_prefix: 'Come check out',
    openers: ['Okay, we need to talk... 👀', 'Plot twist! 🎉', 'Not gonna lie, this is pretty awesome! 🙌'],
  },
  inspirational: {
    adj: 'inspiring and motivating',
    cta_prefix: 'Take the first step:',
    openers: ['Every big achievement starts somewhere.', 'This could change everything.', 'Your next level is closer than you think.'],
  },
  bold: {
    adj: 'bold and direct',
    cta_prefix: 'Get it now:',
    openers: ['No fluff. Just results.', 'This is the one.', 'Stop scrolling. This matters.'],
  },
}

const HASHTAG_SUGGESTIONS = {
  default: ['#smallbusiness', '#marketing', '#entrepreneur', '#businesstips', '#growyourbusiness'],
  linkedin: ['#business', '#marketing', '#leadership'],
}

export function generateCaption(platform, { topic, cta, tone, includeHashtags }) {
  const toneData = TONES[tone] || TONES.friendly
  const opener = toneData.openers[Math.floor(Math.random() * toneData.openers.length)]
  const ctaLine = cta ? `${toneData.cta_prefix} ${cta}.` : ''
  const hashtags = includeHashtags ? HASHTAG_SUGGESTIONS.default.slice(0, 5).join(' ') : ''
  const linkedinHashtags = HASHTAG_SUGGESTIONS.linkedin.join(' ')

  switch (platform) {
    case 'instagram': {
      const emojis = tone === 'playful' ? '🎉✨🙌' : tone === 'bold' ? '🔥💪⚡' : '✨'
      return `${opener}\n\n${topic}\n\n${ctaLine}\n\n${emojis}${includeHashtags ? '\n\n' + hashtags : ''}`.trim()
    }
    case 'linkedin': {
      return `${opener}\n\n${topic}\n\n${ctaLine}\n\n${linkedinHashtags}`.trim()
    }
    case 'twitter': {
      const tweet = `${topic}${ctaLine ? ' ' + ctaLine : ''}${includeHashtags ? ' #marketing #smallbiz' : ''}`
      return tweet.slice(0, 280)
    }
    case 'tiktok': {
      return `${opener}\n\n${topic}\n\n${ctaLine ? ctaLine + '\n' : ''}📲 Link in bio!${includeHashtags ? '\n\n' + hashtags : ''}`.trim()
    }
    case 'facebook': {
      return `${opener}\n\n${topic}\n\n${ctaLine}`.trim()
    }
    default:
      return topic
  }
}
