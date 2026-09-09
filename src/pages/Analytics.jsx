// src/pages/Analytics.jsx

import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  CheckCircle2,
  Clock3,
  FolderKanban,
  Layers3,
  TrendingUp,
} from "lucide-react";

const PROJECTS_KEY = "codexa_projects";

function Analytics() {
  const [projects, setProjects] = useState([]);

  // -----------------------------
  // Load Projects
  // -----------------------------
  useEffect(() => {
    const loadProjects = () => {
      try {
        const stored = localStorage.getItem(PROJECTS_KEY);
        const parsed = stored ? JSON.parse(stored) : [];

        setProjects(Array.isArray(parsed) ? parsed : []);
      } catch {
        setProjects([]);
      }
    };

    loadProjects();

    const handleProjectsUpdate = () => {
      loadProjects();
    };

    const handleStorage = (event) => {
      if (event.key === PROJECTS_KEY) {
        loadProjects();
      }
    };

    window.addEventListener(
      "codexa-projects-updated",
      handleProjectsUpdate
    );

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(
        "codexa-projects-updated",
        handleProjectsUpdate
      );

      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  // -----------------------------
  // Analytics Calculations
  // -----------------------------
  const analytics = useMemo(() => {
    const total = projects.length;

    const completed = projects.filter(
      (project) => project.status === "Completed"
    ).length;

    const inProgress = projects.filter(
      (project) => project.status === "In Progress"
    ).length;

    const completionRate =
      total > 0 ? Math.round((completed / total) * 100) : 0;

    const technologies = {};

    projects.forEach((project) => {
      let techList = [];

      if (Array.isArray(project.tech)) {
        techList = project.tech;
      } else if (typeof project.tech === "string") {
        techList = project.tech
          .split(",")
          .map((tech) => tech.trim())
          .filter(Boolean);
      }

      techList.forEach((tech) => {
        const normalized = tech.trim();

        if (normalized) {
          technologies[normalized] =
            (technologies[normalized] || 0) + 1;
        }
      });
    });

    const technologyList = Object.entries(technologies)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({
        name,
        count,
      }));

    return {
      total,
      completed,
      inProgress,
      completionRate,
      technologyList,
      technologyCount: technologyList.length,
    };
  }, [projects]);

  // -----------------------------
  // Empty State
  // -----------------------------
  if (analytics.total === 0) {
    return (
      <div className="space-y-6">
        <PageHeader />

        <div className="flex min-h-[520px] items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="max-w-md text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
              <BarChart3 size={30} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              No analytics yet
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Add a few projects to your workspace and Codexa
              will automatically generate portfolio analytics.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader />

      {/* --------------------------------
          KPI CARDS
      -------------------------------- */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={FolderKanban}
          label="Total Projects"
          value={analytics.total}
          description="Projects in your workspace"
        />

        <MetricCard
          icon={CheckCircle2}
          label="Completed"
          value={analytics.completed}
          description="Finished projects"
        />

        <MetricCard
          icon={Clock3}
          label="In Progress"
          value={analytics.inProgress}
          description="Currently being built"
        />

        <MetricCard
          icon={Layers3}
          label="Technologies"
          value={analytics.technologyCount}
          description="Unique technologies used"
        />
      </section>

      {/* --------------------------------
          MAIN ANALYTICS
      -------------------------------- */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Completion Overview */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-1">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Completion
              </p>

              <h2 className="mt-1 text-lg font-bold text-slate-900">
                Project progress
              </h2>
            </div>

            <div className="rounded-xl bg-sky-50 p-2.5 text-sky-600">
              <TrendingUp size={19} />
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <div
              className="relative flex h-48 w-48 items-center justify-center rounded-full"
              style={{
                background: `conic-gradient(
                  rgb(14 165 233) ${analytics.completionRate}%,
                  rgb(226 232 240) ${analytics.completionRate}% 100%
                )`,
              }}
            >
              <div className="flex h-36 w-36 flex-col items-center justify-center rounded-full bg-white">
                <span className="text-4xl font-bold tracking-tight text-slate-900">
                  {analytics.completionRate}%
                </span>

                <span className="mt-1 text-xs font-medium text-slate-400">
                  completed
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <StatusRow
              label="Completed"
              value={analytics.completed}
              total={analytics.total}
            />

            <StatusRow
              label="In Progress"
              value={analytics.inProgress}
              total={analytics.total}
            />
          </div>
        </div>

        {/* Project Status */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Project status
            </p>

            <h2 className="mt-1 text-lg font-bold text-slate-900">
              Development overview
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              A quick breakdown of your current project pipeline.
            </p>
          </div>

          <div className="mt-8 space-y-7">
            <ProgressRow
              label="Completed Projects"
              value={analytics.completed}
              total={analytics.total}
              percentage={
                analytics.total > 0
                  ? Math.round(
                      (analytics.completed / analytics.total) * 100
                    )
                  : 0
              }
            />

            <ProgressRow
              label="Projects In Progress"
              value={analytics.inProgress}
              total={analytics.total}
              percentage={
                analytics.total > 0
                  ? Math.round(
                      (analytics.inProgress / analytics.total) * 100
                    )
                  : 0
              }
            />

            <ProgressRow
              label="Remaining"
              value={
                analytics.total -
                analytics.completed -
                analytics.inProgress
              }
              total={analytics.total}
              percentage={
                analytics.total > 0
                  ? Math.round(
                      ((analytics.total -
                        analytics.completed -
                        analytics.inProgress) /
                        analytics.total) *
                        100
                    )
                  : 0
              }
            />
          </div>
        </div>
      </section>

      {/* --------------------------------
          TECHNOLOGY USAGE
      -------------------------------- */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Technology usage
            </p>

            <h2 className="mt-1 text-lg font-bold text-slate-900">
              Your development stack
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Technologies appearing across your projects.
            </p>
          </div>

          <div className="mt-2 flex items-center gap-2 text-xs font-medium text-slate-400 sm:mt-0">
            <Layers3 size={14} />
            {analytics.technologyCount} technologies
          </div>
        </div>

        <div className="mt-8">
          {analytics.technologyList.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
              <p className="text-sm font-medium text-slate-600">
                No technology data available
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Add technologies while creating projects.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-10 gap-y-6 lg:grid-cols-2">
              {analytics.technologyList.map(
                ({ name, count }) => {
                  const maxCount =
                    analytics.technologyList[0]?.count || 1;

                  const percentage = Math.round(
                    (count / maxCount) * 100
                  );

                  return (
                    <TechnologyRow
                      key={name}
                      name={name}
                      count={count}
                      percentage={percentage}
                    />
                  );
                }
              )}
            </div>
          )}
        </div>
      </section>

      {/* --------------------------------
          PORTFOLIO SUMMARY
      -------------------------------- */}
      <section className="overflow-hidden rounded-2xl bg-slate-900 p-6 text-white shadow-sm sm:p-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300">
              <BarChart3 size={13} />
              Portfolio insight
            </div>

            <h2 className="mt-4 text-xl font-bold tracking-tight sm:text-2xl">
              Keep building, keep improving.
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Your Codexa workspace tracks project progress and
              technology usage automatically. Keep your projects
              updated to maintain an accurate developer profile.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:min-w-[300px]">
            <MiniStat
              label="Projects"
              value={analytics.total}
            />

            <MiniStat
              label="Completed"
              value={analytics.completed}
            />

            <MiniStat
              label="In Progress"
              value={analytics.inProgress}
            />

            <MiniStat
              label="Completion"
              value={`${analytics.completionRate}%`}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

/* =====================================
   PAGE HEADER
===================================== */

function PageHeader() {
  return (
    <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-sky-600">
          Workspace analytics
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Analytics
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Understand your project progress, development activity,
          and technology stack at a glance.
        </p>
      </div>
    </header>
  );
}

/* =====================================
   METRIC CARD
===================================== */

function MetricCard({
  icon: Icon,
  label,
  value,
  description,
}) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
          <Icon size={19} />
        </div>
      </div>

      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </p>

        <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          {value}
        </p>

        <p className="mt-1 text-xs text-slate-400">
          {description}
        </p>
      </div>
    </div>
  );
}

/* =====================================
   STATUS ROW
===================================== */

function StatusRow({ label, value, total }) {
  const percentage =
    total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-medium text-slate-600">
          {label}
        </span>

        <span className="text-sm font-semibold text-slate-900">
          {value}
        </span>
      </div>

      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-sky-500 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

/* =====================================
   PROGRESS ROW
===================================== */

function ProgressRow({
  label,
  value,
  total,
  percentage,
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-700">
            {label}
          </p>

          <p className="mt-0.5 text-xs text-slate-400">
            {value} of {total} projects
          </p>
        </div>

        <span className="text-sm font-bold text-slate-900">
          {percentage}%
        </span>
      </div>

      <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-sky-500 transition-all duration-700"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

/* =====================================
   TECHNOLOGY ROW
===================================== */

function TechnologyRow({
  name,
  count,
  percentage,
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">
            {name.charAt(0).toUpperCase()}
          </div>

          <span className="truncate text-sm font-semibold text-slate-700">
            {name}
          </span>
        </div>

        <span className="shrink-0 text-xs font-semibold text-slate-400">
          {count}{" "}
          {count === 1 ? "project" : "projects"}
        </span>
      </div>

      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-slate-700 transition-all duration-700"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

/* =====================================
   MINI STAT
===================================== */

function MiniStat({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-xl font-bold text-white">
        {value}
      </p>
    </div>
  );
}

export default Analytics;