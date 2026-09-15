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
      {/* =====================================================
          SUBTLE BACKGROUND DECORATION
      ====================================================== */}

      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-amber-100/30 blur-3xl" />

      <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-teal-100/30 blur-3xl" />

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden rounded-[28px] border border-stone-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
        {/* Decorative shapes */}

        <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full border-[40px] border-teal-50/80" />

        <div className="pointer-events-none absolute bottom-[-80px] right-32 h-40 w-40 rounded-full bg-amber-50/70 blur-2xl" />

        <div className="relative p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              {/* Badge */}

              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-600">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-600" />
                Developer Workspace
              </div>

              <h1 className="text-3xl font-bold tracking-[-0.03em] text-slate-950 sm:text-4xl">
                Welcome back,{" "}
                <span className="text-teal-800">{firstName}</span>
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-[15px]">
                Track your projects, skills and development progress from one
                focused workspace.
              </p>

              {/* Small accent line */}

              <div className="mt-6 flex items-center gap-2">
                <div className="h-[2px] w-12 rounded-full bg-teal-700" />
                <div className="h-[2px] w-3 rounded-full bg-amber-500" />
              </div>
            </div>

            {/* Portfolio Health */}

            <div className="relative min-w-[210px] rounded-2xl border border-stone-200 bg-stone-50/80 p-5">
              <div className="absolute right-4 top-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm">
                  <TrendingUp size={16} />
                </div>
              </div>

              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400">
                Portfolio health
              </p>

              <div className="mt-4 flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-50" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-teal-600" />
                </span>

                <span className="text-sm font-bold text-slate-800">
                  {stats.completionRate >= 70
                    ? "Excellent"
                    : stats.completionRate >= 40
                    ? "Growing"
                    : "Getting started"}
                </span>
              </div>

              <p className="mt-2 text-xs leading-5 text-slate-400">
                Based on your current project completion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          STATS
      ====================================================== */}

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Projects"
          value={stats.total}
          description="Total projects"
          icon={FolderKanban}
          iconStyle="bg-teal-50 text-teal-700"
        />

        <StatCard
          label="Completed"
          value={stats.completed}
          description="Finished projects"
          icon={CheckCircle2}
          iconStyle="bg-emerald-50 text-emerald-700"
        />

        <StatCard
          label="In Progress"
          value={stats.inProgress}
          description="Currently building"
          icon={Clock3}
          iconStyle="bg-amber-50 text-amber-700"
        />

        <StatCard
          label="Technologies"
          value={stats.technologies}
          description="Unique technologies"
          icon={Code2}
          iconStyle="bg-slate-100 text-slate-700"
        />
      </section>

      {/* =====================================================
          MAIN GRID
      ====================================================== */}

      <section className="grid gap-6 xl:grid-cols-[1.45fr_1fr]">
        {/* =================================================
            RECENT PROJECTS
        ================================================== */}

        <div className="overflow-hidden rounded-[28px] border border-stone-200 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between border-b border-stone-100 px-5 py-5 sm:px-6">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-semibold tracking-tight text-slate-900">
                  Recent Projects
                </h2>

                <span className="rounded-md bg-stone-100 px-2 py-0.5 text-[9px] font-bold text-stone-500">
                  {recentProjects.length}
                </span>
              </div>

              <p className="mt-1 text-xs text-slate-400">
                Your latest work
              </p>
            </div>

            <Link
              to="/projects"
              className="group flex items-center gap-1 text-xs font-semibold text-teal-700 transition hover:text-teal-900"
            >
              View all
              <ArrowUpRight
                size={14}
                className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          <div className="divide-y divide-stone-100">
            {recentProjects.length > 0 ? (
              recentProjects.map((project) => {
                const technologies = getTech(project);

                return (
                  <div
                    key={project.id}
                    className="group px-5 py-5 transition duration-300 hover:bg-stone-50/70 sm:px-6"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 gap-3.5">
                        {/* Project Icon */}

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-stone-200 bg-stone-50 text-slate-500 transition duration-300 group-hover:border-teal-100 group-hover:bg-teal-50 group-hover:text-teal-700">
                          <Layers3 size={18} />
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-semibold text-slate-800">
                            {project.title}
                          </h3>

                          <p className="mt-1 line-clamp-1 text-xs leading-5 text-slate-400">
                            {project.description ||
                              "No description available."}
                          </p>
                        </div>
                      </div>

                      <StatusBadge status={project.status} />
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pl-0 sm:pl-[58px]">
                      <div className="flex flex-wrap gap-1.5">
                        {technologies.slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            className="rounded-md border border-stone-200 bg-stone-50 px-2 py-1 text-[10px] font-medium text-stone-600"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-4">
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1.5 text-xs text-slate-400 transition hover:text-slate-800"
                          >
                            <GitBranch size={13} />
                            Repository
                          </a>
                        )}

                        {project.live && (
                          <a
                            href={project.live}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1.5 text-xs text-slate-400 transition hover:text-teal-700"
                          >
                            <ExternalLink size={13} />
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

        {/* =================================================
            DEVELOPMENT PROGRESS
        ================================================== */}

        <div className="relative overflow-hidden rounded-[28px] border border-stone-200 bg-white p-5 shadow-[0_10px_35px_rgba(15,23,42,0.05)] sm:p-6">
          {/* Decorative circle */}

          <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-teal-50/70 blur-2xl" />

          <div className="relative">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-semibold tracking-tight text-slate-900">
                  Development Progress
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Project completion overview
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-teal-100 bg-teal-50 text-teal-700">
                <TrendingUp size={17} />
              </div>
            </div>

            {/* Percentage */}

            <div className="mt-8 flex items-end justify-between">
              <div>
                <p className="text-5xl font-bold tracking-[-0.04em] text-slate-950">
                  {stats.completionRate}
                  <span className="text-2xl text-teal-700">%</span>
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  completion rate
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm font-bold text-slate-800">
                  {stats.completed}/{stats.total}
                </p>

                <p className="text-[11px] text-slate-400">
                  projects
                </p>
              </div>
            </div>

            {/* Main progress bar */}

            <div className="mt-7">
              <div className="h-3 overflow-hidden rounded-full bg-stone-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-teal-700 to-teal-500 transition-all duration-700"
                  style={{
                    width: `${stats.completionRate}%`,
                  }}
                />
              </div>
            </div>

            {/* Progress items */}

            <div className="mt-6 grid grid-cols-2 gap-3">
              <ProgressItem
                label="Completed"
                value={stats.completed}
                total={stats.total}
                accent="bg-teal-700"
              />

              <ProgressItem
                label="In Progress"
                value={stats.inProgress}
                total={stats.total}
                accent="bg-amber-500"
              />
            </div>

            {/* Insight */}

            <div className="mt-6 rounded-2xl border border-stone-200 bg-stone-50 p-4">
              <div className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-amber-600 shadow-sm">
                  <Sparkles size={15} />
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-700">
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
        </div>
      </section>

      {/* =====================================================
          PROFILE SNAPSHOT
      ====================================================== */}

      <section className="relative overflow-hidden rounded-[28px] border border-stone-200 bg-white p-5 shadow-[0_10px_35px_rgba(15,23,42,0.05)] sm:p-6">
        <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-amber-50/60 blur-3xl" />

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {/* Avatar */}

            <div className="relative">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-lg font-bold text-white shadow-lg">
                {firstName.charAt(0).toUpperCase()}
              </div>

              <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-[3px] border-white bg-teal-600" />
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

          <div className="grid grid-cols-3 gap-8 sm:gap-10">
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

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  label,
  value,
  description,
  icon: Icon,
  iconStyle,
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-stone-200 bg-white p-4 shadow-[0_8px_25px_rgba(15,23,42,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_35px_rgba(15,23,42,0.08)] sm:p-5">
      {/* Tiny decorative corner */}

      <div className="pointer-events-none absolute -right-5 -top-5 h-16 w-16 rounded-full bg-stone-50 opacity-0 transition duration-300 group-hover:opacity-100" />

      <div className="relative flex items-start justify-between gap-2">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-stone-400 sm:text-[11px]">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            {value}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition duration-300 group-hover:scale-105 ${iconStyle}`}
        >
          <Icon size={17} />
        </div>
      </div>

      <p className="relative mt-3 text-[10px] text-slate-400 sm:text-[11px]">
        {description}
      </p>
    </div>
  );
}

/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({ status }) {
  const completed = status === "Completed";

  return (
    <span
      className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold ${
        completed
          ? "border-emerald-100 bg-emerald-50 text-emerald-700"
          : "border-amber-100 bg-amber-50 text-amber-700"
      }`}
    >
      <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-current" />
      {status || "In Progress"}
    </span>
  );
}

/* =========================================================
   PROGRESS ITEM
========================================================= */

function ProgressItem({
  label,
  value,
  total,
  accent,
}) {
  const percentage =
    total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div className="rounded-2xl border border-stone-200 bg-stone-50 p-3.5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-slate-500">
          {label}
        </span>

        <span className="text-xs font-bold text-slate-800">
          {value}
        </span>
      </div>

      <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-stone-200">
        <div
          className={`h-full rounded-full transition-all duration-500 ${accent}`}
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}

/* =========================================================
   MINI METRIC
========================================================= */

function MiniMetric({ label, value }) {
  return (
    <div>
      <p className="text-lg font-bold tracking-tight text-slate-900">
        {value}
      </p>

      <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-stone-400">
        {label}
      </p>
    </div>
  );
}

/* =========================================================
   EMPTY PROJECTS
========================================================= */

function EmptyProjects() {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-stone-200 bg-stone-50 text-stone-400">
        <FolderKanban size={21} />
      </div>

      <h3 className="mt-4 text-sm font-bold text-slate-700">
        No projects yet
      </h3>

      <p className="mt-1 max-w-xs text-xs leading-5 text-slate-400">
        Add your first project and it will appear here.
      </p>
    </div>
  );
}

export default Dashboard;