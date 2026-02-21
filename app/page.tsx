'use client'

import React, { useState, useCallback, useRef, useMemo } from 'react'
import { callAIAgent, AIAgentResponse } from '@/lib/aiAgent'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import {
  FiTrendingUp,
  FiImage,
  FiFileText,
  FiPlay,
  FiClock,
  FiTarget,
  FiZap,
  FiEye,
  FiStar,
  FiVideo,
  FiLayout,
  FiLayers,
  FiCopy,
  FiCheck,
  FiAlertCircle,
  FiRefreshCw,
  FiChevronDown,
  FiChevronUp,
  FiArrowRight,
  FiSearch,
  FiActivity,
  FiAward,
  FiBookOpen,
  FiMusic,
  FiCamera,
  FiGrid,
  FiHash,
  FiMessageCircle,
  FiThumbsUp
} from 'react-icons/fi'

// ─── AGENT IDS ───────────────────────────────────────────────────────────────
const TREND_MANAGER_ID = '699971ebc9d9dd3effcccab1'
const IMAGE_AGENT_ID = '6999720af4d61186679a93ef'
const SCRIPT_AGENT_ID = '6999720af4d61186679a93f1'

// ─── TYPES ───────────────────────────────────────────────────────────────────
interface Insight {
  insight: string
  action_item: string
}

interface ViralVideo {
  title: string
  channel: string
  views: string
  category: string
  topic: string
  virality_reason: string
  engagement_notes: string
}

interface HookPattern {
  pattern_name: string
  description: string
  effectiveness: string
  example: string
}

interface PacingItem {
  style: string
  description: string
  best_for: string
}

interface TonePattern {
  tone: string
  description: string
  usage_frequency: string
}

interface ThumbnailPattern {
  pattern: string
  description: string
  impact: string
}

interface EngagementTactic {
  tactic: string
  description: string
  effectiveness: string
}

interface StyleAnalysis {
  hook_patterns: HookPattern[]
  pacing_analysis: PacingItem[]
  tone_patterns: TonePattern[]
  thumbnail_patterns: ThumbnailPattern[]
  engagement_tactics: EngagementTactic[]
  key_takeaways: string
}

interface TemplateSegment {
  segment_name: string
  timing: string
  description: string
  tips: string
}

interface VideoTemplate {
  template_name: string
  target_duration: string
  difficulty: string
  best_for: string
  viral_patterns_used: string
  segments: TemplateSegment[]
  cta_placement: string
  transition_style: string
}

interface TrendData {
  executive_summary: string
  top_insights: Insight[]
  viral_videos: ViralVideo[]
  style_analysis: StyleAnalysis
  video_templates: VideoTemplate[]
  week_overview: string
}

interface ThumbnailConcept {
  concept_name: string
  description: string
  viral_patterns_used: string
  target_niche: string
  image_prompt: string
}

interface ImageData {
  thumbnail_concepts: ThumbnailConcept[]
  design_notes: string
}

interface ArtifactFile {
  file_url: string
  name: string
  format_type: string
}

interface ScriptSegment {
  timestamp: string
  section: string
  content: string
  delivery_notes: string
}

interface ProductionPlan {
  shot_list: string
  equipment: string
  editing_style: string
  music_suggestions: string
  thumbnail_concept: string
}

interface VideoScript {
  title: string
  viral_potential: string
  viral_styles_blended: string
  target_duration: string
  hook: string
  script_body: ScriptSegment[]
  cta: string
  outro: string
  production_plan: ProductionPlan
}

interface ScriptData {
  scripts: VideoScript[]
  overall_strategy: string
}

// ─── SAMPLE DATA ─────────────────────────────────────────────────────────────
const SAMPLE_TREND_DATA: TrendData = {
  executive_summary: "This week's viral landscape is dominated by high-energy challenge videos, storytelling-driven content, and educational content disguised as entertainment. The top-performing videos leverage curiosity gaps, rapid pacing, and relatable scenarios to maximize engagement.",
  top_insights: [
    { insight: "Curiosity-gap hooks outperform direct statement hooks by 3.2x in the first 3 seconds", action_item: "Start every video with an unanswered question or surprising visual contrast" },
    { insight: "Videos under 90 seconds with a twist ending see 47% higher completion rates", action_item: "Structure short-form content with a clear setup-payoff arc" },
    { insight: "Community engagement through polls and comments drives 2.8x more subscriber conversions", action_item: "Include at least one interactive element (poll, question, challenge) per video" }
  ],
  viral_videos: [
    { title: "I Tried Living on $1 for 24 Hours", channel: "BudgetKing", views: "12.4M", category: "Challenge", topic: "Budget Living", virality_reason: "Relatability + extreme constraint creates tension", engagement_notes: "High comment engagement debating strategies" },
    { title: "What Happens When You Only Eat Purple Food", channel: "FoodScience Lab", views: "8.7M", category: "Food Science", topic: "Color Diet Experiment", virality_reason: "Novelty concept with visual appeal", engagement_notes: "Shares driven by curiosity and surprise results" },
    { title: "Why Nobody Talks About This Math Trick", channel: "MindBlown Academy", views: "15.2M", category: "Education", topic: "Mental Math", virality_reason: "Knowledge gap + practical utility", engagement_notes: "Saves and shares dominate; high rewatch rate" }
  ],
  style_analysis: {
    hook_patterns: [
      { pattern_name: "The Impossible Promise", description: "Opening with a claim that seems too good or extreme to be true", effectiveness: "Very High", example: "I survived 7 days eating only gas station food" },
      { pattern_name: "The Countdown Tease", description: "Starting with the end result then rewinding to show the journey", effectiveness: "High", example: "This is what my face looked like after 30 days..." }
    ],
    pacing_analysis: [
      { style: "Rapid-Fire Cuts", description: "Scene changes every 2-3 seconds with dynamic transitions", best_for: "Challenge and entertainment content" },
      { style: "Slow Build", description: "Gradual tension building with strategic pauses", best_for: "Storytelling and documentary-style content" }
    ],
    tone_patterns: [
      { tone: "Enthusiastic Authority", description: "Confident and excited delivery that positions creator as expert", usage_frequency: "45% of viral videos" },
      { tone: "Casual Curiosity", description: "Conversational tone that invites viewer to discover alongside creator", usage_frequency: "35% of viral videos" }
    ],
    thumbnail_patterns: [
      { pattern: "Extreme Contrast", description: "Before/after or comparison layouts with bold color differences", impact: "2.4x higher CTR" },
      { pattern: "Emotion Close-up", description: "Creator face showing genuine surprise or excitement", impact: "1.8x higher CTR" }
    ],
    engagement_tactics: [
      { tactic: "The Open Loop", description: "Introducing a question early and delaying the answer until the end", effectiveness: "Very High - reduces drop-off by 34%" },
      { tactic: "Comment Bait", description: "Asking viewers a personal question related to the content", effectiveness: "High - increases comments by 2.5x" }
    ],
    key_takeaways: "The most viral content this week blends education with entertainment, uses curiosity-driven hooks, maintains rapid pacing, and includes strong calls-to-action. Thumbnails with emotional close-ups and bold text overlays consistently outperform."
  },
  video_templates: [
    {
      template_name: "The Challenge Arc",
      target_duration: "8-12 minutes",
      difficulty: "Beginner",
      best_for: "Challenge and experiment content",
      viral_patterns_used: "Curiosity gap hook, rapid pacing, twist ending",
      segments: [
        { segment_name: "Hook", timing: "0:00-0:15", description: "Show the end result or make an impossible promise", tips: "Use the most visually striking moment from your challenge" },
        { segment_name: "Setup", timing: "0:15-1:00", description: "Explain the rules and stakes of the challenge", tips: "Keep rules simple - 3 constraints maximum" },
        { segment_name: "Journey", timing: "1:00-7:00", description: "Document the challenge with escalating difficulty", tips: "Include 3 mini-climaxes throughout" },
        { segment_name: "Climax & Reveal", timing: "7:00-9:00", description: "The final moment and surprising result", tips: "Delay the reveal with a brief pause for tension" }
      ],
      cta_placement: "After the reveal, during the emotional high point",
      transition_style: "Jump cuts with sound effects"
    },
    {
      template_name: "The Knowledge Drop",
      target_duration: "5-8 minutes",
      difficulty: "Intermediate",
      best_for: "Educational and explainer content",
      viral_patterns_used: "Knowledge gap, authority positioning, visual proof",
      segments: [
        { segment_name: "Mind-Blow Hook", timing: "0:00-0:10", description: "Present a surprising fact or counter-intuitive claim", tips: "Use numbers and specifics for credibility" },
        { segment_name: "Context", timing: "0:10-1:30", description: "Why this matters and why most people get it wrong", tips: "Create a shared enemy (misinformation, old methods)" },
        { segment_name: "The Breakdown", timing: "1:30-5:00", description: "Step-by-step explanation with visual aids", tips: "Use on-screen graphics and real demonstrations" },
        { segment_name: "Application", timing: "5:00-6:30", description: "Show how to apply this knowledge immediately", tips: "Give a specific 'try this right now' action" }
      ],
      cta_placement: "Mid-roll after the first major revelation",
      transition_style: "Smooth zooms with text overlays"
    }
  ],
  week_overview: "Week 3 of February 2026 shows a strong shift toward authenticity-driven content. Viewers are gravitating toward creators who share genuine experiences over highly produced content. The challenge format continues to dominate, but educational content is closing the gap fast."
}

const SAMPLE_IMAGE_DATA: ImageData = {
  thumbnail_concepts: [
    { concept_name: "Split Reality Thumbnail", description: "Half luxury, half budget with creator in the middle looking shocked", viral_patterns_used: "Extreme Contrast + Emotion Close-up", target_niche: "Challenge / Lifestyle", image_prompt: "A split-screen thumbnail showing luxury vs budget items with a surprised person in the center" },
    { concept_name: "The Countdown Grid", description: "3x3 grid of food items with one highlighted in purple, bold text overlay", viral_patterns_used: "Visual mystery + Color pop", target_niche: "Food / Science", image_prompt: "A colorful grid of foods with purple highlighting and bold countdown numbers" }
  ],
  design_notes: "Focus on high contrast and emotional expressions. Use bold, sans-serif fonts for text overlays. Keep the color palette limited to 2-3 colors per thumbnail for maximum impact."
}

const SAMPLE_SCRIPT_DATA: ScriptData = {
  scripts: [
    {
      title: "I Tried Every Viral Productivity Hack for 7 Days",
      viral_potential: "High",
      viral_styles_blended: "Challenge Arc + Knowledge Drop",
      target_duration: "10 minutes",
      hook: "I spent $500 and an entire week testing every productivity hack the internet swears by -- and what actually worked will completely change how you plan your day.",
      script_body: [
        { timestamp: "0:00-0:12", section: "Hook", content: "Open on a messy desk covered in productivity books, apps on screen, and sticky notes everywhere. Direct to camera with energy.", delivery_notes: "Speak fast, show genuine frustration, then excitement" },
        { timestamp: "0:12-1:00", section: "Setup", content: "Explain the challenge: 7 days, 7 different viral productivity methods. Show the list on screen with brief previews of each.", delivery_notes: "Use quick cuts between each method preview. Build anticipation." },
        { timestamp: "1:00-4:00", section: "Days 1-3", content: "Cover Pomodoro Technique, Time Blocking, and the 2-Minute Rule. Show real footage of attempting each, with honest reactions and results.", delivery_notes: "Keep energy high, show real struggles, use timer graphics" },
        { timestamp: "4:00-7:00", section: "Days 4-7", content: "Cover Eat The Frog, Body Doubling, Eisenhower Matrix, and a wildcard viral hack. Escalate the challenge with harder tasks.", delivery_notes: "Build tension, show transformation happening, include data overlays" }
      ],
      cta: "If you want to see which hack I still use 30 days later, drop a comment below and subscribe so you do not miss the follow-up!",
      outro: "Quick montage of all 7 methods ranked, final thoughts, and a teaser for the 30-day follow-up video.",
      production_plan: {
        shot_list: "Desk setup wide shot, close-up hands working, timer POV, screen recordings, talking head, B-roll of daily activities",
        equipment: "Camera with good autofocus, ring light, desk mic, screen capture software",
        editing_style: "Fast-paced with dynamic text overlays, split screens for before/after, progress bar graphic",
        music_suggestions: "Upbeat lo-fi for work segments, tense music for challenges, triumphant music for reveals",
        thumbnail_concept: "Split image: chaotic desk on left, organized desk on right, creator in center looking amazed"
      }
    }
  ],
  overall_strategy: "The scripts blend challenge and educational formats to maximize both entertainment value and shareability. Each script includes built-in engagement hooks, strategic CTA placement, and production plans designed for solo creators with minimal equipment."
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function safeParseJSON(data: any): any {
  if (data === null || data === undefined) return null
  if (typeof data === 'object') return data
  if (typeof data === 'string') {
    try {
      return JSON.parse(data)
    } catch {
      // Try to find JSON in the string
      const jsonMatch = data.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0])
        } catch {
          return null
        }
      }
      return null
    }
  }
  return null
}

function renderMarkdown(text: string) {
  if (!text) return null
  return (
    <div className="space-y-2">
      {text.split('\n').map((line, i) => {
        if (line.startsWith('### '))
          return <h4 key={i} className="font-semibold text-sm mt-3 mb-1">{line.slice(4)}</h4>
        if (line.startsWith('## '))
          return <h3 key={i} className="font-semibold text-base mt-3 mb-1">{line.slice(3)}</h3>
        if (line.startsWith('# '))
          return <h2 key={i} className="font-bold text-lg mt-4 mb-2">{line.slice(2)}</h2>
        if (line.startsWith('- ') || line.startsWith('* '))
          return <li key={i} className="ml-4 list-disc text-sm">{formatInline(line.slice(2))}</li>
        if (/^\d+\.\s/.test(line))
          return <li key={i} className="ml-4 list-decimal text-sm">{formatInline(line.replace(/^\d+\.\s/, ''))}</li>
        if (!line.trim()) return <div key={i} className="h-1" />
        return <p key={i} className="text-sm">{formatInline(line)}</p>
      })}
    </div>
  )
}

function formatInline(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g)
  if (parts.length === 1) return text
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i} className="font-semibold">{part}</strong> : part
  )
}

function getDifficultyColor(difficulty: string): string {
  const d = (difficulty ?? '').toLowerCase()
  if (d.includes('beginner') || d.includes('easy')) return 'bg-green-100 text-green-800 border-green-200'
  if (d.includes('intermediate') || d.includes('medium')) return 'bg-amber-100 text-amber-800 border-amber-200'
  if (d.includes('advanced') || d.includes('hard') || d.includes('expert')) return 'bg-red-100 text-red-800 border-red-200'
  return 'bg-gray-100 text-gray-800 border-gray-200'
}

function getViralColor(potential: string): string {
  const p = (potential ?? '').toLowerCase()
  if (p.includes('very high') || p.includes('excellent')) return 'bg-orange-100 text-orange-800 border-orange-200'
  if (p.includes('high')) return 'bg-emerald-100 text-emerald-800 border-emerald-200'
  if (p.includes('medium') || p.includes('moderate')) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
  return 'bg-blue-100 text-blue-800 border-blue-200'
}

// ─── COPY HOOK ───────────────────────────────────────────────────────────────
function useCopyClipboard() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const copy = useCallback((text: string, key: string) => {
    navigator.clipboard.writeText(text).catch(() => {})
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setCopiedKey(key)
    timeoutRef.current = setTimeout(() => setCopiedKey(null), 2000)
  }, [])

  return { copiedKey, copy }
}

// ─── GLASS CARD ──────────────────────────────────────────────────────────────
function GlassCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("backdrop-blur-md bg-white/75 border border-white/[0.18] rounded-2xl shadow-lg", className)}>
      {children}
    </div>
  )
}

// ─── LOADING SKELETON SECTIONS ───────────────────────────────────────────────
function TrendLoadingSkeleton() {
  return (
    <div className="space-y-8 p-6">
      <div className="space-y-3">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="space-y-3 p-4 rounded-2xl bg-white/40">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="space-y-3 p-4 rounded-2xl bg-white/40">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  )
}

function ImageLoadingSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map(i => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-48 w-full rounded-2xl" />
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    </div>
  )
}

function ScriptLoadingSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <Skeleton className="h-6 w-56" />
      <Skeleton className="h-4 w-full" />
      {[1, 2].map(i => (
        <div key={i} className="space-y-3 p-4 rounded-2xl bg-white/40">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="space-y-2 mt-4">
            {[1, 2, 3].map(j => (
              <Skeleton key={j} className="h-3 w-full" />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── PROGRESS LOADER ─────────────────────────────────────────────────────────
function ProgressLoader({ label, sublabel }: { label: string; sublabel: string }) {
  const [progress, setProgress] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  React.useEffect(() => {
    intervalRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev
        return prev + Math.random() * 8
      })
    }, 800)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-orange-200" />
        <div className="absolute inset-0 rounded-full border-4 border-t-orange-500 animate-spin" />
      </div>
      <div className="text-center">
        <p className="font-semibold text-foreground">{label}</p>
        <p className="text-sm text-muted-foreground mt-1">{sublabel}</p>
      </div>
      <div className="w-64">
        <Progress value={progress} className="h-2" />
      </div>
    </div>
  )
}

// ─── VIRAL VIDEO CARD ────────────────────────────────────────────────────────
function ViralVideoCard({ video }: { video: ViralVideo }) {
  return (
    <GlassCard className="p-5 flex flex-col gap-3 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-semibold text-sm leading-tight flex-1">{video?.title ?? 'Untitled'}</h4>
        <Badge className="shrink-0 text-xs bg-orange-100 text-orange-800 border border-orange-200">{video?.category ?? 'N/A'}</Badge>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <FiVideo className="w-3 h-3" />
        <span>{video?.channel ?? 'Unknown'}</span>
        <span className="mx-1">|</span>
        <FiEye className="w-3 h-3" />
        <span className="font-medium text-foreground">{video?.views ?? '0'}</span>
      </div>
      <div className="flex items-center gap-1.5 text-xs">
        <FiHash className="w-3 h-3 text-muted-foreground" />
        <span className="text-muted-foreground">{video?.topic ?? 'General'}</span>
      </div>
      <Separator />
      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <FiZap className="w-3.5 h-3.5 text-orange-500 mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground">{video?.virality_reason ?? ''}</p>
        </div>
        <div className="flex items-start gap-2">
          <FiMessageCircle className="w-3.5 h-3.5 text-orange-500 mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground">{video?.engagement_notes ?? ''}</p>
        </div>
      </div>
    </GlassCard>
  )
}

// ─── INSIGHT CARD ────────────────────────────────────────────────────────────
function InsightCard({ insight, index }: { insight: Insight; index: number }) {
  return (
    <GlassCard className="p-5 flex flex-col gap-3 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
          {index + 1}
        </div>
        <p className="text-sm font-medium leading-snug">{insight?.insight ?? ''}</p>
      </div>
      <div className="flex items-start gap-2 bg-orange-50/60 rounded-xl p-3">
        <FiTarget className="w-4 h-4 text-orange-600 mt-0.5 shrink-0" />
        <p className="text-xs text-orange-800">{insight?.action_item ?? ''}</p>
      </div>
    </GlassCard>
  )
}

// ─── TEMPLATE CARD ───────────────────────────────────────────────────────────
function TemplateCard({ template }: { template: VideoTemplate }) {
  const [expanded, setExpanded] = useState(false)

  const segments = Array.isArray(template?.segments) ? template.segments : []

  return (
    <GlassCard className="p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <h4 className="font-semibold text-base">{template?.template_name ?? 'Untitled Template'}</h4>
          <p className="text-xs text-muted-foreground mt-1">{template?.best_for ?? ''}</p>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <Badge className={cn("text-xs border", getDifficultyColor(template?.difficulty ?? ''))}>{template?.difficulty ?? 'Unknown'}</Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <FiClock className="w-3 h-3" />
            <span>{template?.target_duration ?? 'N/A'}</span>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-2 text-xs text-muted-foreground">
        <FiLayers className="w-3.5 h-3.5 mt-0.5 shrink-0 text-orange-500" />
        <span>{template?.viral_patterns_used ?? ''}</span>
      </div>

      <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-1.5 text-xs font-medium text-orange-600 hover:text-orange-700 transition-colors self-start">
        {expanded ? <FiChevronUp className="w-3.5 h-3.5" /> : <FiChevronDown className="w-3.5 h-3.5" />}
        {expanded ? 'Hide' : 'Show'} Segments ({segments.length})
      </button>

      {expanded && (
        <div className="space-y-3 mt-1">
          {segments.map((seg, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className="flex flex-col items-center shrink-0">
                <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-orange-400 to-red-400 mt-1.5" />
                {i < segments.length - 1 && <div className="w-px flex-1 bg-orange-200 mt-1" />}
              </div>
              <div className="flex-1 pb-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{seg?.segment_name ?? ''}</span>
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">{seg?.timing ?? ''}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{seg?.description ?? ''}</p>
                {seg?.tips && (
                  <div className="flex items-start gap-1.5 mt-1.5 text-xs text-orange-700 bg-orange-50/60 rounded-lg p-2">
                    <FiStar className="w-3 h-3 mt-0.5 shrink-0" />
                    <span>{seg.tips}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
          <Separator />
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-muted-foreground">CTA Placement:</span>
              <p className="font-medium mt-0.5">{template?.cta_placement ?? 'N/A'}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Transition Style:</span>
              <p className="font-medium mt-0.5">{template?.transition_style ?? 'N/A'}</p>
            </div>
          </div>
        </div>
      )}
    </GlassCard>
  )
}

// ─── SCRIPT CARD ─────────────────────────────────────────────────────────────
function ScriptCard({ script }: { script: VideoScript }) {
  const [showBody, setShowBody] = useState(false)
  const [showProd, setShowProd] = useState(false)
  const { copiedKey, copy } = useCopyClipboard()

  const bodySegments = Array.isArray(script?.script_body) ? script.script_body : []
  const plan = script?.production_plan

  const fullScriptText = useMemo(() => {
    let text = `Title: ${script?.title ?? ''}\n\nHook: ${script?.hook ?? ''}\n\n`
    bodySegments.forEach(seg => {
      text += `[${seg?.timestamp ?? ''}] ${seg?.section ?? ''}\n${seg?.content ?? ''}\nDelivery: ${seg?.delivery_notes ?? ''}\n\n`
    })
    text += `CTA: ${script?.cta ?? ''}\n\nOutro: ${script?.outro ?? ''}`
    return text
  }, [script, bodySegments])

  return (
    <GlassCard className="p-6 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h4 className="font-semibold text-base">{script?.title ?? 'Untitled Script'}</h4>
          <p className="text-xs text-muted-foreground mt-1">{script?.viral_styles_blended ?? ''}</p>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <Badge className={cn("text-xs border", getViralColor(script?.viral_potential ?? ''))}>
            <FiTrendingUp className="w-3 h-3 mr-1" />
            {script?.viral_potential ?? 'Unknown'}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <FiClock className="w-3 h-3" />
            <span>{script?.target_duration ?? 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Hook section */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200/50 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <FiZap className="w-4 h-4 text-orange-600" />
          <span className="text-xs font-semibold text-orange-700 uppercase tracking-wider">Hook</span>
        </div>
        <p className="text-sm italic text-foreground leading-relaxed">{script?.hook ?? ''}</p>
      </div>

      {/* Script Body Toggle */}
      <button onClick={() => setShowBody(!showBody)} className="flex items-center gap-1.5 text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors self-start">
        {showBody ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
        {showBody ? 'Hide' : 'Show'} Script Body ({bodySegments.length} segments)
      </button>

      {showBody && (
        <div className="space-y-4">
          {bodySegments.map((seg, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className="flex flex-col items-center shrink-0">
                <div className="w-3 h-3 rounded-full bg-gradient-to-br from-orange-400 to-red-400 mt-1" />
                {i < bodySegments.length - 1 && <div className="w-px flex-1 bg-orange-200 mt-1" />}
              </div>
              <div className="flex-1 pb-2">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">{seg?.timestamp ?? ''}</Badge>
                  <span className="font-medium text-sm">{seg?.section ?? ''}</span>
                </div>
                <p className="text-sm text-foreground mt-1">{seg?.content ?? ''}</p>
                {seg?.delivery_notes && (
                  <div className="flex items-start gap-1.5 mt-2 text-xs text-amber-700 bg-amber-50/60 rounded-lg p-2">
                    <FiActivity className="w-3 h-3 mt-0.5 shrink-0" />
                    <span>{seg.delivery_notes}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CTA & Outro */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {script?.cta && (
          <div className="bg-green-50/60 border border-green-200/50 rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <FiThumbsUp className="w-3.5 h-3.5 text-green-600" />
              <span className="text-xs font-semibold text-green-700 uppercase tracking-wider">CTA</span>
            </div>
            <p className="text-xs text-green-800">{script.cta}</p>
          </div>
        )}
        {script?.outro && (
          <div className="bg-blue-50/60 border border-blue-200/50 rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <FiPlay className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Outro</span>
            </div>
            <p className="text-xs text-blue-800">{script.outro}</p>
          </div>
        )}
      </div>

      {/* Production Plan Toggle */}
      {plan && (
        <>
          <button onClick={() => setShowProd(!showProd)} className="flex items-center gap-1.5 text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors self-start">
            {showProd ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
            {showProd ? 'Hide' : 'Show'} Production Plan
          </button>

          {showProd && (
            <div className="bg-white/40 rounded-xl p-4 space-y-3 border border-white/20">
              <h5 className="font-semibold text-sm flex items-center gap-2">
                <FiCamera className="w-4 h-4 text-orange-500" />
                Production Plan
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-muted-foreground font-medium uppercase tracking-wider text-[10px]">Shot List</span>
                  <p className="mt-1">{plan?.shot_list ?? 'N/A'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground font-medium uppercase tracking-wider text-[10px]">Equipment</span>
                  <p className="mt-1">{plan?.equipment ?? 'N/A'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground font-medium uppercase tracking-wider text-[10px]">Editing Style</span>
                  <p className="mt-1">{plan?.editing_style ?? 'N/A'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground font-medium uppercase tracking-wider text-[10px]">Music</span>
                  <p className="mt-1">{plan?.music_suggestions ?? 'N/A'}</p>
                </div>
              </div>
              {plan?.thumbnail_concept && (
                <div className="text-xs">
                  <span className="text-muted-foreground font-medium uppercase tracking-wider text-[10px]">Thumbnail Concept</span>
                  <p className="mt-1">{plan.thumbnail_concept}</p>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Copy button */}
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={() => copy(fullScriptText, `script-${script?.title ?? ''}`)} className="text-xs gap-1.5">
          {copiedKey === `script-${script?.title ?? ''}` ? <><FiCheck className="w-3.5 h-3.5 text-green-600" /> Copied!</> : <><FiCopy className="w-3.5 h-3.5" /> Copy Script</>}
        </Button>
      </div>
    </GlassCard>
  )
}

// ─── AGENT STATUS ────────────────────────────────────────────────────────────
function AgentStatusPanel({ activeAgentId }: { activeAgentId: string | null }) {
  const agents = [
    { id: TREND_MANAGER_ID, name: 'Viral Trend Manager', desc: 'Analyzes viral YouTube trends, styles, and patterns', icon: FiTrendingUp },
    { id: IMAGE_AGENT_ID, name: 'Thumbnail & Image Agent', desc: 'Generates thumbnail concepts and visual assets', icon: FiImage },
    { id: SCRIPT_AGENT_ID, name: 'Script & Video Agent', desc: 'Creates video scripts with production plans', icon: FiFileText }
  ]

  return (
    <GlassCard className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <FiActivity className="w-4 h-4 text-orange-500" />
        <h3 className="text-sm font-semibold">AI Agents</h3>
      </div>
      <div className="space-y-2">
        {agents.map(agent => {
          const isActive = activeAgentId === agent.id
          const AgentIcon = agent.icon
          return (
            <div key={agent.id} className={cn("flex items-center gap-3 p-2 rounded-xl transition-all duration-300", isActive ? "bg-orange-50 border border-orange-200" : "bg-white/30")}>
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", isActive ? "bg-orange-500 text-white" : "bg-white/60 text-muted-foreground")}>
                <AgentIcon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{agent.name}</p>
                <p className="text-[10px] text-muted-foreground truncate">{agent.desc}</p>
              </div>
              <div className="shrink-0">
                {isActive ? (
                  <div className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
                ) : (
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </GlassCard>
  )
}

// ─── ERROR BOUNDARY ──────────────────────────────────────────────────────────
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, error: '' }
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
          <div className="text-center p-8 max-w-md">
            <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-muted-foreground mb-4 text-sm">{this.state.error}</p>
            <button onClick={() => this.setState({ hasError: false, error: '' })} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm">
              Try again
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────
export default function Page() {
  // State
  const [step, setStep] = useState<'dashboard' | 'results'>('dashboard')
  const [sampleMode, setSampleMode] = useState(false)
  const [trendLoading, setTrendLoading] = useState(false)
  const [trendData, setTrendData] = useState<TrendData | null>(null)
  const [imageLoading, setImageLoading] = useState(false)
  const [imageData, setImageData] = useState<ImageData | null>(null)
  const [generatedImages, setGeneratedImages] = useState<ArtifactFile[]>([])
  const [scriptLoading, setScriptLoading] = useState(false)
  const [scriptData, setScriptData] = useState<ScriptData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null)
  const [resultsTab, setResultsTab] = useState('overview')

  const { copiedKey, copy } = useCopyClipboard()

  // Displayed data (sample or real)
  const displayTrend = sampleMode ? SAMPLE_TREND_DATA : trendData
  const displayImage = sampleMode ? SAMPLE_IMAGE_DATA : imageData
  const displayScript = sampleMode ? SAMPLE_SCRIPT_DATA : scriptData
  const displayImages = sampleMode ? [] : generatedImages

  // ── ANALYZE TRENDS ─────────────────────────────────────────────────────────
  const analyzeTrends = useCallback(async () => {
    setTrendLoading(true)
    setError(null)
    setActiveAgentId(TREND_MANAGER_ID)
    try {
      const result = await callAIAgent(
        'Analyze the most viral YouTube videos from the past week. Find trending videos, analyze their styles, and generate reusable video structure templates.',
        TREND_MANAGER_ID
      )
      if (result.success) {
        let parsed = safeParseJSON(result?.response?.result)
        if (!parsed) {
          parsed = safeParseJSON(result?.response)
        }
        if (parsed) {
          setTrendData(parsed as TrendData)
          setStep('results')
        } else {
          setError('Could not parse trend analysis response. Please try again.')
        }
      } else {
        setError(result?.error ?? result?.response?.message ?? 'Failed to analyze trends. Please try again.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.')
    } finally {
      setTrendLoading(false)
      setActiveAgentId(null)
    }
  }, [])

  // ── GENERATE VISUALS ───────────────────────────────────────────────────────
  const generateVisuals = useCallback(async () => {
    if (!displayTrend) return
    setImageLoading(true)
    setError(null)
    setActiveAgentId(IMAGE_AGENT_ID)

    const styleInfo = displayTrend?.style_analysis?.key_takeaways ?? ''
    const thumbnailPatterns = Array.isArray(displayTrend?.style_analysis?.thumbnail_patterns)
      ? displayTrend.style_analysis.thumbnail_patterns.map(p => `${p?.pattern ?? ''}: ${p?.description ?? ''}`).join('. ')
      : ''

    try {
      const result = await callAIAgent(
        `Based on these viral YouTube trends, generate thumbnail concepts and key frame visuals inspired by trending viral video aesthetics. Create compelling, click-worthy thumbnails that follow these patterns: ${styleInfo} Thumbnail patterns found: ${thumbnailPatterns}`,
        IMAGE_AGENT_ID
      )
      if (result.success) {
        let parsed = safeParseJSON(result?.response?.result)
        if (!parsed) {
          parsed = safeParseJSON(result?.response)
        }
        if (parsed) {
          setImageData(parsed as ImageData)
        }

        const artifacts = result?.module_outputs?.artifact_files
        if (Array.isArray(artifacts)) {
          setGeneratedImages(artifacts)
        }
        setResultsTab('visuals')
      } else {
        setError(result?.error ?? result?.response?.message ?? 'Failed to generate visuals. Please try again.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.')
    } finally {
      setImageLoading(false)
      setActiveAgentId(null)
    }
  }, [displayTrend])

  // ── GENERATE SCRIPTS ───────────────────────────────────────────────────────
  const generateScripts = useCallback(async () => {
    if (!displayTrend) return
    setScriptLoading(true)
    setError(null)
    setActiveAgentId(SCRIPT_AGENT_ID)

    const summary = displayTrend?.executive_summary ?? ''
    const hookPatterns = Array.isArray(displayTrend?.style_analysis?.hook_patterns)
      ? displayTrend.style_analysis.hook_patterns.map(h => `${h?.pattern_name ?? ''}: ${h?.description ?? ''}`).join('. ')
      : ''

    try {
      const result = await callAIAgent(
        `Based on these viral YouTube trends and patterns, write hybrid scripts that blend multiple viral styles into original content. Create 2-3 complete video scripts with production plans. Here are the trends and patterns to blend: ${summary}. Hook patterns: ${hookPatterns}`,
        SCRIPT_AGENT_ID
      )
      if (result.success) {
        let parsed = safeParseJSON(result?.response?.result)
        if (!parsed) {
          parsed = safeParseJSON(result?.response)
        }
        if (parsed) {
          setScriptData(parsed as ScriptData)
        } else {
          setError('Could not parse script response. Please try again.')
        }
        setResultsTab('scripts')
      } else {
        setError(result?.error ?? result?.response?.message ?? 'Failed to generate scripts. Please try again.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.')
    } finally {
      setScriptLoading(false)
      setActiveAgentId(null)
    }
  }, [displayTrend])

  // ── DERIVED VALUES ─────────────────────────────────────────────────────────
  const viralVideos = Array.isArray(displayTrend?.viral_videos) ? displayTrend.viral_videos : []
  const topInsights = Array.isArray(displayTrend?.top_insights) ? displayTrend.top_insights : []
  const hookPatterns = Array.isArray(displayTrend?.style_analysis?.hook_patterns) ? displayTrend.style_analysis.hook_patterns : []
  const pacingAnalysis = Array.isArray(displayTrend?.style_analysis?.pacing_analysis) ? displayTrend.style_analysis.pacing_analysis : []
  const tonePatterns = Array.isArray(displayTrend?.style_analysis?.tone_patterns) ? displayTrend.style_analysis.tone_patterns : []
  const thumbnailPatterns = Array.isArray(displayTrend?.style_analysis?.thumbnail_patterns) ? displayTrend.style_analysis.thumbnail_patterns : []
  const engagementTactics = Array.isArray(displayTrend?.style_analysis?.engagement_tactics) ? displayTrend.style_analysis.engagement_tactics : []
  const videoTemplates = Array.isArray(displayTrend?.video_templates) ? displayTrend.video_templates : []
  const thumbnailConcepts = Array.isArray(displayImage?.thumbnail_concepts) ? displayImage.thumbnail_concepts : []
  const scripts = Array.isArray(displayScript?.scripts) ? displayScript.scripts : []

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background text-foreground" style={{ background: 'linear-gradient(135deg, hsl(30 50% 97%) 0%, hsl(20 45% 95%) 35%, hsl(40 40% 96%) 70%, hsl(15 35% 97%) 100%)' }}>
        <ScrollArea className="h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

            {/* ── HEADER ─────────────────────────────────────────────────── */}
            <header className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/25">
                  <FiTrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight font-sans">ViralFlow</h1>
                  <p className="text-xs text-muted-foreground">YouTube Viral Content Replicator</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                  <span>Sample Data</span>
                  <Switch checked={sampleMode} onCheckedChange={(checked) => {
                    setSampleMode(checked)
                    if (checked) setStep('results')
                  }} />
                </label>
              </div>
            </header>

            {/* ── ERROR DISPLAY ───────────────────────────────────────────── */}
            {error && (
              <GlassCard className="p-4 mb-6 border-red-200/50 bg-red-50/60">
                <div className="flex items-start gap-3">
                  <FiAlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-800">Error</p>
                    <p className="text-xs text-red-600 mt-1">{error}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setError(null)} className="text-xs shrink-0">
                    Dismiss
                  </Button>
                </div>
              </GlassCard>
            )}

            {/* ── DASHBOARD (STEP 1) ─────────────────────────────────────── */}
            {step === 'dashboard' && !sampleMode && (
              <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8">
                <div className="text-center max-w-2xl">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-500 via-red-500 to-amber-500 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-orange-500/30">
                    <FiTrendingUp className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight mb-3">Discover What Makes Videos Go Viral</h2>
                  <p className="text-muted-foreground text-base leading-relaxed">
                    ViralFlow analyzes the most viral YouTube videos, deconstructs their styles and hooks, and generates ready-to-use scripts and thumbnails so you can replicate their success.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl w-full">
                  <GlassCard className="p-5 text-center">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center mx-auto mb-3">
                      <FiSearch className="w-5 h-5 text-orange-600" />
                    </div>
                    <h3 className="font-semibold text-sm mb-1">Trend Analysis</h3>
                    <p className="text-xs text-muted-foreground">Discover viral videos and decode their success patterns</p>
                  </GlassCard>
                  <GlassCard className="p-5 text-center">
                    <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center mx-auto mb-3">
                      <FiImage className="w-5 h-5 text-red-600" />
                    </div>
                    <h3 className="font-semibold text-sm mb-1">Visual Assets</h3>
                    <p className="text-xs text-muted-foreground">Generate click-worthy thumbnails and visual concepts</p>
                  </GlassCard>
                  <GlassCard className="p-5 text-center">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center mx-auto mb-3">
                      <FiFileText className="w-5 h-5 text-amber-600" />
                    </div>
                    <h3 className="font-semibold text-sm mb-1">Script Generation</h3>
                    <p className="text-xs text-muted-foreground">Create complete scripts with hooks and production plans</p>
                  </GlassCard>
                </div>

                {trendLoading ? (
                  <GlassCard className="w-full max-w-2xl">
                    <ProgressLoader label="Analyzing Viral Trends" sublabel="Researching viral videos, analyzing styles, building templates..." />
                  </GlassCard>
                ) : (
                  <Button onClick={analyzeTrends} size="lg" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg shadow-orange-500/25 px-8 py-6 text-base rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/30 hover:scale-[1.02]">
                    <FiZap className="w-5 h-5 mr-2" />
                    Analyze Viral Trends
                    <FiArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                )}
              </div>
            )}

            {/* ── RESULTS (STEP 2+) ──────────────────────────────────────── */}
            {(step === 'results' || sampleMode) && (
              <div className="space-y-6">

                {/* Loading overlay for initial trends */}
                {trendLoading && (
                  <GlassCard>
                    <ProgressLoader label="Analyzing Viral Trends" sublabel="Researching viral videos, analyzing styles, building templates..." />
                    <TrendLoadingSkeleton />
                  </GlassCard>
                )}

                {displayTrend && !trendLoading && (
                  <>
                    {/* ── ACTION BAR ────────────────────────────────────────── */}
                    <div className="flex flex-wrap items-center gap-3">
                      <Button onClick={analyzeTrends} variant="outline" size="sm" disabled={trendLoading} className="gap-1.5 rounded-xl">
                        <FiRefreshCw className={cn("w-3.5 h-3.5", trendLoading && "animate-spin")} />
                        Re-analyze
                      </Button>
                      <Button onClick={generateVisuals} size="sm" disabled={imageLoading} className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white gap-1.5 rounded-xl shadow-md shadow-pink-500/20">
                        {imageLoading ? <FiRefreshCw className="w-3.5 h-3.5 animate-spin" /> : <FiImage className="w-3.5 h-3.5" />}
                        Generate Visuals
                      </Button>
                      <Button onClick={generateScripts} size="sm" disabled={scriptLoading} className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white gap-1.5 rounded-xl shadow-md shadow-violet-500/20">
                        {scriptLoading ? <FiRefreshCw className="w-3.5 h-3.5 animate-spin" /> : <FiFileText className="w-3.5 h-3.5" />}
                        Generate Scripts & Video Plan
                      </Button>
                    </div>

                    {/* ── TABS ──────────────────────────────────────────────── */}
                    <Tabs value={resultsTab} onValueChange={setResultsTab}>
                      <TabsList className="bg-white/60 backdrop-blur-sm rounded-xl p-1">
                        <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm gap-1.5 text-xs">
                          <FiLayout className="w-3.5 h-3.5" />
                          Overview
                        </TabsTrigger>
                        <TabsTrigger value="videos" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm gap-1.5 text-xs">
                          <FiVideo className="w-3.5 h-3.5" />
                          Videos ({viralVideos.length})
                        </TabsTrigger>
                        <TabsTrigger value="styles" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm gap-1.5 text-xs">
                          <FiLayers className="w-3.5 h-3.5" />
                          Styles
                        </TabsTrigger>
                        <TabsTrigger value="templates" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm gap-1.5 text-xs">
                          <FiGrid className="w-3.5 h-3.5" />
                          Templates ({videoTemplates.length})
                        </TabsTrigger>
                        <TabsTrigger value="visuals" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm gap-1.5 text-xs">
                          <FiImage className="w-3.5 h-3.5" />
                          Visuals
                        </TabsTrigger>
                        <TabsTrigger value="scripts" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm gap-1.5 text-xs">
                          <FiFileText className="w-3.5 h-3.5" />
                          Scripts
                        </TabsTrigger>
                      </TabsList>

                      {/* ── TAB: OVERVIEW ────────────────────────────────────── */}
                      <TabsContent value="overview" className="space-y-6 mt-6">
                        {/* Executive Summary */}
                        <GlassCard className="p-6">
                          <div className="flex items-center gap-2 mb-3">
                            <FiBookOpen className="w-5 h-5 text-orange-500" />
                            <h3 className="font-semibold text-lg">Executive Summary</h3>
                          </div>
                          <div className="text-sm text-foreground/90 leading-relaxed">
                            {renderMarkdown(displayTrend?.executive_summary ?? '')}
                          </div>
                          <Button variant="outline" size="sm" onClick={() => copy(displayTrend?.executive_summary ?? '', 'exec-summary')} className="mt-4 text-xs gap-1.5">
                            {copiedKey === 'exec-summary' ? <><FiCheck className="w-3 h-3 text-green-600" /> Copied!</> : <><FiCopy className="w-3 h-3" /> Copy</>}
                          </Button>
                        </GlassCard>

                        {/* Week Overview */}
                        {displayTrend?.week_overview && (
                          <GlassCard className="p-6">
                            <div className="flex items-center gap-2 mb-3">
                              <FiActivity className="w-5 h-5 text-orange-500" />
                              <h3 className="font-semibold text-lg">Week Overview</h3>
                            </div>
                            <div className="text-sm text-foreground/90 leading-relaxed">
                              {renderMarkdown(displayTrend.week_overview)}
                            </div>
                          </GlassCard>
                        )}

                        {/* Top Insights */}
                        {topInsights.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-4">
                              <FiStar className="w-5 h-5 text-orange-500" />
                              <h3 className="font-semibold text-lg">Top Insights</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {topInsights.map((insight, i) => (
                                <InsightCard key={i} insight={insight} index={i} />
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Key Takeaways */}
                        {displayTrend?.style_analysis?.key_takeaways && (
                          <GlassCard className="p-6 bg-gradient-to-r from-orange-50/80 to-amber-50/80 border-orange-200/30">
                            <div className="flex items-center gap-2 mb-3">
                              <FiAward className="w-5 h-5 text-orange-600" />
                              <h3 className="font-semibold text-base text-orange-900">Key Takeaways</h3>
                            </div>
                            <div className="text-sm text-orange-800 leading-relaxed">
                              {renderMarkdown(displayTrend.style_analysis.key_takeaways)}
                            </div>
                          </GlassCard>
                        )}
                      </TabsContent>

                      {/* ── TAB: VIRAL VIDEOS ────────────────────────────────── */}
                      <TabsContent value="videos" className="space-y-6 mt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FiVideo className="w-5 h-5 text-orange-500" />
                            <h3 className="font-semibold text-lg">Viral Videos Found</h3>
                          </div>
                          <Badge variant="secondary" className="text-xs">{viralVideos.length} videos</Badge>
                        </div>
                        {viralVideos.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {viralVideos.map((video, i) => (
                              <ViralVideoCard key={i} video={video} />
                            ))}
                          </div>
                        ) : (
                          <GlassCard className="p-8 text-center text-muted-foreground">
                            <FiVideo className="w-8 h-8 mx-auto mb-2 opacity-40" />
                            <p className="text-sm">No viral videos data available yet.</p>
                          </GlassCard>
                        )}
                      </TabsContent>

                      {/* ── TAB: STYLES ───────────────────────────────────────── */}
                      <TabsContent value="styles" className="space-y-6 mt-6">
                        <div className="flex items-center gap-2 mb-2">
                          <FiLayers className="w-5 h-5 text-orange-500" />
                          <h3 className="font-semibold text-lg">Style Analysis</h3>
                        </div>

                        <Accordion type="multiple" className="space-y-3">
                          {/* Hook Patterns */}
                          {hookPatterns.length > 0 && (
                            <AccordionItem value="hooks" className="border-none">
                              <GlassCard className="overflow-hidden">
                                <AccordionTrigger className="px-5 py-4 hover:no-underline">
                                  <div className="flex items-center gap-2">
                                    <FiZap className="w-4 h-4 text-orange-500" />
                                    <span className="font-semibold text-sm">Hook Patterns</span>
                                    <Badge variant="secondary" className="text-[10px] ml-1">{hookPatterns.length}</Badge>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-5 pb-5">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {hookPatterns.map((h, i) => (
                                      <div key={i} className="bg-white/40 rounded-xl p-4 space-y-2 border border-white/20">
                                        <div className="flex items-center justify-between">
                                          <h5 className="font-medium text-sm">{h?.pattern_name ?? ''}</h5>
                                          <Badge className={cn("text-[10px] border", getViralColor(h?.effectiveness ?? ''))}>{h?.effectiveness ?? ''}</Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground">{h?.description ?? ''}</p>
                                        {h?.example && (
                                          <div className="bg-orange-50/60 rounded-lg p-2 text-xs italic text-orange-800">
                                            {h.example}
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </AccordionContent>
                              </GlassCard>
                            </AccordionItem>
                          )}

                          {/* Pacing Analysis */}
                          {pacingAnalysis.length > 0 && (
                            <AccordionItem value="pacing" className="border-none">
                              <GlassCard className="overflow-hidden">
                                <AccordionTrigger className="px-5 py-4 hover:no-underline">
                                  <div className="flex items-center gap-2">
                                    <FiPlay className="w-4 h-4 text-orange-500" />
                                    <span className="font-semibold text-sm">Pacing Analysis</span>
                                    <Badge variant="secondary" className="text-[10px] ml-1">{pacingAnalysis.length}</Badge>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-5 pb-5">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {pacingAnalysis.map((p, i) => (
                                      <div key={i} className="bg-white/40 rounded-xl p-4 space-y-2 border border-white/20">
                                        <h5 className="font-medium text-sm">{p?.style ?? ''}</h5>
                                        <p className="text-xs text-muted-foreground">{p?.description ?? ''}</p>
                                        <div className="flex items-center gap-1.5 text-xs">
                                          <FiTarget className="w-3 h-3 text-orange-500" />
                                          <span className="text-orange-700">{p?.best_for ?? ''}</span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </AccordionContent>
                              </GlassCard>
                            </AccordionItem>
                          )}

                          {/* Tone Patterns */}
                          {tonePatterns.length > 0 && (
                            <AccordionItem value="tone" className="border-none">
                              <GlassCard className="overflow-hidden">
                                <AccordionTrigger className="px-5 py-4 hover:no-underline">
                                  <div className="flex items-center gap-2">
                                    <FiMusic className="w-4 h-4 text-orange-500" />
                                    <span className="font-semibold text-sm">Tone Patterns</span>
                                    <Badge variant="secondary" className="text-[10px] ml-1">{tonePatterns.length}</Badge>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-5 pb-5">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {tonePatterns.map((t, i) => (
                                      <div key={i} className="bg-white/40 rounded-xl p-4 space-y-2 border border-white/20">
                                        <div className="flex items-center justify-between">
                                          <h5 className="font-medium text-sm">{t?.tone ?? ''}</h5>
                                          <Badge variant="outline" className="text-[10px]">{t?.usage_frequency ?? ''}</Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground">{t?.description ?? ''}</p>
                                      </div>
                                    ))}
                                  </div>
                                </AccordionContent>
                              </GlassCard>
                            </AccordionItem>
                          )}

                          {/* Thumbnail Patterns */}
                          {thumbnailPatterns.length > 0 && (
                            <AccordionItem value="thumbnails" className="border-none">
                              <GlassCard className="overflow-hidden">
                                <AccordionTrigger className="px-5 py-4 hover:no-underline">
                                  <div className="flex items-center gap-2">
                                    <FiImage className="w-4 h-4 text-orange-500" />
                                    <span className="font-semibold text-sm">Thumbnail Patterns</span>
                                    <Badge variant="secondary" className="text-[10px] ml-1">{thumbnailPatterns.length}</Badge>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-5 pb-5">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {thumbnailPatterns.map((tp, i) => (
                                      <div key={i} className="bg-white/40 rounded-xl p-4 space-y-2 border border-white/20">
                                        <div className="flex items-center justify-between">
                                          <h5 className="font-medium text-sm">{tp?.pattern ?? ''}</h5>
                                          <Badge className="text-[10px] bg-green-100 text-green-800 border border-green-200">{tp?.impact ?? ''}</Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground">{tp?.description ?? ''}</p>
                                      </div>
                                    ))}
                                  </div>
                                </AccordionContent>
                              </GlassCard>
                            </AccordionItem>
                          )}

                          {/* Engagement Tactics */}
                          {engagementTactics.length > 0 && (
                            <AccordionItem value="engagement" className="border-none">
                              <GlassCard className="overflow-hidden">
                                <AccordionTrigger className="px-5 py-4 hover:no-underline">
                                  <div className="flex items-center gap-2">
                                    <FiTarget className="w-4 h-4 text-orange-500" />
                                    <span className="font-semibold text-sm">Engagement Tactics</span>
                                    <Badge variant="secondary" className="text-[10px] ml-1">{engagementTactics.length}</Badge>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-5 pb-5">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {engagementTactics.map((et, i) => (
                                      <div key={i} className="bg-white/40 rounded-xl p-4 space-y-2 border border-white/20">
                                        <div className="flex items-center justify-between">
                                          <h5 className="font-medium text-sm">{et?.tactic ?? ''}</h5>
                                          <Badge className={cn("text-[10px] border", getViralColor(et?.effectiveness ?? ''))}>{et?.effectiveness ?? ''}</Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground">{et?.description ?? ''}</p>
                                      </div>
                                    ))}
                                  </div>
                                </AccordionContent>
                              </GlassCard>
                            </AccordionItem>
                          )}
                        </Accordion>
                      </TabsContent>

                      {/* ── TAB: TEMPLATES ────────────────────────────────────── */}
                      <TabsContent value="templates" className="space-y-6 mt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FiGrid className="w-5 h-5 text-orange-500" />
                            <h3 className="font-semibold text-lg">Video Templates</h3>
                          </div>
                          <Badge variant="secondary" className="text-xs">{videoTemplates.length} templates</Badge>
                        </div>
                        {videoTemplates.length > 0 ? (
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {videoTemplates.map((tmpl, i) => (
                              <TemplateCard key={i} template={tmpl} />
                            ))}
                          </div>
                        ) : (
                          <GlassCard className="p-8 text-center text-muted-foreground">
                            <FiGrid className="w-8 h-8 mx-auto mb-2 opacity-40" />
                            <p className="text-sm">No video templates available yet.</p>
                          </GlassCard>
                        )}
                      </TabsContent>

                      {/* ── TAB: VISUALS ──────────────────────────────────────── */}
                      <TabsContent value="visuals" className="space-y-6 mt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FiImage className="w-5 h-5 text-orange-500" />
                            <h3 className="font-semibold text-lg">Generated Visuals</h3>
                          </div>
                          {!displayImage && !imageLoading && (
                            <Button onClick={generateVisuals} size="sm" disabled={imageLoading} className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white gap-1.5 rounded-xl text-xs">
                              <FiImage className="w-3.5 h-3.5" />
                              Generate Visuals
                            </Button>
                          )}
                        </div>

                        {imageLoading && (
                          <GlassCard>
                            <ProgressLoader label="Generating Visuals" sublabel="Creating thumbnail concepts and visual assets..." />
                            <ImageLoadingSkeleton />
                          </GlassCard>
                        )}

                        {!imageLoading && !displayImage && (
                          <GlassCard className="p-12 text-center">
                            <FiImage className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
                            <h4 className="font-semibold text-base mb-1">No visuals generated yet</h4>
                            <p className="text-sm text-muted-foreground mb-4">Click "Generate Visuals" to create thumbnail concepts based on the trend analysis.</p>
                            <Button onClick={generateVisuals} size="sm" className="bg-gradient-to-r from-pink-500 to-rose-500 text-white gap-1.5 rounded-xl">
                              <FiImage className="w-3.5 h-3.5" />
                              Generate Now
                            </Button>
                          </GlassCard>
                        )}

                        {displayImage && !imageLoading && (
                          <div className="space-y-6">
                            {/* Design Notes */}
                            {displayImage?.design_notes && (
                              <GlassCard className="p-5 bg-gradient-to-r from-pink-50/80 to-rose-50/80 border-pink-200/30">
                                <div className="flex items-center gap-2 mb-2">
                                  <FiStar className="w-4 h-4 text-pink-600" />
                                  <h4 className="font-semibold text-sm text-pink-900">Design Notes</h4>
                                </div>
                                <div className="text-sm text-pink-800">
                                  {renderMarkdown(displayImage.design_notes)}
                                </div>
                              </GlassCard>
                            )}

                            {/* Generated Images Gallery */}
                            {displayImages.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-base mb-3 flex items-center gap-2">
                                  <FiCamera className="w-4 h-4 text-orange-500" />
                                  Generated Images
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                  {displayImages.map((img, i) => (
                                    <GlassCard key={i} className="overflow-hidden">
                                      <div className="aspect-video relative bg-gray-100 rounded-t-2xl overflow-hidden">
                                        <img src={img?.file_url ?? ''} alt={img?.name ?? `Generated image ${i + 1}`} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                                      </div>
                                      <div className="p-3">
                                        <p className="text-xs font-medium truncate">{img?.name ?? `Image ${i + 1}`}</p>
                                        <p className="text-[10px] text-muted-foreground">{img?.format_type ?? 'image'}</p>
                                      </div>
                                    </GlassCard>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Thumbnail Concepts */}
                            {thumbnailConcepts.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-base mb-3 flex items-center gap-2">
                                  <FiLayout className="w-4 h-4 text-orange-500" />
                                  Thumbnail Concepts
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {thumbnailConcepts.map((concept, i) => (
                                    <GlassCard key={i} className="p-5 space-y-3">
                                      <h5 className="font-semibold text-sm">{concept?.concept_name ?? `Concept ${i + 1}`}</h5>
                                      <p className="text-xs text-muted-foreground">{concept?.description ?? ''}</p>
                                      <div className="space-y-2">
                                        <div className="flex items-start gap-2 text-xs">
                                          <FiLayers className="w-3.5 h-3.5 text-pink-500 mt-0.5 shrink-0" />
                                          <div>
                                            <span className="text-muted-foreground">Patterns Used:</span>
                                            <span className="ml-1">{concept?.viral_patterns_used ?? 'N/A'}</span>
                                          </div>
                                        </div>
                                        <div className="flex items-start gap-2 text-xs">
                                          <FiTarget className="w-3.5 h-3.5 text-pink-500 mt-0.5 shrink-0" />
                                          <div>
                                            <span className="text-muted-foreground">Target Niche:</span>
                                            <span className="ml-1">{concept?.target_niche ?? 'N/A'}</span>
                                          </div>
                                        </div>
                                      </div>
                                      {concept?.image_prompt && (
                                        <div className="bg-pink-50/60 rounded-xl p-3 text-xs text-pink-800">
                                          <span className="font-medium">Prompt: </span>
                                          {concept.image_prompt}
                                        </div>
                                      )}
                                    </GlassCard>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </TabsContent>

                      {/* ── TAB: SCRIPTS ──────────────────────────────────────── */}
                      <TabsContent value="scripts" className="space-y-6 mt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FiFileText className="w-5 h-5 text-orange-500" />
                            <h3 className="font-semibold text-lg">Scripts & Video Plans</h3>
                          </div>
                          {!displayScript && !scriptLoading && (
                            <Button onClick={generateScripts} size="sm" disabled={scriptLoading} className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white gap-1.5 rounded-xl text-xs">
                              <FiFileText className="w-3.5 h-3.5" />
                              Generate Scripts
                            </Button>
                          )}
                        </div>

                        {scriptLoading && (
                          <GlassCard>
                            <ProgressLoader label="Generating Scripts" sublabel="Creating hybrid scripts with production plans..." />
                            <ScriptLoadingSkeleton />
                          </GlassCard>
                        )}

                        {!scriptLoading && !displayScript && (
                          <GlassCard className="p-12 text-center">
                            <FiFileText className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
                            <h4 className="font-semibold text-base mb-1">No scripts generated yet</h4>
                            <p className="text-sm text-muted-foreground mb-4">Click "Generate Scripts & Video Plan" to create complete scripts based on the trend analysis.</p>
                            <Button onClick={generateScripts} size="sm" className="bg-gradient-to-r from-violet-500 to-purple-500 text-white gap-1.5 rounded-xl">
                              <FiFileText className="w-3.5 h-3.5" />
                              Generate Now
                            </Button>
                          </GlassCard>
                        )}

                        {displayScript && !scriptLoading && (
                          <div className="space-y-6">
                            {/* Overall Strategy */}
                            {displayScript?.overall_strategy && (
                              <GlassCard className="p-5 bg-gradient-to-r from-violet-50/80 to-purple-50/80 border-violet-200/30">
                                <div className="flex items-center gap-2 mb-2">
                                  <FiTarget className="w-4 h-4 text-violet-600" />
                                  <h4 className="font-semibold text-sm text-violet-900">Overall Strategy</h4>
                                </div>
                                <div className="text-sm text-violet-800">
                                  {renderMarkdown(displayScript.overall_strategy)}
                                </div>
                                <Button variant="outline" size="sm" onClick={() => copy(displayScript?.overall_strategy ?? '', 'strategy')} className="mt-3 text-xs gap-1.5">
                                  {copiedKey === 'strategy' ? <><FiCheck className="w-3 h-3 text-green-600" /> Copied!</> : <><FiCopy className="w-3 h-3" /> Copy</>}
                                </Button>
                              </GlassCard>
                            )}

                            {/* Script Cards */}
                            {scripts.length > 0 ? (
                              <div className="space-y-6">
                                {scripts.map((script, i) => (
                                  <ScriptCard key={i} script={script} />
                                ))}
                              </div>
                            ) : (
                              <GlassCard className="p-8 text-center text-muted-foreground">
                                <FiFileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
                                <p className="text-sm">No scripts available.</p>
                              </GlassCard>
                            )}
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </>
                )}

                {/* No data and not loading */}
                {!displayTrend && !trendLoading && (
                  <GlassCard className="p-12 text-center">
                    <FiTrendingUp className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
                    <h4 className="font-semibold text-base mb-1">Ready to Analyze</h4>
                    <p className="text-sm text-muted-foreground mb-4">Click the button below or turn on Sample Data to explore the interface.</p>
                    <Button onClick={analyzeTrends} size="lg" className="bg-gradient-to-r from-orange-500 to-red-500 text-white gap-2 rounded-xl">
                      <FiZap className="w-4 h-4" />
                      Analyze Viral Trends
                    </Button>
                  </GlassCard>
                )}
              </div>
            )}

            {/* ── AGENT STATUS PANEL ─────────────────────────────────────── */}
            <div className="mt-8 mb-20">
              <AgentStatusPanel activeAgentId={activeAgentId} />
            </div>

          </div>
        </ScrollArea>
      </div>
    </ErrorBoundary>
  )
}
