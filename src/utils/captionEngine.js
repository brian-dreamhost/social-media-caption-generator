// ============================================================
// Caption Engine — keyword extraction, hashtag generation,
// multi-angle captions, platform formatting, and scoring.
// ============================================================

// --------------- Platform metadata ---------------
export const PLATFORMS = {
  instagram: { name: 'Instagram', limit: 2200, preview: 125, color: '#E1306C', hashtagMax: 30, hashtagRecommended: 8 },
  linkedin:  { name: 'LinkedIn',  limit: 3000, preview: 210, color: '#0A66C2', hashtagMax: 5,  hashtagRecommended: 3 },
  twitter:   { name: 'X (Twitter)', limit: 280, preview: 280, color: '#000000', hashtagMax: 2,  hashtagRecommended: 1 },
  tiktok:    { name: 'TikTok',   limit: 2200, preview: 150, color: '#010101', hashtagMax: 8,  hashtagRecommended: 5 },
  facebook:  { name: 'Facebook', limit: 63206, preview: 477, color: '#1877F2', hashtagMax: 3,  hashtagRecommended: 0 },
}

export const PLATFORM_ORDER = ['instagram', 'linkedin', 'twitter', 'tiktok', 'facebook']

// --------------- Tone definitions ---------------
export const TONES = {
  professional: {
    label: 'Professional',
    desc: 'Authoritative, data-driven, polished',
    emojiFreq: 0,
    sentenceStyle: 'compound',
    vocabulary: 'formal',
  },
  casual: {
    label: 'Casual',
    desc: 'Friendly, conversational, relatable',
    emojiFreq: 2,
    sentenceStyle: 'short',
    vocabulary: 'everyday',
  },
  bold: {
    label: 'Bold',
    desc: 'Direct, confident, high-energy',
    emojiFreq: 1,
    sentenceStyle: 'punchy',
    vocabulary: 'power',
  },
  witty: {
    label: 'Witty',
    desc: 'Clever, playful, personality-driven',
    emojiFreq: 2,
    sentenceStyle: 'twist',
    vocabulary: 'creative',
  },
  inspirational: {
    label: 'Inspirational',
    desc: 'Motivating, uplifting, empowering',
    emojiFreq: 1,
    sentenceStyle: 'flowing',
    vocabulary: 'aspirational',
  },
}

// --------------- Caption angles ---------------
export const ANGLES = {
  hook:      { label: 'Hook / Question', icon: 'question', desc: 'Opens with a question to drive engagement' },
  story:     { label: 'Story / Narrative', icon: 'story', desc: 'Mini-story with tension and resolution' },
  stat:      { label: 'Stat / Authority', icon: 'stat', desc: 'Leads with a data point or bold claim' },
  benefit:   { label: 'Benefit-First', icon: 'benefit', desc: 'Leads with the transformation/outcome' },
  curiosity: { label: 'Curiosity / Intrigue', icon: 'curiosity', desc: 'Pattern interrupt that stops the scroll' },
}

export const ANGLE_ORDER = ['hook', 'story', 'stat', 'benefit', 'curiosity']

// --------------- Stop words for keyword extraction ---------------
const STOP_WORDS = new Set([
  'a','an','the','and','or','but','in','on','at','to','for','of','with','by','from','is','are',
  'was','were','be','been','being','have','has','had','do','does','did','will','would','shall',
  'should','may','might','can','could','this','that','these','those','it','its','my','your',
  'our','their','his','her','we','they','you','i','me','us','them','what','which','who','whom',
  'how','when','where','why','not','no','nor','so','if','then','than','too','very','just',
  'about','up','out','new','also','get','like','make','know','take','come','go','see','look',
  'find','give','tell','say','way','most','some','all','each','every','any','few','more','much',
  'many','such','own','other','into','over','after','before','between','through','during','here',
  'there','now','well','still','even','back','only','just','really','right','down','off',
  'things','thing','lot','got','need','want','time','people','day','help','work','use',
])

// Common words that appear everywhere — used for reach tier classification
const HIGH_FREQUENCY_WORDS = new Set([
  'business','marketing','social','media','digital','online','brand','content','growth','success',
  'tips','strategy','guide','learn','free','best','top','ways','money','website','blog','post',
  'video','photo','design','app','tech','software','startup','sales','customer','product',
  'service','company','team','data','email','seo','ads','advertising','ecommerce','fitness',
  'health','food','travel','fashion','beauty','lifestyle','music','art','education','finance',
])

const MEDIUM_FREQUENCY_WORDS = new Set([
  'automation','analytics','conversion','retention','engagement','optimization','branding',
  'storytelling','copywriting','podcast','newsletter','webinar','influencer','affiliate',
  'dropshipping','saas','b2b','b2c','roi','kpi','funnel','landing','onboarding','ux','ui',
  'responsive','accessibility','performance','scalability','integration','workflow','template',
  'checklist','framework','methodology','benchmark','audit','compliance','privacy','security',
])

// --------------- Keyword extraction ---------------
export function extractKeywords(text) {
  if (!text || !text.trim()) return []

  // Normalize: lowercase, strip punctuation except hyphens
  const cleaned = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  const words = cleaned.split(' ').filter(w => w.length > 2 && !STOP_WORDS.has(w))

  // Deduplicate while preserving order
  const seen = new Set()
  const unique = []
  for (const w of words) {
    if (!seen.has(w)) {
      seen.add(w)
      unique.push(w)
    }
  }

  // Also extract 2-word phrases
  const allWords = cleaned.split(' ')
  const phrases = []
  for (let i = 0; i < allWords.length - 1; i++) {
    const w1 = allWords[i]
    const w2 = allWords[i + 1]
    if (w1.length > 2 && w2.length > 2 && !STOP_WORDS.has(w1) && !STOP_WORDS.has(w2)) {
      const phrase = `${w1}${w2}`
      if (!seen.has(phrase)) {
        seen.add(phrase)
        phrases.push({ text: phrase, source: `${w1} ${w2}` })
      }
    }
  }

  return { single: unique, phrases }
}

// --------------- Hashtag generation ---------------
export function generateHashtags(keywords, platform) {
  if (!keywords || (!keywords.single?.length && !keywords.phrases?.length)) return []

  const platformMeta = PLATFORMS[platform]
  const maxTags = platformMeta?.hashtagRecommended || 5

  const hashtags = []
  const usedTexts = new Set()

  function addTag(text, tier, source) {
    const tag = `#${text.replace(/[^a-z0-9]/g, '')}`
    if (tag.length <= 2 || usedTexts.has(tag)) return
    usedTexts.add(tag)
    hashtags.push({ tag, tier, source })
  }

  // Phrase-based hashtags (tend to be more niche)
  for (const p of keywords.phrases || []) {
    const tier = classifyTier(p.text)
    addTag(p.text, tier === 'high' ? 'medium' : tier, p.source)
  }

  // Single-word hashtags
  for (const word of keywords.single || []) {
    const tier = classifyTier(word)
    addTag(word, tier, word)
  }

  // Add some derived variations
  for (const word of (keywords.single || []).slice(0, 4)) {
    // "word + tips", "word + strategy"
    const suffixes = ['tips', 'strategy', 'life', 'goals', 'hack']
    for (const suffix of suffixes) {
      if (word !== suffix) {
        addTag(`${word}${suffix}`, 'niche', `${word} + ${suffix}`)
        if (hashtags.length >= maxTags * 3) break
      }
    }
    if (hashtags.length >= maxTags * 3) break
  }

  // Sort: niche first (most valuable), then medium, then high
  const tierOrder = { niche: 0, medium: 1, high: 2 }
  hashtags.sort((a, b) => tierOrder[a.tier] - tierOrder[b.tier])

  // Return a balanced mix: try to get at least one from each tier
  const byTier = { niche: [], medium: [], high: [] }
  for (const h of hashtags) {
    byTier[h.tier].push(h)
  }

  const result = []
  const perTier = Math.max(1, Math.floor(maxTags / 3))

  // Fill from each tier
  for (const tier of ['niche', 'medium', 'high']) {
    const slice = byTier[tier].slice(0, perTier)
    result.push(...slice)
  }

  // Fill remaining slots from all hashtags
  for (const h of hashtags) {
    if (result.length >= maxTags) break
    if (!result.includes(h)) result.push(h)
  }

  return result.slice(0, maxTags)
}

function classifyTier(word) {
  if (HIGH_FREQUENCY_WORDS.has(word)) return 'high'
  if (MEDIUM_FREQUENCY_WORDS.has(word)) return 'medium'
  return 'niche'
}

// --------------- Emoji sets by tone ---------------
const EMOJI_SETS = {
  professional: ['', '', '', '', ''],
  casual: ['\u{1F44B}', '\u{2728}', '\u{1F389}', '\u{1F4AC}', '\u{1F60A}', '\u{1F31F}', '\u{1F49B}', '\u{1F4E3}'],
  bold: ['\u{1F525}', '\u{26A1}', '\u{1F4A5}', '\u{1F3AF}', '\u{1F680}', '\u{1F4AA}', '\u{1F525}'],
  witty: ['\u{1F440}', '\u{1F60F}', '\u{1F389}', '\u{1F921}', '\u{2615}', '\u{1F4A1}', '\u{1F914}'],
  inspirational: ['\u{1F31F}', '\u{2728}', '\u{1F4AB}', '\u{1F33F}', '\u{2764}\u{FE0F}', '\u{1F320}', '\u{1F3C6}'],
}

function pickEmoji(tone, count = 1) {
  const set = EMOJI_SETS[tone] || EMOJI_SETS.casual
  if (!set[0]) return '' // professional has empty strings
  const picked = []
  const indices = new Set()
  for (let i = 0; i < count; i++) {
    let idx
    do { idx = Math.floor(Math.random() * set.length) } while (indices.has(idx) && indices.size < set.length)
    indices.add(idx)
    picked.push(set[idx])
  }
  return picked.join('')
}

// --------------- Seeded random helper ---------------
function seededRandom(seed) {
  let h = 0
  for (let i = 0; i < seed.length; i++) {
    h = ((h << 5) - h + seed.charCodeAt(i)) | 0
  }
  return function() {
    h = (h * 1664525 + 1013904223) & 0x7fffffff
    return h / 0x7fffffff
  }
}

function pickRandom(arr, rng) {
  return arr[Math.floor((rng ? rng() : Math.random()) * arr.length)]
}

// --------------- Caption generation by angle x tone x platform ---------------

// Hook / Question angle templates
function generateHookCaption(topic, cta, tone, platform, keywords) {
  const keyPhrase = keywords.single?.slice(0, 2).join(' and ') || topic
  const topicClean = topic.replace(/^(new |our |my |the |a )/i, '')

  const hooks = {
    professional: [
      `Are you still overlooking ${keyPhrase} in your strategy?\n\n${topic}.\n\nMost professionals miss this — but the data is clear.`,
      `What if the key to better results was simpler than you think?\n\n${topic}.\n\nHere's what the research shows.`,
      `How much is ignoring ${keyPhrase} actually costing you?\n\n${topic} — and the answer might surprise you.`,
    ],
    casual: [
      `Real talk — have you thought about ${keyPhrase} lately?\n\n${topic}\n\nBecause honestly, this changed everything for us.`,
      `Quick question: ${keyPhrase} — are you on top of it?\n\n${topic}\n\nThis is the stuff nobody talks about but everyone needs.`,
      `Okay but seriously — when was the last time you looked at ${keyPhrase}?\n\n${topic}`,
    ],
    bold: [
      `${keyPhrase.toUpperCase()}. Are you in or are you behind?\n\n${topic}\n\nNo excuses. The results speak for themselves.`,
      `Still sleeping on ${keyPhrase}? Wake up.\n\n${topic}\n\nThis is non-negotiable if you want real growth.`,
      `One question: Is ${keyPhrase} even on your radar?\n\nIt should be. ${topic}`,
    ],
    witty: [
      `Plot twist: ${keyPhrase} is about to be your new obsession.\n\n${topic}\n\nDon't say we didn't warn you.`,
      `Tell me you care about ${keyPhrase} without telling me you care about ${keyPhrase}.\n\n${topic}`,
      `${keyPhrase} walked into a bar. Everyone else was still doing things the old way.\n\n${topic}`,
    ],
    inspirational: [
      `What would change if you truly mastered ${keyPhrase}?\n\n${topic}\n\nYour next breakthrough starts with one decision.`,
      `Every expert was once a beginner who asked about ${keyPhrase}.\n\n${topic}\n\nToday is your day to start.`,
      `Imagine where you'd be if you'd invested in ${keyPhrase} a year ago.\n\nNow imagine where you'll be a year from now.\n\n${topic}`,
    ],
  }

  let caption = pickRandom(hooks[tone] || hooks.casual)
  if (cta) {
    caption += `\n\n${formatCTA(cta, tone)}`
  }
  return caption
}

// Story / Narrative angle templates
function generateStoryCaption(topic, cta, tone, platform, keywords) {
  const keyPhrase = keywords.single?.[0] || 'this'

  const stories = {
    professional: [
      `Last quarter, we identified a gap in our approach to ${keyPhrase}.\n\nWe analyzed the data, tested new methods, and refined our process.\n\nThe result? ${topic}\n\nHere are the key takeaways that made the difference.`,
      `When we first started exploring ${keyPhrase}, the conventional wisdom said one thing.\n\nBut the data told a different story.\n\n${topic}\n\nSometimes challenging assumptions is exactly what's needed.`,
    ],
    casual: [
      `So here's the thing nobody tells you about ${keyPhrase}...\n\nWe tried everything. Failed a bunch. Learned a LOT.\n\nAnd then we figured out ${topic}\n\nYeah, it really was that simple.`,
      `Little story time:\n\nWe used to struggle with ${keyPhrase}. Like, a lot.\n\nBut then we discovered something that changed the game.\n\n${topic}\n\nWish someone had told us this sooner.`,
    ],
    bold: [
      `Everyone told us ${keyPhrase} didn't matter.\n\nWe did it anyway.\n\n${topic}\n\nLet the results speak for themselves.`,
      `We bet everything on ${keyPhrase}.\n\nPeople thought we were crazy.\n\nTurns out? ${topic}\n\nBold moves. Real results.`,
    ],
    witty: [
      `Chapter 1: "We don't need to worry about ${keyPhrase}."\nChapter 2: *Worries about ${keyPhrase}*\nChapter 3: ${topic}\nEpilogue: Why didn't we do this sooner?\n\nThe end. You're welcome.`,
      `Once upon a time, ${keyPhrase} seemed impossible.\n\nSpoiler alert: it wasn't.\n\n${topic}\n\nAnd they all posted happily ever after.`,
    ],
    inspirational: [
      `Every transformation starts with a single step.\n\nOurs started with ${keyPhrase}.\n\nWe didn't have all the answers — just the courage to start.\n\n${topic}\n\nYour journey begins whenever you decide it does.`,
      `There was a moment when ${keyPhrase} felt completely out of reach.\n\nBut inch by inch, step by step, progress happened.\n\n${topic}\n\nRemember: the hardest part is always starting.`,
    ],
  }

  let caption = pickRandom(stories[tone] || stories.casual)
  if (cta) {
    caption += `\n\n${formatCTA(cta, tone)}`
  }
  return caption
}

// Stat / Authority angle templates
function generateStatCaption(topic, cta, tone, platform, keywords) {
  const keyPhrase = keywords.single?.[0] || 'this approach'

  const stats = {
    professional: [
      `Research shows that ${keyPhrase} can drive up to 3x better outcomes when implemented correctly.\n\n${topic}\n\nThe data doesn't lie — and neither do these results.`,
      `According to industry benchmarks, most teams underinvest in ${keyPhrase} by 40% or more.\n\n${topic}\n\nHere's what the top performers are doing differently.`,
    ],
    casual: [
      `Fun fact: people who focus on ${keyPhrase} see way better results. Like, noticeably better.\n\n${topic}\n\nNumbers don't lie, friends.`,
      `Did you know that ${keyPhrase} is one of the most underrated factors in getting results?\n\n${topic}\n\nThe more you know!`,
    ],
    bold: [
      `80% of people ignore ${keyPhrase}. The other 20% are winning.\n\nWhich side are you on?\n\n${topic}\n\nThe numbers are brutal — but so is the competition.`,
      `Fact: ${keyPhrase} separates the top 1% from everyone else.\n\n${topic}\n\nStop debating. Start executing.`,
    ],
    witty: [
      `Statistically speaking, you're probably sleeping on ${keyPhrase}.\n\n(Don't worry, most people are. That's why it works so well for the rest of us.)\n\n${topic}`,
      `9 out of 10 people overlook ${keyPhrase}.\n\nThe 10th person? They wrote this post.\n\n${topic}`,
    ],
    inspirational: [
      `The difference between where you are and where you want to be? Often it's as simple as ${keyPhrase}.\n\n${topic}\n\nSmall changes compound into extraordinary results.`,
      `Every success story has a turning point. For many, it's been embracing ${keyPhrase}.\n\n${topic}\n\nYour turning point could be today.`,
    ],
  }

  let caption = pickRandom(stats[tone] || stats.casual)
  if (cta) {
    caption += `\n\n${formatCTA(cta, tone)}`
  }
  return caption
}

// Benefit-First angle templates
function generateBenefitCaption(topic, cta, tone, platform, keywords) {
  const keyPhrase = keywords.single?.slice(0, 2).join(' and ') || 'this'

  const benefits = {
    professional: [
      `Better results. Less wasted effort. Clearer direction.\n\nThat's what happens when you get ${keyPhrase} right.\n\n${topic}\n\nHere's how to make it work for your organization.`,
      `Imagine reducing friction and increasing output — simultaneously.\n\n${topic}\n\nFocusing on ${keyPhrase} is how top-performing teams are doing exactly that.`,
    ],
    casual: [
      `Less stress. Better results. Actually enjoying the process.\n\nSounds too good to be true? It's what happens when you nail ${keyPhrase}.\n\n${topic}`,
      `Want to spend less time guessing and more time getting results?\n\n${topic}\n\nFocusing on ${keyPhrase} is a total game changer.`,
    ],
    bold: [
      `More growth. Less noise. Zero guesswork.\n\nThat's the power of ${keyPhrase}.\n\n${topic}\n\nStop hoping. Start knowing.`,
      `Save time. Get results. Crush the competition.\n\n${topic}\n\n${keyPhrase} is the unfair advantage you've been looking for.`,
    ],
    witty: [
      `What if you could work smarter AND look cool doing it?\n\n(Asking for a friend who just discovered ${keyPhrase}.)\n\n${topic}`,
      `The before: confused. The after: unstoppable.\n\nThe secret ingredient? ${keyPhrase}.\n\n${topic}\n\nYou're welcome in advance.`,
    ],
    inspirational: [
      `Picture this: waking up knowing your ${keyPhrase} strategy is working FOR you, not against you.\n\n${topic}\n\nThat future is closer than you think. Let's make it happen.`,
      `The transformation starts the moment you invest in ${keyPhrase}.\n\nBetter outcomes. Deeper impact. Lasting results.\n\n${topic}`,
    ],
  }

  let caption = pickRandom(benefits[tone] || benefits.casual)
  if (cta) {
    caption += `\n\n${formatCTA(cta, tone)}`
  }
  return caption
}

// Curiosity / Intrigue angle templates
function generateCuriosityCaption(topic, cta, tone, platform, keywords) {
  const keyPhrase = keywords.single?.[0] || 'this'

  const curiosity = {
    professional: [
      `There's one factor about ${keyPhrase} that most professionals consistently overlook.\n\nIt's not what you'd expect.\n\n${topic}\n\nThe insight that changes everything is buried in the details.`,
      `We almost didn't share this.\n\nBut the impact ${keyPhrase} has had on our results is too significant to keep quiet.\n\n${topic}`,
    ],
    casual: [
      `Okay, stop what you're doing. You need to see this.\n\n${topic}\n\nI know ${keyPhrase} doesn't sound exciting, but trust me — this changes things.`,
      `Not gonna lie, I didn't believe ${keyPhrase} would make this much of a difference.\n\nI was wrong.\n\n${topic}`,
    ],
    bold: [
      `This is going to change how you think about ${keyPhrase}.\n\nPermanently.\n\n${topic}\n\nYou've been warned.`,
      `STOP. Before you scroll past, read this about ${keyPhrase}.\n\n${topic}\n\nYou'll thank me later.`,
    ],
    witty: [
      `Me: "How important can ${keyPhrase} really be?"\nAlso me, 5 minutes later: *mind blown*\n\n${topic}\n\nDon't be like past me. Be like present me.`,
      `They said ${keyPhrase} was boring.\n\nThey were wrong. Very, very wrong.\n\n${topic}\n\n(I'll take my apology in the comments.)`,
    ],
    inspirational: [
      `Sometimes the biggest breakthroughs come from the most unexpected places.\n\n${keyPhrase} was that place for us.\n\n${topic}\n\nStay curious. Stay open. Stay growing.`,
      `What if the thing holding you back is the one thing you haven't explored yet?\n\n${keyPhrase} might just be the missing piece.\n\n${topic}`,
    ],
  }

  let caption = pickRandom(curiosity[tone] || curiosity.casual)
  if (cta) {
    caption += `\n\n${formatCTA(cta, tone)}`
  }
  return caption
}

// CTA formatter per tone
function formatCTA(cta, tone) {
  switch (tone) {
    case 'professional':
      return `Learn more: ${cta}`
    case 'casual':
      return `Check it out: ${cta} \u{1F449}`
    case 'bold':
      return `\u{1F449} ${cta.toUpperCase()} — NOW.`
    case 'witty':
      return `(You know you want to: ${cta})`
    case 'inspirational':
      return `Take the first step \u{2192} ${cta}`
    default:
      return `\u{1F449} ${cta}`
  }
}

// --------------- Platform-specific formatting ---------------

function formatForPlatform(caption, platform, tone, hashtags, includeHashtags) {
  const hashtagStr = hashtags.map(h => h.tag).join(' ')

  switch (platform) {
    case 'instagram': {
      // Strategic line breaks, emoji placement, hashtag block separated by dots
      let formatted = caption
      // Add tone-appropriate emoji at strategic points if not professional
      if (tone !== 'professional') {
        const emoji = pickEmoji(tone, 1)
        if (emoji && !formatted.startsWith(emoji)) {
          // Add emoji to first line
          const lines = formatted.split('\n')
          if (lines[0] && !lines[0].match(/[\u{1F300}-\u{1FAFF}]/u)) {
            lines[0] = lines[0] + ' ' + emoji
            formatted = lines.join('\n')
          }
        }
      }
      if (includeHashtags && hashtagStr) {
        formatted += '\n\n.\n.\n.\n\n' + hashtagStr
      }
      return formatted
    }

    case 'linkedin': {
      // Professional hook line, then line break for "see more" trick
      const lines = caption.split('\n').filter(l => l.trim())
      if (lines.length > 1) {
        // First line is the hook, then a blank line to force "see more"
        const hook = lines[0]
        const rest = lines.slice(1).join('\n\n')
        let formatted = hook + '\n\n' + rest
        if (includeHashtags && hashtagStr) {
          formatted += '\n\n' + hashtagStr
        }
        return formatted
      }
      if (includeHashtags && hashtagStr) {
        return caption + '\n\n' + hashtagStr
      }
      return caption
    }

    case 'twitter': {
      // Punchy, under 280 chars, 1-2 hashtags woven into text
      let tweet = caption.replace(/\n{2,}/g, '\n').trim()
      // Twitter shouldn't have long multi-paragraph format
      const sentences = tweet.split(/\n/).filter(s => s.trim())
      // Take the punchiest parts
      if (sentences.length > 3) {
        tweet = sentences.slice(0, 3).join('\n')
      }
      // Add 1-2 hashtags woven in
      if (includeHashtags && hashtags.length > 0) {
        const topTags = hashtags.slice(0, 2).map(h => h.tag).join(' ')
        tweet += '\n\n' + topTags
      }
      // Truncate to 280
      if (tweet.length > 280) {
        tweet = tweet.slice(0, 277) + '...'
      }
      return tweet
    }

    case 'tiktok': {
      // Short punchy lines, trend-aware format
      let formatted = caption
        .split('\n')
        .filter(l => l.trim())
        .map(l => l.trim())
        .join('\n')
      if (includeHashtags && hashtagStr) {
        formatted += '\n\n' + hashtagStr
      }
      return formatted
    }

    case 'facebook': {
      // Conversational, question-driven, minimal hashtags
      let formatted = caption
      // Facebook rarely uses hashtags — max 1-2 if at all
      if (includeHashtags && hashtags.length > 0) {
        const fbTags = hashtags.slice(0, 2).map(h => h.tag).join(' ')
        formatted += '\n\n' + fbTags
      }
      return formatted
    }

    default:
      return caption
  }
}

// --------------- Caption scoring ---------------

export function scoreCaption(caption, platform) {
  const scores = {}

  // Hook Strength (0-100): Does the first line stop the scroll?
  const firstLine = caption.split('\n').find(l => l.trim()) || ''
  let hookScore = 40 // base
  if (firstLine.includes('?')) hookScore += 20  // questions engage
  if (firstLine.length > 10 && firstLine.length < 80) hookScore += 10 // good length
  if (firstLine.match(/^[A-Z]{2,}/)) hookScore += 10 // starts with emphasis
  if (firstLine.match(/[\u{1F300}-\u{1FAFF}]/u)) hookScore += 5 // emoji attention
  if (firstLine.match(/stop|wait|hold on|listen|imagine|picture|what if|did you know|here's|secret|truth|fact/i)) hookScore += 15
  if (firstLine.length < 5) hookScore -= 20
  scores.hookStrength = Math.min(100, Math.max(0, hookScore))

  // Engagement Potential (0-100): Questions, CTAs, conversation starters
  let engageScore = 35
  const questionCount = (caption.match(/\?/g) || []).length
  engageScore += Math.min(25, questionCount * 10)
  if (caption.match(/comment|share|tag|let me know|what do you think|agree|thoughts/i)) engageScore += 15
  if (caption.match(/link in bio|check out|learn more|read more|click|visit|grab|get/i)) engageScore += 10
  if (caption.match(/you|your|you're/i)) engageScore += 10 // addresses reader
  if (caption.match(/(DM|dm|message) (me|us)/i)) engageScore += 5
  scores.engagementPotential = Math.min(100, Math.max(0, engageScore))

  // Readability (0-100): Sentence length, word complexity
  const sentences = caption.split(/[.!?\n]+/).filter(s => s.trim().length > 3)
  const avgSentenceLen = sentences.length > 0
    ? sentences.reduce((sum, s) => sum + s.trim().split(/\s+/).length, 0) / sentences.length
    : 20
  let readScore = 50
  if (avgSentenceLen >= 5 && avgSentenceLen <= 15) readScore += 25
  else if (avgSentenceLen >= 3 && avgSentenceLen <= 20) readScore += 15
  else if (avgSentenceLen > 25) readScore -= 15

  // Line breaks improve readability
  const lineBreaks = (caption.match(/\n/g) || []).length
  readScore += Math.min(20, lineBreaks * 3)

  // Penalize very long unbroken paragraphs
  const longestParagraph = caption.split(/\n{2,}/).reduce((max, p) => Math.max(max, p.length), 0)
  if (longestParagraph > 300) readScore -= 10

  scores.readability = Math.min(100, Math.max(0, readScore))

  // Platform Fit (0-100): Length, format, hashtag usage match platform norms
  const charCount = caption.length
  const hashtagCount = (caption.match(/#\w+/g) || []).length
  const meta = PLATFORMS[platform]
  let fitScore = 50

  // Length check
  if (charCount <= meta.limit) {
    fitScore += 15
    // Bonus for being in the sweet spot
    if (platform === 'twitter' && charCount >= 100 && charCount <= 260) fitScore += 15
    if (platform === 'instagram' && charCount >= 150 && charCount <= 1500) fitScore += 15
    if (platform === 'linkedin' && charCount >= 200 && charCount <= 1500) fitScore += 15
    if (platform === 'tiktok' && charCount >= 50 && charCount <= 300) fitScore += 15
    if (platform === 'facebook' && charCount >= 80 && charCount <= 500) fitScore += 15
  } else {
    fitScore -= 20
  }

  // Hashtag count check
  if (hashtagCount <= meta.hashtagMax) fitScore += 10
  else fitScore -= 10

  if (platform === 'twitter' && hashtagCount <= 2) fitScore += 10
  if (platform === 'facebook' && hashtagCount <= 3) fitScore += 10
  if (platform === 'linkedin' && hashtagCount >= 1 && hashtagCount <= 5) fitScore += 10
  if (platform === 'instagram' && hashtagCount >= 3 && hashtagCount <= 15) fitScore += 10

  scores.platformFit = Math.min(100, Math.max(0, fitScore))

  // Overall (weighted average)
  scores.overall = Math.round(
    scores.hookStrength * 0.3 +
    scores.engagementPotential * 0.25 +
    scores.readability * 0.2 +
    scores.platformFit * 0.25
  )

  return scores
}

// --------------- Main generation function ---------------

const ANGLE_GENERATORS = {
  hook: generateHookCaption,
  story: generateStoryCaption,
  stat: generateStatCaption,
  benefit: generateBenefitCaption,
  curiosity: generateCuriosityCaption,
}

export function generateCaptions(platform, { topic, cta, tone, includeHashtags }) {
  // 1. Extract keywords from topic
  const keywords = extractKeywords(topic)

  // 2. Generate platform-specific hashtags
  const hashtags = generateHashtags(keywords, platform)

  // 3. Generate a caption for each angle
  const results = []

  for (const angle of ANGLE_ORDER) {
    const generator = ANGLE_GENERATORS[angle]
    if (!generator) continue

    const rawCaption = generator(topic, cta, tone, platform, keywords)
    const formatted = formatForPlatform(rawCaption, platform, tone, hashtags, includeHashtags)
    const scores = scoreCaption(formatted, platform)

    results.push({
      angle,
      caption: formatted,
      scores,
      hashtags: includeHashtags ? hashtags : [],
    })
  }

  // Sort by overall score descending
  results.sort((a, b) => b.scores.overall - a.scores.overall)

  return {
    captions: results,
    keywords,
    hashtags,
  }
}
