import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Code2,
  ExternalLink,
  FolderKanban,
  GitBranch,
  Layers3,
  Sparkles,
  TrendingUp,
} from "lucide-react";

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [profile, setProfile] = useState(null);

  const loadData = () => {
    try {
      const savedProjects = JSON.parse(
        localStorage.getItem("codexa_projects") || "[]"
      );

      const savedProfile = JSON.parse(
        localStorage.getItem("codexa_profile") || "null"
      );

      setProjects(Array.isArray(savedProjects) ? savedProjects : []);
      setProfile(savedProfile);
    } catch {
      setProjects([]);
      setProfile(null);
    }
  };

  useEffect(() => {
    loadData();

    window.addEventListener("storage", loadData);
    window.addEventListener("codexa-projects-updated", loadData);

    return () => {
      window.removeEventListener("storage", loadData);
      window.removeEventListener("codexa-projects-updated", loadData);
    };
  }, []);

  const stats = useMemo(() => {
    const completed = projects.filter(
      (project) => project.status === "Completed"
    ).length;

    const inProgress = projects.filter(
      (project) => project.status === "In Progress"
    ).length;

    const technologies = [
      ...new Set(
        projects.flatMap((project) =>
          Array.isArray(project.tech)
            ? project.tech
            : typeof project.tech === "string"
            ? project.tech
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean)
            : []
        )
      ),
    ];

    return {
      total: projects.length,
      completed,
      inProgress,
      technologies: technologies.length,
      completionRate:
        projects.length > 0
          ? Math.round((completed / projects.length) * 100)
          : 0,
    };
  }, [projects]);

  const firstName =
    profile?.name?.trim()?.split(" ")[0] || "Judi";

  const recentProjects = projects.slice(0, 4);

  const getTech = (project) => {
    if (Array.isArray(project.tech)) return project.tech;

    if (typeof project.tech === "string") {
      return project.tech
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }

    return [];
  };

  return (
    <div className="relative space-y-6 overflow-hidden pb-10">

      {/* =========================================================
          BACKGROUND DECORATION
      ========================================================= */}

      <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-violet-200/30 blur-3xl" />

      <div className="pointer-events-none absolute left-[-180px] top-[420px] h-72 w-72 rounded-full bg-sky-200/20 blur-3xl" />

      <div className="pointer-events-none absolute right-[20%] top-[45%] h-2 w-2 rounded-full bg-violet-400/40" />

      <div className="pointer-events-none absolute left-[18%] top-[25%] h-2.5 w-2.5 rounded-full border border-slate-300/70" />

      {/* =========================================================
          HERO
      ========================================================= */}

      <section className="group relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-500 hover:shadow-md sm:p-8">

        {/* Hero decoration */}
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-gradient-to-br from-violet-200/40 via-indigo-100/30 to-transparent blur-3xl transition-transform duration-1000 group-hover:scale-110" />

        <div className="pointer-events-none absolute bottom-[-80px] left-[35%] h-48 w-48 rounded-full bg-sky-100/30 blur-3xl" />

        <div className="pointer-events-none absolute right-[20%] top-10 h-2 w-2 rounded-full bg-violet-400/50" />

        <div className="pointer-events-none absolute right-[14%] top-20 h-3 w-3 rounded-full border border-slate-300/70" />

        <div className="relative flex flex-col justify-between gap-7 lg:flex-row lg:items-end">

          <div className="max-w-2xl">

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50/80 px-3 py-1.5 text-xs font-semibold text-violet-600 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
              Developer Workspace
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Welcome back, {firstName}
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-[15px]">
              Track your projects, skills and development progress from one
              focused workspace.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">

              <Link
                to="/projects"
                className="group/btn inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-md"
              >
                View Projects
                <ArrowUpRight
                  size={14}
                  className="transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                />
              </Link>

              <Link
                to="/profile"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/70 px-4 py-2.5 text-xs font-semibold text-slate-600 backdrop-blur-sm transition-all duration-300 hover:border-slate-300 hover:bg-white"
              >
                View Profile
              </Link>

            </div>
          </div>

          {/* Portfolio Health */}

          <div className="relative hidden min-w-[190px] rounded-2xl border border-slate-200/80 bg-white/70 px-4 py-4 shadow-sm backdrop-blur-md sm:block">

            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Portfolio health
              </p>

              <TrendingUp
                size={15}
                className="text-violet-500"
              />
            </div>

            <div className="mt-3 flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>

              <span className="text-sm font-semibold text-slate-700">
                {stats.completionRate >= 70
                  ? "Excellent"
                  : stats.completionRate >= 40
                  ? "Growing"
                  : "Getting started"}
              </span>
            </div>

            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-700"
                style={{
                  width: `${stats.completionRate}%`,
                }}
              />
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================
          STATS
      ========================================================= */}

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">

        <StatCard
          label="Projects"
          value={stats.total}
          description="Total projects"
          icon={FolderKanban}
        />

        <StatCard
          label="Completed"
          value={stats.completed}
          description="Finished projects"
          icon={CheckCircle2}
        />

        <StatCard
          label="In Progress"
          value={stats.inProgress}
          description="Currently building"
          icon={Clock3}
        />

        <StatCard
          label="Technologies"
          value={stats.technologies}
          description="Unique technologies"
          icon={Code2}
        />

      </section>

      {/* =========================================================
          MAIN GRID
      ========================================================= */}

      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">

        {/* =====================================================
            RECENT PROJECTS
        ===================================================== */}

        <div className="group overflow-hidden rounded-[26px] border border-slate-200/80 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md">

          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6">

            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-slate-900">
                  Recent Projects
                </h2>

                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-semibold text-slate-400">
                  {recentProjects.length}
                </span>
              </div>

              <p className="mt-1 text-xs text-slate-400">
                Your latest work
              </p>
            </div>

            <Link
              to="/projects"
              className="group/link inline-flex items-center gap-1 text-xs font-semibold text-violet-600 transition-colors hover:text-violet-700"
            >
              View all
              <ArrowUpRight
                size={13}
                className="transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
              />
            </Link>

          </div>

          <div className="divide-y divide-slate-100">

            {recentProjects.length > 0 ? (
              recentProjects.map((project) => {

                const technologies = getTech(project);

                return (
                  <div
                    key={project.id}
                    className="group/project px-5 py-5 transition-all duration-300 hover:bg-slate-50/70 sm:px-6"
                  >

                    <div className="flex items-start justify-between gap-3">

                      <div className="flex min-w-0 gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-slate-500 transition-all duration-300 group-hover/project:border-violet-100 group-hover/project:bg-violet-50 group-hover/project:text-violet-600">
                          <Layers3 size={18} />
                        </div>

                        <div className="min-w-0">

                          <h3 className="truncate text-sm font-semibold text-slate-800">
                            {project.title}
                          </h3>

                          <p className="mt-1 line-clamp-1 text-xs text-slate-400">
                            {project.description ||
                              "No description available."}
                          </p>

                        </div>

                      </div>

                      <StatusBadge status={project.status} />

                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">

                      <div className="flex flex-wrap gap-1.5">

                        {technologies.slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            className="rounded-md border border-slate-100 bg-slate-50 px-2 py-1 text-[10px] font-medium text-slate-500 transition-colors hover:border-violet-100 hover:bg-violet-50 hover:text-violet-600"
                          >
                            {tech}
                          </span>
                        ))}

                      </div>

                      <div className="flex items-center gap-3">

                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noreferrer"
                            className="group/repo flex items-center gap-1.5 text-xs text-slate-400 transition-colors hover:text-slate-800"
                          >
                            <GitBranch
                              size={13}
                              className="transition-transform duration-300 group-hover/repo:-rotate-6"
                            />
                            Repository
                          </a>
                        )}

                        {project.live && (
                          <a
                            href={project.live}
                            target="_blank"
                            rel="noreferrer"
                            className="group/live flex items-center gap-1.5 text-xs text-slate-400 transition-colors hover:text-violet-600"
                          >
                            <ExternalLink
                              size={13}
                              className="transition-transform duration-300 group-hover/live:translate-x-0.5 group-hover/live:-translate-y-0.5"
                            />
                            Live Demo
                          </a>
                        )}

                      </div>

                    </div>

                  </div>
                );
              })
            ) : (
              <EmptyProjects />
            )}

          </div>
        </div>

        {/* =====================================================
            DEVELOPMENT PROGRESS
        ===================================================== */}

        <div className="relative overflow-hidden rounded-[26px] border border-slate-200/80 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-md sm:p-6">

          <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-violet-100/40 blur-3xl" />

          <div className="relative flex items-start justify-between">

            <div>
              <h2 className="font-semibold text-slate-900">
                Development Progress
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Project completion overview
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-100 bg-violet-50 text-violet-600">
              <TrendingUp size={17} />
            </div>

          </div>

          <div className="relative mt-8 flex items-end justify-between">

            <div>
              <p className="text-4xl font-bold tracking-tight text-slate-950">
                {stats.completionRate}%
              </p>

              <p className="mt-1 text-xs text-slate-400">
                completion rate
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm font-semibold text-slate-700">
                {stats.completed}/{stats.total}
              </p>

              <p className="text-[11px] text-slate-400">
                projects
              </p>
            </div>

          </div>

          {/* Progress Bar */}

          <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-100">

            <div
              className="relative h-full overflow-hidden rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-1000"
              style={{
                width: `${stats.completionRate}%`,
              }}
            >
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2.5s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            </div>

          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">

            <ProgressItem
              label="Completed"
              value={stats.completed}
              total={stats.total}
            />

            <ProgressItem
              label="In Progress"
              value={stats.inProgress}
              total={stats.total}
            />

          </div>

          {/* Insight */}

          <div className="mt-6 rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 to-violet-50/40 p-4">

            <div className="flex gap-3">

              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white bg-white text-violet-600 shadow-sm">
                <Sparkles size={15} />
              </div>

              <div>

                <p className="text-xs font-semibold text-slate-700">
                  Workspace insight
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-400">
                  {stats.total === 0
                    ? "Add your first project to start building your portfolio."
                    : stats.inProgress > 0
                    ? `You have ${stats.inProgress} project${
                        stats.inProgress > 1 ? "s" : ""
                      } currently in progress.`
                    : "Great work! Your current projects are completed."}
                </p>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =========================================================
          PROFILE SNAPSHOT
      ========================================================= */}

      <section className="group relative overflow-hidden rounded-[26px] border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md sm:p-6">

        <div className="pointer-events-none absolute -right-16 -bottom-20 h-44 w-44 rounded-full bg-sky-100/30 blur-3xl transition-transform duration-700 group-hover:scale-110" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 text-lg font-bold text-white shadow-sm transition-transform duration-300 group-hover:scale-105">
              {firstName.charAt(0).toUpperCase()}
            </div>

            <div>
              <p className="text-sm font-bold text-slate-900">
                {profile?.name || "Your Profile"}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                {profile?.role || "Frontend Developer"}
              </p>
            </div>

          </div>

          <div className="grid grid-cols-3 gap-6">

            <MiniMetric
              label="Projects"
              value={stats.total}
            />

            <MiniMetric
              label="Skills"
              value={profile?.skills?.length || 0}
            />

            <MiniMetric
              label="Progress"
              value={`${stats.completionRate}%`}
            />

          </div>

        </div>
      </section>

    </div>
  );
}

/* =============================================================
   STAT CARD
============================================================= */

function StatCard({
  label,
  value,
  description,
  icon: Icon,
}) {
  return (
    <div className="group relative overflow-hidden rounded-[22px] border border-slate-200/80 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-5">

      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-slate-100/70 blur-2xl transition-all duration-500 group-hover:bg-violet-100/70" />

      <div className="relative flex items-start justify-between gap-2">

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400 sm:text-[11px]">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            {value}
          </p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-slate-500 transition-all duration-300 group-hover:border-violet-100 group-hover:bg-violet-50 group-hover:text-violet-600">
          <Icon size={17} />
        </div>

      </div>

      <p className="relative mt-3 text-[10px] text-slate-400 sm:text-[11px]">
        {description}
      </p>

    </div>
  );
}

/* =============================================================
   STATUS BADGE
============================================================= */

function StatusBadge({ status }) {
  const completed = status === "Completed";

  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
        completed
          ? "bg-emerald-50 text-emerald-600"
          : "bg-amber-50 text-amber-600"
      }`}
    >
      {status || "In Progress"}
    </span>
  );
}

/* =============================================================
   PROGRESS ITEM
============================================================= */

function ProgressItem({
  label,
  value,
  total,
}) {
  const percentage =
    total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3 transition-colors duration-300 hover:border-violet-100 hover:bg-violet-50/30">

      <div className="flex justify-between">

        <span className="text-[11px] text-slate-500">
          {label}
        </span>

        <span className="text-xs font-bold text-slate-700">
          {value}
        </span>

      </div>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">

        <div
          className="h-full rounded-full bg-slate-700 transition-all duration-700"
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>

    </div>
  );
}

/* =============================================================
   MINI METRIC
============================================================= */

function MiniMetric({
  label,
  value,
}) {
  return (
    <div>
      <p className="text-lg font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-0.5 text-[10px] uppercase tracking-wider text-slate-400">
        {label}
      </p>
    </div>
  );
}

/* =============================================================
   EMPTY PROJECTS
============================================================= */

function EmptyProjects() {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center px-6 text-center">

      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 text-slate-400">
        <FolderKanban size={20} />
      </div>

      <h3 className="mt-4 text-sm font-semibold text-slate-700">
        No projects yet
      </h3>

      <p className="mt-1 max-w-xs text-xs leading-5 text-slate-400">
        Add your first project and it will appear here.
      </p>

      <Link
        to="/projects"
        className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-[11px] font-semibold text-white transition hover:bg-slate-800"
      >
        Add Project
        <ArrowUpRight size={12} />
      </Link>

    </div>
  );
}

export default Dashboard;