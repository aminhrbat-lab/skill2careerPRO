import { useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  BrowserRouter,
  NavLink,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import type { Session } from '@supabase/supabase-js';
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  LogOut,
  Menu,
  Search,
  ShieldCheck,
  X,
} from 'lucide-react';
import { isSupabaseConfigured, supabase } from './lib/supabase';

interface ExamCategory {
  id: 'excel' | 'situation' | 'analytical' | 'management';
  label: string;
  questions: number;
  minutes: number;
  focus: string;
}

const EXAM_CATEGORIES: ExamCategory[] = [
  {
    id: 'excel',
    label: 'Excel Proficiency',
    questions: 12,
    minutes: 12,
    focus: 'Lookup formulas, pivot summaries, data cleaning, conditional logic, and financial tables.',
  },
  {
    id: 'situation',
    label: 'Situation Handling',
    questions: 4,
    minutes: 4,
    focus: 'Workplace prioritization, stakeholder communication, conflict resolution, and deadline trade-offs.',
  },
  {
    id: 'analytical',
    label: 'Analytical Reasoning',
    questions: 2,
    minutes: 2,
    focus: 'Metric interpretation, trend diagnostics, root-cause analysis, and structured problem breakdown.',
  },
  {
    id: 'management',
    label: 'Management Basics',
    questions: 2,
    minutes: 2,
    focus: 'Task delegation, goal alignment, resource planning, and cross-functional accountability.',
  },
];

interface CvSectionItem {
  id: string;
  title: string;
  guidance: string;
  weight: number;
}

const CV_CHECKLIST: CvSectionItem[] = [
  {
    id: 'header',
    title: 'Contact & LinkedIn Header',
    guidance: 'Full name, verified email, city, and clean LinkedIn profile URL without decorative icons.',
    weight: 15,
  },
  {
    id: 'summary',
    title: 'Targeted Career Summary',
    guidance: '2–3 concise lines aligning core analytical or operational strengths with the target role.',
    weight: 20,
  },
  {
    id: 'experience',
    title: 'Quantified Experience & Projects',
    guidance: 'Action verbs paired with measurable outcomes, tools used, and clear timelines.',
    weight: 35,
  },
  {
    id: 'skills',
    title: 'Structured Core Skills',
    guidance: 'Plain-text grouped skills (Excel, SQL, Reporting, Operations) readable by ATS parsers.',
    weight: 20,
  },
  {
    id: 'education',
    title: 'Education & Certifications',
    guidance: 'Degree, institution, graduation year, and verified Skill2Career assessment credentials.',
    weight: 10,
  },
];

interface JobPreviewItem {
  id: string;
  title: string;
  company: string;
  location: string;
  track: 'Data & Excel' | 'Operations' | 'Management';
  type: string;
  summary: string;
}

const SAMPLE_ROLE_TRACKS: JobPreviewItem[] = [
  {
    id: 'role-1',
    title: 'Junior Business & Excel Analyst',
    company: 'Northbridge Logistics',
    location: 'Dhaka · Hybrid',
    track: 'Data & Excel',
    type: 'Full-Time',
    summary: 'Build weekly KPI workbooks, reconcile shipment tables, and automate variance reporting.',
  },
  {
    id: 'role-2',
    title: 'Operations Coordinator',
    company: 'Meridian Commerce',
    location: 'Remote',
    track: 'Operations',
    type: 'Full-Time',
    summary: 'Coordinate vendor SLAs, triage fulfillment escalations, and maintain inventory trackers.',
  },
  {
    id: 'role-3',
    title: 'Management Trainee — Commercial',
    company: 'Apex Consumer Group',
    location: 'Chattogram · On-site',
    track: 'Management',
    type: 'Graduate Track',
    summary: 'Rotate across planning, category analytics, and regional team coordination.',
  },
  {
    id: 'role-4',
    title: 'Reporting & MIS Associate',
    company: 'Crestline FinTech',
    location: 'Dhaka · On-site',
    track: 'Data & Excel',
    type: 'Full-Time',
    summary: 'Maintain daily settlement spreadsheets, audit reconciliation logs, and prepare executive summaries.',
  },
];

function OverviewPage({ session }: { session: Session | null }) {
  const navigate = useNavigate();

  const modules = [
    {
      index: '01',
      title: 'Skill Assessment',
      detail: '20-question timed exam across Excel, Situation Handling, Analytical, and Management.',
      route: '/assessment',
      actionLabel: 'Inspect Blueprint',
    },
    {
      index: '02',
      title: 'ATS CV Builder',
      detail: 'Structured resume verification and ATS-ready formatting aligned with employer parsers.',
      route: '/cv-builder',
      actionLabel: 'Open Checklist',
    },
    {
      index: '03',
      title: 'Job Matching Portal',
      detail: 'Verified graduate and entry-level roles filtered by skill track and readiness.',
      route: '/jobs',
      actionLabel: 'Browse Tracks',
    },
    {
      index: '04',
      title: 'Student Account & Auth',
      detail: session
        ? `Signed in as ${session.user.email ?? 'Authenticated Student'}`
        : 'Connect via Google OAuth, LinkedIn OIDC, or email link powered by Supabase.',
      route: '/auth',
      actionLabel: session ? 'Manage Account' : 'Sign In',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="text-xs font-semibold tracking-wide text-[#0D9488]">
          Career Readiness Platform
        </div>
        <h1 className="font-display font-bold text-3xl sm:text-[2.75rem] tracking-[-0.025em] leading-[1.1] text-[#0B1F3A] text-balance">
          Learn Your Skills.{' '}
          <span className="corporate-text-gradient">Discover Your Potential.</span>{' '}
          Build Your Career.
        </h1>
        <p className="text-[15px] leading-relaxed text-[#0B1F3A]/75 max-w-2xl">
          Skill2Career connects structured skill evaluation, ATS-compliant resume preparation,
          and verified career opportunities in one executive student workspace.
        </p>
      </div>

      <div className="h-1 w-full rounded-full corporate-gradient opacity-90" />

      <div className="pt-2">
        <div className="flex items-center justify-between gap-4 pb-4">
          <h2 className="font-display font-semibold text-lg tracking-tight text-[#0B1F3A]">
            Core Workspace Modules
          </h2>
          <span className="text-xs font-medium text-[#0B1F3A]/60 tabular-nums">
            4 Active Areas
          </span>
        </div>

        <div className="divide-y divide-[#0B1F3A]/10 border-y border-[#0B1F3A]/10">
          {modules.map((mod) => (
            <div
              key={mod.index}
              className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1 max-w-xl">
                <div className="flex items-baseline gap-3">
                  <span className="text-xs font-bold text-[#1D4ED8] tabular-nums">
                    {mod.index}.
                  </span>
                  <h3 className="font-display text-sm font-semibold text-[#0B1F3A]">
                    {mod.title}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-[#0B1F3A]/70 pl-6">
                  {mod.detail}
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate(mod.route)}
                className="self-start sm:self-center inline-flex items-center gap-2 rounded-lg border border-[#1D4ED8]/25 bg-[#F4F8FD] px-4 py-2 text-xs font-semibold text-[#0B1F3A] hover:border-[#1D4ED8] hover:bg-[#1D4ED8] hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>{mod.actionLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AssessmentPage() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | ExamCategory['id']>('all');

  const visibleCategories = useMemo(
    () =>
      selectedCategory === 'all'
        ? EXAM_CATEGORIES
        : EXAM_CATEGORIES.filter((cat) => cat.id === selectedCategory),
    [selectedCategory],
  );

  const totalQuestions = visibleCategories.reduce((sum, item) => sum + item.questions, 0);
  const totalMinutes = visibleCategories.reduce((sum, item) => sum + item.minutes, 0);

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="text-xs font-semibold tracking-wide text-[#0284C7]">
          01. Examination Blueprint
        </div>
        <h1 className="font-display font-bold text-3xl sm:text-4xl tracking-[-0.025em] leading-[1.1] text-[#0B1F3A] text-balance">
          20-Question Timed Skill Assessment
        </h1>
        <p className="text-[15px] leading-relaxed text-[#0B1F3A]/75 max-w-2xl">
          Designed to benchmark practical Excel fluency alongside workplace judgment,
          analytical reasoning, and management fundamentals within a 20-minute window.
        </p>
      </div>

      <div className="inline-flex flex-wrap items-center gap-1 rounded-lg bg-[#EDF4FB] p-1 border border-[#0B1F3A]/10">
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
            selectedCategory === 'all'
              ? 'bg-[#0B1F3A] text-white shadow-xs'
              : 'text-[#0B1F3A]/70 hover:text-[#0B1F3A]'
          }`}
        >
          All (20)
        </button>
        {EXAM_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              selectedCategory === cat.id
                ? 'bg-[#0B1F3A] text-white shadow-xs'
                : 'text-[#0B1F3A]/70 hover:text-[#0B1F3A]'
            }`}
          >
            {cat.label} ({cat.questions})
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#0B1F3A]/20 text-xs font-semibold text-[#0B1F3A]/65">
              <th className="py-3 pr-4">Section</th>
              <th className="py-3 px-4 text-right">Questions</th>
              <th className="py-3 px-4 text-right">Target Time</th>
              <th className="py-3 pl-4">Core Focus</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#0B1F3A]/10 text-sm">
            {visibleCategories.map((cat) => (
              <tr key={cat.id} className="hover:bg-[#F4F8FD] transition-colors">
                <td className="py-4 pr-4 font-semibold text-[#0B1F3A] whitespace-nowrap">
                  {cat.label}
                </td>
                <td className="py-4 px-4 text-right tabular-nums font-semibold text-[#1D4ED8]">
                  {cat.questions}
                </td>
                <td className="py-4 px-4 text-right tabular-nums text-[#0B1F3A]/75">
                  {cat.minutes} min
                </td>
                <td className="py-4 pl-4 text-[#0B1F3A]/75 leading-relaxed">
                  {cat.focus}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-[#0B1F3A]/20 text-xs font-semibold text-[#0B1F3A]">
              <td className="py-3.5 pr-4">Selected Scope Total</td>
              <td className="py-3.5 px-4 text-right tabular-nums text-[#1D4ED8]">
                {totalQuestions}
              </td>
              <td className="py-3.5 px-4 text-right tabular-nums">{totalMinutes} min</td>
              <td className="py-3.5 pl-4 text-[#0D9488]">Monthly retake cycle supported</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

function CvBuilderPage() {
  const [checkedIds, setCheckedIds] = useState<string[]>(['header', 'summary', 'skills']);

  const toggleItem = (id: string) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const readinessScore = CV_CHECKLIST.reduce(
    (sum, item) => (checkedIds.includes(item.id) ? sum + item.weight : sum),
    0,
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-3">
          <div className="text-xs font-semibold tracking-wide text-[#0D9488]">
            02. Resume Verification
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl tracking-[-0.025em] leading-[1.1] text-[#0B1F3A]">
            ATS CV Readiness Checklist
          </h1>
        </div>
        <div className="text-left sm:text-right">
          <div className="text-xs font-medium text-[#0B1F3A]/60">
            Structure Completeness
          </div>
          <div className="font-display font-bold text-3xl tabular-nums corporate-text-gradient">
            {readinessScore}%
          </div>
        </div>
      </div>

      <div className="h-2 w-full rounded-full bg-[#EDF4FB] overflow-hidden">
        <div
          className="h-full rounded-full corporate-gradient transition-all duration-200"
          style={{ width: `${readinessScore}%` }}
        />
      </div>

      <div className="divide-y divide-[#0B1F3A]/10 border-y border-[#0B1F3A]/10">
        {CV_CHECKLIST.map((item) => {
          const isChecked = checkedIds.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleItem(item.id)}
              className="w-full text-left py-4 flex items-start justify-between gap-4 hover:bg-[#F4F8FD] transition-colors cursor-pointer px-2 rounded-lg"
            >
              <div className="flex items-start gap-3">
                <CheckCircle2
                  className={`w-4 h-4 mt-0.5 shrink-0 ${
                    isChecked ? 'text-[#0D9488]' : 'text-[#0B1F3A]/25'
                  }`}
                />
                <div className="space-y-1">
                  <div className="font-display text-sm font-semibold text-[#0B1F3A]">
                    {item.title}
                  </div>
                  <p className="text-sm text-[#0B1F3A]/70 leading-relaxed">
                    {item.guidance}
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold tabular-nums text-[#1D4ED8] shrink-0">
                +{item.weight}%
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3 text-sm text-[#0B1F3A]/70">
        <FileText className="w-4 h-4 shrink-0 text-[#0284C7]" />
        <span>
          Toggle each section above to verify ATS structure before uploading or exporting your resume.
        </span>
      </div>
    </div>
  );
}

function JobsPage() {
  const [query, setQuery] = useState('');
  const [trackFilter, setTrackFilter] = useState<'All' | JobPreviewItem['track']>('All');

  const filteredRoles = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return SAMPLE_ROLE_TRACKS.filter((role) => {
      const matchesTrack = trackFilter === 'All' || role.track === trackFilter;
      const matchesQuery =
        !normalized ||
        role.title.toLowerCase().includes(normalized) ||
        role.company.toLowerCase().includes(normalized) ||
        role.location.toLowerCase().includes(normalized);
      return matchesTrack && matchesQuery;
    });
  }, [query, trackFilter]);

  const tracks: Array<'All' | JobPreviewItem['track']> = [
    'All',
    'Data & Excel',
    'Operations',
    'Management',
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="text-xs font-semibold tracking-wide text-[#1D4ED8]">
          03. Career Tracks
        </div>
        <h1 className="font-display font-bold text-3xl sm:text-4xl tracking-[-0.025em] leading-[1.1] text-[#0B1F3A]">
          Verified Role Directory
        </h1>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-y border-[#0B1F3A]/10 py-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#0B1F3A]/45" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search role, company, or city..."
            aria-label="Search roles"
            className="w-full rounded-lg bg-[#F4F8FD] border border-[#0B1F3A]/15 pl-9 pr-3 py-2 text-sm text-[#0B1F3A] placeholder:text-[#0B1F3A]/45 focus:outline-none focus:border-[#1D4ED8] focus:bg-white transition-colors"
          />
        </div>

        <div className="inline-flex flex-wrap items-center gap-1 rounded-lg bg-[#EDF4FB] p-1 border border-[#0B1F3A]/10">
          {tracks.map((track) => (
            <button
              key={track}
              type="button"
              onClick={() => setTrackFilter(track)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                trackFilter === track
                  ? 'bg-[#0B1F3A] text-white shadow-xs'
                  : 'text-[#0B1F3A]/70 hover:text-[#0B1F3A]'
              }`}
            >
              {track}
            </button>
          ))}
        </div>
      </div>

      {filteredRoles.length === 0 ? (
        <div className="py-10 text-center space-y-3 rounded-xl border border-[#0B1F3A]/10 bg-[#F4F8FD]">
          <p className="font-display text-sm font-semibold text-[#0B1F3A]">
            No matching roles found
          </p>
          <p className="text-sm text-[#0B1F3A]/70">
            Clear your search query or switch the track filter to view available openings.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setTrackFilter('All');
            }}
            className="inline-flex items-center rounded-lg px-4 py-2 text-xs font-semibold border border-[#1D4ED8]/30 bg-white text-[#0B1F3A] hover:bg-[#1D4ED8] hover:text-white transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="divide-y divide-[#0B1F3A]/10 border-b border-[#0B1F3A]/10">
          {filteredRoles.map((role) => (
            <div key={role.id} className="py-5 space-y-1.5">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <h2 className="font-display text-base font-semibold text-[#0B1F3A]">
                  {role.title}
                </h2>
                <span className="text-xs font-medium text-[#0D9488]">
                  {role.track} · {role.type}
                </span>
              </div>
              <div className="text-xs font-semibold text-[#1D4ED8]">
                {role.company} · {role.location}
              </div>
              <p className="text-sm leading-relaxed text-[#0B1F3A]/75">{role.summary}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AuthPage({ session }: { session: Session | null }) {
  const [email, setEmail] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const handleOAuthLogin = async (provider: 'google' | 'linkedin_oidc') => {
    setErrorMessage(null);
    setStatusMessage(null);

    if (!isSupabaseConfigured) {
      setErrorMessage(
        'Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment before signing in.',
      );
      return;
    }

    setLoadingProvider(provider);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin,
      },
    });
    setLoadingProvider(null);

    if (error) {
      setErrorMessage(error.message);
    }
  };

  const handleMagicLink = async (event: FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);
    setStatusMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage('Enter a valid email address.');
      return;
    }

    if (!isSupabaseConfigured) {
      setErrorMessage(
        'Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment before requesting a magic link.',
      );
      return;
    }

    setLoadingProvider('email');
    const { error } = await supabase.auth.signInWithOtp({
      email: trimmedEmail,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });
    setLoadingProvider(null);

    if (error) {
      setErrorMessage(error.message);
    } else {
      setStatusMessage(`Sign-in link sent to ${trimmedEmail}. Check your inbox to continue.`);
    }
  };

  const handleSignOut = async () => {
    setErrorMessage(null);
    setStatusMessage(null);
    setLoadingProvider('signout');
    const { error } = await supabase.auth.signOut();
    setLoadingProvider(null);
    if (error) {
      setErrorMessage(error.message);
    } else {
      setStatusMessage('Signed out successfully.');
    }
  };

  return (
    <div className="space-y-8 max-w-xl">
      <div className="space-y-3">
        <div className="text-xs font-semibold tracking-wide text-[#0284C7]">
          04. Authentication
        </div>
        <h1 className="font-display font-bold text-3xl sm:text-4xl tracking-[-0.025em] leading-[1.1] text-[#0B1F3A]">
          Student Account Access
        </h1>
        <p className="text-[15px] leading-relaxed text-[#0B1F3A]/75">
          Sign in with Google, LinkedIn OIDC, or email verification powered by Supabase Auth.
        </p>
      </div>

      {!isSupabaseConfigured && (
        <div className="rounded-xl border border-[#0284C7]/25 bg-[#F0F9FF] p-4 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#0B1F3A]">
            <ShieldCheck className="w-4 h-4 text-[#0284C7]" />
            <span>Supabase Environment Required</span>
          </div>
          <p className="text-xs leading-relaxed text-[#0B1F3A]/75">
            Set <code className="font-semibold text-[#0B1F3A]">VITE_SUPABASE_URL</code> and{' '}
            <code className="font-semibold text-[#0B1F3A]">VITE_SUPABASE_ANON_KEY</code> to
            activate live OAuth redirects and persistent student profiles.
          </p>
        </div>
      )}

      {session ? (
        <div className="rounded-xl border border-[#0B1F3A]/15 bg-[#F4F8FD] p-6 space-y-4">
          <div className="space-y-1">
            <div className="text-xs font-medium text-[#0D9488]">
              Active Session
            </div>
            <div className="font-display text-base font-semibold text-[#0B1F3A]">
              {session.user.email}
            </div>
            <div className="text-xs text-[#0B1F3A]/65">
              User ID: <span className="tabular-nums">{session.user.id}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={loadingProvider === 'signout'}
            className="inline-flex items-center gap-2 rounded-lg bg-[#0B1F3A] text-white px-5 py-2.5 text-xs font-semibold hover:bg-[#1D4ED8] transition-colors cursor-pointer disabled:opacity-50"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{loadingProvider === 'signout' ? 'Signing Out...' : 'Sign Out'}</span>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleOAuthLogin('google')}
              disabled={loadingProvider !== null}
              className="rounded-lg corporate-cta-gradient text-white px-4 py-3 text-xs font-semibold shadow-sm transition-all cursor-pointer disabled:opacity-50 whitespace-nowrap"
            >
              {loadingProvider === 'google' ? 'Connecting...' : 'Continue with Google'}
            </button>
            <button
              type="button"
              onClick={() => handleOAuthLogin('linkedin_oidc')}
              disabled={loadingProvider !== null}
              className="rounded-lg border border-[#0B1F3A]/20 bg-white text-[#0B1F3A] px-4 py-3 text-xs font-semibold hover:border-[#1D4ED8] hover:text-[#1D4ED8] transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap"
            >
              {loadingProvider === 'linkedin_oidc' ? 'Connecting...' : 'LinkedIn (OIDC)'}
            </button>
          </div>

          <form
            onSubmit={handleMagicLink}
            className="border-t border-[#0B1F3A]/10 pt-6 space-y-3"
          >
            <label
              htmlFor="student-email"
              className="block text-xs font-semibold text-[#0B1F3A]"
            >
              Or Sign In via Email Link
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                id="student-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@university.edu"
                className="flex-1 rounded-lg bg-[#F4F8FD] border border-[#0B1F3A]/15 px-3.5 py-2.5 text-sm text-[#0B1F3A] placeholder:text-[#0B1F3A]/45 focus:outline-none focus:border-[#1D4ED8] focus:bg-white transition-colors"
              />
              <button
                type="submit"
                disabled={loadingProvider !== null}
                className="rounded-lg bg-[#0B1F3A] text-white px-5 py-2.5 text-xs font-semibold hover:bg-[#1D4ED8] transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap shrink-0"
              >
                {loadingProvider === 'email' ? 'Sending...' : 'Send Link'}
              </button>
            </div>
          </form>
        </div>
      )}

      {errorMessage && (
        <div
          role="alert"
          className="rounded-lg border border-red-300 bg-red-50 p-3 text-xs font-medium text-red-800"
        >
          {errorMessage}
        </div>
      )}

      {statusMessage && (
        <div className="rounded-lg border border-[#0D9488]/30 bg-[#F0FDFA] p-3 text-xs font-medium text-[#0F766E]">
          {statusMessage}
        </div>
      )}
    </div>
  );
}

function AppShell() {
  const [session, setSession] = useState<Session | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        setSession(data.session ?? null);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const routeLabelMap: Record<string, string> = {
    '/': 'Overview',
    '/assessment': 'Assessment',
    '/cv-builder': 'CV Builder',
    '/jobs': 'Job Portal',
    '/auth': 'Account',
  };

  const activeRouteLabel = routeLabelMap[location.pathname] ?? 'Overview';

  const navItems = [
    { to: '/', label: 'Overview' },
    { to: '/assessment', label: 'Assessment' },
    { to: '/cv-builder', label: 'CV Builder' },
    { to: '/jobs', label: 'Jobs' },
  ];

  return (
    <div className="min-h-screen flex flex-col max-w-[1440px] mx-auto px-5 sm:px-8 py-5">
      <div className="h-1 w-full rounded-full corporate-gradient mb-5" />

      <header className="border-b border-[#0B1F3A]/12 pb-4 flex items-center justify-between gap-8">
        <NavLink
          to="/"
          className="font-display font-extrabold text-2xl tracking-[-0.03em] corporate-text-gradient whitespace-nowrap shrink-0"
        >
          Skill2Career
        </NavLink>

        <nav className="hidden md:flex items-center gap-7">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `text-sm font-medium py-1.5 transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'text-[#0B1F3A] font-semibold border-b-2 border-[#0D9488]'
                    : 'text-[#0B1F3A]/65 hover:text-[#1D4ED8]'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => navigate('/auth')}
            className="rounded-lg corporate-cta-gradient text-white px-4 py-2 text-xs font-semibold shadow-xs transition-all cursor-pointer whitespace-nowrap shrink-0"
          >
            {session ? 'Account' : 'Sign In'}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            className="md:hidden rounded-lg p-2 border border-[#0B1F3A]/20 bg-white text-[#0B1F3A] cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {mobileMenuOpen && (
        <nav className="md:hidden border-b border-[#0B1F3A]/10 py-3 flex flex-wrap gap-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `text-sm font-medium whitespace-nowrap ${
                  isActive ? 'text-[#1D4ED8] font-semibold' : 'text-[#0B1F3A]/75'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      )}

      <main className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 py-8 flex-1">
        <section className="rounded-2xl border border-[#0B1F3A]/10 bg-white/95 shadow-sm p-6 sm:p-8">
          <Routes>
            <Route path="/" element={<OverviewPage session={session} />} />
            <Route path="/assessment" element={<AssessmentPage />} />
            <Route path="/cv-builder" element={<CvBuilderPage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/auth" element={<AuthPage session={session} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </section>

        <aside className="flex flex-col gap-6">
          <div className="rounded-2xl corporate-panel-gradient text-white p-6 space-y-5 shadow-md">
            <h2 className="font-display font-semibold text-lg tracking-tight text-white">
              Workspace Summary
            </h2>
            <dl className="space-y-3 text-xs">
              <div className="flex items-center justify-between gap-4 border-b border-white/15 pb-2.5">
                <dt className="text-[#BAE6FD] font-medium">Active View</dt>
                <dd className="font-semibold text-white text-right">{activeRouteLabel}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-white/15 pb-2.5">
                <dt className="text-[#BAE6FD] font-medium">Database</dt>
                <dd className="font-semibold text-white text-right">
                  {isSupabaseConfigured ? 'Connected' : 'Env Required'}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-white/15 pb-2.5">
                <dt className="text-[#BAE6FD] font-medium">Session</dt>
                <dd className="font-semibold text-white text-right truncate max-w-[160px]">
                  {session?.user.email ?? 'Guest'}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-[#BAE6FD] font-medium">Assessment</dt>
                <dd className="font-semibold text-white text-right tabular-nums">
                  20 Qs · 20 Min
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-[#0B1F3A]/10 bg-white/90 p-5 text-xs leading-relaxed text-[#0B1F3A]/75 space-y-2 shadow-xs">
            <p className="font-display font-semibold text-sm text-[#0B1F3A]">
              Authentication Readiness
            </p>
            <p>
              Google OAuth, LinkedIn OIDC, and student profile persistence use Supabase Free
              with Row Level Security.
            </p>
          </div>

          <div className="mt-auto pt-2">
            <button
              type="button"
              onClick={() => navigate(session ? '/assessment' : '/auth')}
              className="w-full rounded-xl corporate-cta-gradient text-white py-3.5 px-4 text-xs font-semibold tracking-wide shadow-sm transition-all cursor-pointer whitespace-nowrap"
            >
              {session ? 'Open Assessment Blueprint' : 'Continue to Sign In'}
            </button>
          </div>
        </aside>
      </main>

      <footer className="border-t border-[#0B1F3A]/10 pt-4 text-xs text-[#0B1F3A]/60 flex flex-col sm:flex-row justify-between gap-2">
        <span>Skill2Career — Learn Your Skills. Discover Your Potential. Build Your Career.</span>
        <span>© 2026 Skill2Career</span>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
