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
    <div className="space-y-6 pb-8">

      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-sky-100/70 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-600">
              Developer Workspace
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Welcome back, {firstName}
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-[15px]">
              Track your projects, skills and development progress from one
              workspace.
            </p>
          </div>

          <div className="hidden rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 sm:block">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Portfolio health
            </p>

            <div className="mt-1 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />

              <span className="text-sm font-semibold text-slate-700">
                {stats.completionRate >= 70
                  ? "Excellent"
                  : stats.completionRate >= 40
                  ? "Growing"
                  : "Getting started"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
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

      {/* MAIN GRID */}
      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">

        {/* RECENT PROJECTS */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6">
            <div>
              <h2 className="font-semibold text-slate-900">
                Recent Projects
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Your latest work
              </p>
            </div>

            <Link
                to="/projects"
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
                View all
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentProjects.length > 0 ? (
              recentProjects.map((project) => {
                const technologies = getTech(project);

                return (
                  <div
                    key={project.id}
                    className="group px-5 py-5 transition hover:bg-slate-50/70 sm:px-6"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 group-hover:bg-sky-50 group-hover:text-sky-600">
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
                            className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-500"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-800"
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
                          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-sky-600"
                        >
                          <ExternalLink size={13} />
                          Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <EmptyProjects />
            )}
          </div>
        </div>

        {/* PROGRESS */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                Development Progress
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Project completion overview
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
              <TrendingUp size={17} />
            </div>
          </div>

          <div className="mt-8 flex items-end justify-between">
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

          <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-sky-500 transition-all duration-700"
              style={{
                width: `${stats.completionRate}%`,
              }}
            />
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

          <div className="mt-6 rounded-2xl bg-slate-50 p-4">
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-sky-600 shadow-sm">
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

      {/* PROFILE SNAPSHOT */}
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-lg font-bold text-white">
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

function StatCard({
  label,
  value,
  description,
  icon: Icon,
}) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 sm:text-[11px]">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            {value}
          </p>
        </div>

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500 group-hover:bg-sky-50 group-hover:text-sky-600">
          <Icon size={17} />
        </div>
      </div>

      <p className="mt-3 text-[10px] text-slate-400 sm:text-[11px]">
        {description}
      </p>
    </div>
  );
}

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

function ProgressItem({ label, value, total }) {
  const percentage =
    total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
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
          className="h-full rounded-full bg-slate-700 transition-all duration-500"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}

function MiniMetric({ label, value }) {
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

function EmptyProjects() {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center px-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <FolderKanban size={20} />
      </div>

      <h3 className="mt-4 text-sm font-semibold text-slate-700">
        No projects yet
      </h3>

      <p className="mt-1 max-w-xs text-xs leading-5 text-slate-400">
        Add your first project and it will appear here.
      </p>
    </div>
  );
}

export default Dashboard;