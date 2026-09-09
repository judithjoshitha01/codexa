import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Code2,
  FolderKanban,
  GitBranch,
  Layers3,
  TrendingUp,
  UserRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function Welcome() {
  const navigate = useNavigate();

  const hasProfile = Boolean(
    localStorage.getItem("codexa_profile")
  );

  const handleGetStarted = () => {
    navigate(hasProfile ? "/dashboard" : "/setup");
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-slate-900">

      {/* =========================
          Background
      ========================== */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 top-20 h-80 w-80 rounded-full bg-sky-100/50 blur-3xl" />
        <div className="absolute -right-40 top-0 h-96 w-96 rounded-full bg-blue-100/40 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-indigo-50/60 blur-3xl" />
      </div>

      {/* =========================
          Navbar
      ========================== */}
      <header className="border-b border-slate-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">

          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-left"
          >
            <h1 className="text-xl font-bold tracking-tight text-slate-950">
              Codexa
            </h1>

            <p className="text-[8px] font-bold uppercase tracking-[0.22em] text-slate-400 sm:text-[9px]">
              Developer Workspace
            </p>
          </button>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-7 md:flex">
            <a
              href="#features"
              className="text-sm font-medium text-slate-500 transition hover:text-slate-900"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="text-sm font-medium text-slate-500 transition hover:text-slate-900"
            >
              How it works
            </a>
          </nav>

          {/* CTA */}
          <button
            onClick={handleGetStarted}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800 sm:px-4 sm:py-2.5 sm:text-sm"
          >
            {hasProfile ? "Open Workspace" : "Get Started"}
            <ArrowRight size={14} />
          </button>
        </div>
      </header>

      {/* =========================
          Hero
      ========================== */}
      <main>

        <section className="mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:px-8 lg:pb-24 lg:pt-20">

          <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">

            {/* Hero content */}
            <div className="max-w-xl">

              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-3 py-1.5 text-[10px] font-bold text-sky-600 sm:text-[11px]">
        
                Built for modern developers
              </div>

              {/* Heading */}
              <h2 className="mt-6 text-[42px] font-bold leading-[1.02] tracking-[-0.04em] text-slate-950 sm:text-5xl lg:text-[64px]">
                Build your
                <br />
                <span className="text-slate-950">
                  developer
                </span>
                <br />
                <span className="text-sky-500">
                  workspace.
                </span>
              </h2>

              {/* Description */}
              <p className="mt-6 max-w-lg text-sm leading-6 text-slate-500 sm:text-base sm:leading-7">
                Codexa helps you organize projects, track
                your technical skills, monitor your progress,
                and manage your developer profile — all from
                one focused workspace.
              </p>

              {/* Buttons */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">

                <button
                  onClick={handleGetStarted}
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-slate-950/10 transition hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  {hasProfile
                    ? "Open My Workspace"
                    : "Get Started"}

                  <ArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>

                <a
                  href="#features"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  Explore Features
                  <ChevronRight size={15} />
                </a>

              </div>

              {/* Small benefits */}
              <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3">

                <Trust text="Simple workspace" />
                <Trust text="Local & private" />
                <Trust text="Developer focused" />

              </div>

            </div>

            {/* =========================
                Dashboard Preview
            ========================== */}
            <DashboardPreview />

          </div>
        </section>

        {/* =========================
            Stats
        ========================== */}
        <section className="border-y border-slate-100 bg-slate-50/70">

          <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-slate-200 sm:grid-cols-4">

            <Stat
              value="12+"
              label="Projects"
            />

            <Stat
              value="18"
              label="Skills tracked"
            />

            <Stat
              value="92%"
              label="Profile progress"
            />

            <Stat
              value="50"
              label="Activity records"
            />

          </div>

        </section>

        {/* =========================
            Features
        ========================== */}
        <section
          id="features"
          className="scroll-mt-20 px-4 py-20 sm:px-6 lg:px-8 lg:py-24"
        >

          <div className="mx-auto max-w-7xl">

            <div className="max-w-2xl">

              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-sky-600">
                Everything in one place
              </p>

              <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Everything you need to
                <span className="text-sky-500">
                  {" "}grow.
                </span>
              </h3>

              <p className="mt-4 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
                Keep your developer journey organized
                without switching between multiple tools.
              </p>

            </div>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

              <FeatureCard
                icon={FolderKanban}
                number="01"
                title="Project Management"
                description="Manage your projects with descriptions, technologies, repositories, live demos and progress status."
              />

              <FeatureCard
                icon={Code2}
                number="02"
                title="Skill Tracking"
                description="Keep your technical skills organized and maintain a clear view of your developer toolkit."
              />

              <FeatureCard
                icon={BarChart3}
                number="03"
                title="Developer Analytics"
                description="Understand your progress with project statistics, technology usage and visual insights."
              />

              <FeatureCard
                icon={Layers3}
                number="04"
                title="Activity Timeline"
                description="See important workspace actions and milestones in a simple chronological timeline."
              />

            </div>
          </div>
        </section>

        {/* =========================
            How it works
        ========================== */}
        <section
          id="how-it-works"
          className="scroll-mt-20 border-y border-slate-100 bg-slate-50/60 px-4 py-20 sm:px-6 lg:px-8 lg:py-24"
        >

          <div className="mx-auto max-w-7xl">

            <div className="text-center">

              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-sky-600">
                How it works
              </p>

              <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Start in three simple steps
              </h3>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-500">
                Set up your workspace once and keep
                everything about your developer journey organized.
              </p>

            </div>

            <div className="relative mt-14 grid gap-8 md:grid-cols-3">

              {/* Connecting line */}
              <div className="absolute left-[18%] right-[18%] top-8 hidden h-px bg-slate-200 md:block" />

              <Step
                number="01"
                icon={UserRound}
                title="Create your profile"
                description="Add your name, role, bio, links and technical skills."
              />

              <Step
                number="02"
                icon={FolderKanban}
                title="Add your projects"
                description="Showcase the projects you have built and the technologies you use."
              />

              <Step
                number="03"
                icon={TrendingUp}
                title="Track your growth"
                description="Use analytics and activity insights to understand your progress."
              />

            </div>
          </div>
        </section>

        {/* =========================
            Final CTA
        ========================== */}
        <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-24">

          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-14 text-center shadow-2xl shadow-slate-950/10 sm:px-10 sm:py-16">

            {/* CTA glow */}
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-sky-500/20 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />

            <div className="relative">

              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-sky-400">
             
              </div>

              <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-sky-400">
                Your workspace starts here
              </p>

              <h3 className="mx-auto mt-3 max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Turn your development journey
                into something you can see.
              </h3>

              <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-slate-400">
                Create your Codexa workspace and keep
                your projects, skills and progress together.
              </p>

              <button
                onClick={handleGetStarted}
                className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-slate-100"
              >
                {hasProfile
                  ? "Open Workspace"
                  : "Create My Workspace"}

                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>

            </div>
          </div>
        </section>

      </main>

      {/* =========================
          Footer
      ========================== */}
      <footer className="border-t border-slate-100 bg-white">

        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">

          <div>
            <p className="text-sm font-bold text-slate-800">
              Codexa
            </p>

            <p className="mt-0.5 text-[10px] text-slate-400">
              Developer Workspace
            </p>
          </div>

          <p className="text-[11px] text-slate-400">
            Built to organize. Designed to grow.
          </p>

        </div>

      </footer>

    </div>
  );
}

/* =================================
   Dashboard Preview
================================= */

function DashboardPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[620px]">

      {/* Background glow */}
      <div className="absolute inset-10 rounded-full bg-sky-200/40 blur-3xl" />

      {/* Main browser */}
      <div className="relative rounded-2xl border border-slate-200 bg-white p-2.5 shadow-2xl shadow-slate-900/10 sm:p-3">

        {/* Browser header */}
        <div className="flex items-center gap-1.5 border-b border-slate-100 px-2 pb-3 sm:px-3">

          <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />

          <div className="ml-2 h-7 flex-1 rounded-lg bg-slate-50 sm:ml-4" />

        </div>

        {/* Dashboard */}
        <div className="grid grid-cols-[52px_1fr] gap-2 p-2 sm:grid-cols-[76px_1fr] sm:gap-3 sm:p-3">

          {/* Sidebar */}
          <div className="rounded-xl bg-slate-50 p-2">

            <div className="flex h-8 items-center justify-center rounded-lg bg-slate-950 text-white">
              <Code2 size={14} />
            </div>

            <div className="mt-4 space-y-2.5">
              <SideLine active />
              <SideLine />
              <SideLine />
              <SideLine />
              <SideLine />
              <SideLine />
            </div>

          </div>

          {/* Content */}
          <div className="min-w-0">

            {/* Header */}
            <div className="flex items-center justify-between">

              <div>
                <div className="h-3 w-20 rounded bg-slate-800 sm:w-28" />
                <div className="mt-2 h-2 w-28 rounded bg-slate-100 sm:w-40" />
              </div>

              <div className="h-7 w-12 rounded-lg bg-sky-50 sm:w-20" />

            </div>

            {/* KPI cards */}
            <div className="mt-3 grid grid-cols-3 gap-1.5 sm:gap-2">

              <MiniKpi
                icon={FolderKanban}
                value="12"
                label="Projects"
              />

              <MiniKpi
                icon={Code2}
                value="18"
                label="Skills"
              />

              <MiniKpi
                icon={TrendingUp}
                value="92%"
                label="Progress"
              />

            </div>

            {/* Chart */}
            <div className="mt-2.5 rounded-xl border border-slate-100 p-2.5 sm:mt-3 sm:p-3">

              <div className="flex items-center justify-between">

                <div>
                  <div className="h-2.5 w-20 rounded bg-slate-700 sm:w-24" />
                  <div className="mt-1.5 h-2 w-12 rounded bg-slate-100 sm:w-16" />
                </div>

                <div className="rounded-md bg-emerald-50 px-2 py-1">
                  <span className="text-[7px] font-bold text-emerald-500 sm:text-[8px]">
                    +18.4%
                  </span>
                </div>

              </div>

              <div className="mt-4 flex h-20 items-end gap-1.5 sm:h-28 sm:gap-2">

                <ChartBar height="34%" />
                <ChartBar height="48%" />
                <ChartBar height="42%" />
                <ChartBar height="65%" />
                <ChartBar height="57%" />
                <ChartBar height="78%" />
                <ChartBar height="70%" />
                <ChartBar height="91%" />

              </div>

            </div>

            {/* Project cards */}
            <div className="mt-2.5 grid grid-cols-2 gap-1.5 sm:mt-3 sm:gap-2">

              <MiniProject
                title="SpendFlow"
                type="React"
                completed
              />

              <MiniProject
                title="Constellation"
                type="React"
              />

            </div>

          </div>
        </div>
      </div>

      {/* Floating profile card */}
      <div className="absolute -left-3 top-20 hidden rounded-xl border border-slate-200 bg-white p-3 shadow-xl sm:block md:-left-7">

        <div className="flex items-center gap-2.5">

          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <CheckCircle2 size={15} />
          </div>

          <div>
            <p className="text-[9px] text-slate-400">
              Profile completion
            </p>

            <p className="text-xs font-bold text-slate-700">
              92% complete
            </p>
          </div>

        </div>

      </div>

      {/* Floating GitHub card */}
      <div className="absolute -bottom-5 -right-2 rounded-xl border border-slate-200 bg-white p-3 shadow-xl sm:-right-6">

        <div className="flex items-center gap-2.5">

          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
            <GitBranch size={15} />
          </div>

          <div>
            <p className="text-[9px] text-slate-400">
              Developer activity
            </p>

            <p className="text-xs font-bold text-slate-700">
              Growing steadily
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

/* =================================
   Small Components
================================= */

function Trust({ text }) {
  return (
    <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400 sm:text-xs">
      <CheckCircle2
        size={13}
        className="text-emerald-500"
      />
      {text}
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div className="px-3 py-6 text-center sm:px-5 sm:py-8">
      <p className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
        {value}
      </p>

      <p className="mt-1 text-[10px] font-medium text-slate-400 sm:text-xs">
        {label}
      </p>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  number,
  title,
  description,
}) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-xl hover:shadow-slate-900/5 sm:p-6">

      <div className="flex items-center justify-between">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600 transition group-hover:bg-sky-500 group-hover:text-white">
          <Icon size={18} />
        </div>

        <span className="text-[10px] font-bold text-slate-300">
          {number}
        </span>

      </div>

      <h4 className="mt-6 text-sm font-bold text-slate-900">
        {title}
      </h4>

      <p className="mt-2 text-xs leading-6 text-slate-500">
        {description}
      </p>

      <div className="mt-5 flex items-center gap-1 text-[10px] font-bold text-sky-600 opacity-0 transition group-hover:opacity-100">
        Explore
        <ArrowRight size={12} />
      </div>

    </div>
  );
}

function Step({
  number,
  icon: Icon,
  title,
  description,
}) {
  return (
    <div className="relative z-10 text-center">

      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-white text-sky-500 shadow-sm">
        <Icon size={23} />
      </div>

      <p className="mt-5 text-[10px] font-bold uppercase tracking-widest text-sky-600">
        Step {number}
      </p>

      <h4 className="mt-2 text-sm font-bold text-slate-900">
        {title}
      </h4>

      <p className="mx-auto mt-2 max-w-xs text-xs leading-6 text-slate-500">
        {description}
      </p>

    </div>
  );
}

function MiniKpi({
  icon: Icon,
  value,
  label,
}) {
  return (
    <div className="rounded-lg border border-slate-100 bg-white p-2 sm:p-2.5">

      <Icon
        size={11}
        className="text-sky-500 sm:h-3.5 sm:w-3.5"
      />

      <p className="mt-1.5 text-xs font-bold text-slate-800 sm:mt-2 sm:text-sm">
        {value}
      </p>

      <p className="text-[7px] text-slate-400 sm:text-[8px]">
        {label}
      </p>

    </div>
  );
}

function MiniProject({
  title,
  type,
  completed = false,
}) {
  return (
    <div className="rounded-lg border border-slate-100 p-2 sm:p-2.5">

      <div className="flex items-center justify-between">

        <div className="flex h-5 w-5 items-center justify-center rounded-md bg-slate-100 sm:h-6 sm:w-6">
          <Code2
            size={10}
            className="text-slate-400"
          />
        </div>

        <span
          className={`h-1.5 w-7 rounded-full ${
            completed
              ? "bg-emerald-300"
              : "bg-amber-300"
          }`}
        />

      </div>

      <p className="mt-2 truncate text-[8px] font-bold text-slate-700 sm:text-[9px]">
        {title}
      </p>

      <p className="mt-0.5 text-[7px] text-slate-400 sm:text-[8px]">
        {type}
      </p>

    </div>
  );
}

function ChartBar({ height }) {
  return (
    <div
      className="flex-1 rounded-t-md bg-sky-200 transition hover:bg-sky-300"
      style={{ height }}
    />
  );
}

function SideLine({ active = false }) {
  return (
    <div
      className={`h-1.5 rounded-full ${
        active
          ? "bg-sky-300"
          : "bg-slate-200"
      }`}
    />
  );
}

export default Welcome;