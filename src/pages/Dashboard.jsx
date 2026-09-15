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
    <div className="relative min-h-screen space-y-6 overflow-hidden bg-[#F8F6F1] pb-10">

      {/* =====================================================
          SUBTLE BACKGROUND DECORATION
      ====================================================== */}

      <div className="pointer-events-none absolute -left-32 top-24 h-72 w-72 rounded-full bg-[#EDE5D6]/50 blur-3xl" />

      <div className="pointer-events-none absolute -right-20 top-0 h-80 w-80 rounded-full bg-[#F1EBDD]/60 blur-3xl" />

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden rounded-[30px] border border-[#E8E2D8] bg-[#FFFDF9] shadow-[0_12px_40px_rgba(72,62,48,0.06)]">

        {/* Decorative circle */}

        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full border-[38px] border-[#F3EEE5]" />

        <div className="pointer-events-none absolute bottom-[-70px] right-40 h-40 w-40 rounded-full bg-[#EFE7D8]/60 blur-3xl" />

        <div className="relative p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">

            {/* LEFT */}

            <div className="max-w-2xl">

              {/* Badge */}

              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#E6DFD3] bg-[#F8F5EF] px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#837969]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#B29A76]" />
                Developer Workspace
              </div>

              <h1 className="text-3xl font-bold tracking-[-0.035em] text-[#292722] sm:text-4xl">
                Welcome back,{" "}
                <span className="text-[#8D7654]">{firstName}</span>
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-[#817A6E] sm:text-[15px]">
                Track your projects, skills and development progress from one
                focused workspace.
              </p>

              {/* Accent line */}

              <div className="mt-6 flex items-center gap-2">
                <div className="h-[2px] w-14 rounded-full bg-[#B49A72]" />
                <div className="h-[2px] w-3 rounded-full bg-[#D5C5A9]" />
              </div>
            </div>

            {/* PORTFOLIO HEALTH */}

            <div className="relative min-w-[215px] rounded-2xl border border-[#E6DFD4] bg-[#F9F6F0] p-5">

              <div className="absolute right-4 top-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E8E0D3] bg-[#FFFDF9] text-[#9C835F] shadow-sm">
                  <TrendingUp size={16} />
                </div>
              </div>

              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#A39A8C]">
                Portfolio health
              </p>

              <div className="mt-4 flex items-center gap-2">

                <span className="h-2.5 w-2.5 rounded-full bg-[#B49A72]" />

                <span className="text-sm font-bold text-[#3A352E]">
                  {stats.completionRate >= 70
                    ? "Excellent"
                    : stats.completionRate >= 40
                    ? "Growing"
                    : "Getting started"}
                </span>

              </div>

              <p className="mt-2 text-xs leading-5 text-[#91897D]">
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

      {/* =====================================================
          MAIN GRID
      ====================================================== */}

      <section className="grid gap-6 xl:grid-cols-[1.45fr_1fr]">

        {/* =================================================
            RECENT PROJECTS
        ================================================== */}

        <div className="overflow-hidden rounded-[30px] border border-[#E7E1D7] bg-[#FFFDF9] shadow-[0_10px_35px_rgba(72,62,48,0.05)]">

          <div className="flex items-center justify-between border-b border-[#EEE9E0] px-5 py-5 sm:px-6">

            <div>
              <div className="flex items-center gap-2">

                <h2 className="font-semibold tracking-tight text-[#302C26]">
                  Recent Projects
                </h2>

                <span className="rounded-md bg-[#F1ECE3] px-2 py-0.5 text-[9px] font-bold text-[#8D8272]">
                  {recentProjects.length}
                </span>

              </div>

              <p className="mt-1 text-xs text-[#A39A8D]">
                Your latest work
              </p>
            </div>

            <Link
              to="/projects"
              className="group flex items-center gap-1 text-xs font-semibold text-[#927B5B] transition hover:text-[#6F5B40]"
            >
              View all

              <ArrowUpRight
                size={14}
                className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          <div className="divide-y divide-[#EEE9E0]">

            {recentProjects.length > 0 ? (
              recentProjects.map((project) => {

                const technologies = getTech(project);

                return (
                  <div
                    key={project.id}
                    className="group px-5 py-5 transition duration-300 hover:bg-[#FAF8F3] sm:px-6"
                  >

                    <div className="flex items-start justify-between gap-3">

                      <div className="flex min-w-0 gap-3.5">

                        {/* Project icon */}

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#E9E2D7] bg-[#F8F5EF] text-[#8E8270] transition duration-300 group-hover:border-[#DCCDB7] group-hover:bg-[#F1EBDD] group-hover:text-[#806B4D]">
                          <Layers3 size={18} />
                        </div>

                        <div className="min-w-0">

                          <h3 className="truncate text-sm font-semibold text-[#3A352E]">
                            {project.title}
                          </h3>

                          <p className="mt-1 line-clamp-1 text-xs leading-5 text-[#9A9184]">
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
                            className="rounded-md border border-[#E8E1D7] bg-[#F9F6F0] px-2 py-1 text-[10px] font-medium text-[#807568]"
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
                            className="flex items-center gap-1.5 text-xs text-[#9B9286] transition hover:text-[#403A31]"
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
                            className="flex items-center gap-1.5 text-xs text-[#9B9286] transition hover:text-[#806B4D]"
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

        <div className="relative overflow-hidden rounded-[30px] border border-[#E7E1D7] bg-[#FFFDF9] p-5 shadow-[0_10px_35px_rgba(72,62,48,0.05)] sm:p-6">

          {/* Background decoration */}

          <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-[#F2EBDE]/70 blur-2xl" />

          <div className="relative">

            <div className="flex items-start justify-between">

              <div>
                <h2 className="font-semibold tracking-tight text-[#302C26]">
                  Development Progress
                </h2>

                <p className="mt-1 text-xs text-[#A39A8D]">
                  Project completion overview
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E6DDCF] bg-[#F5F0E7] text-[#927B5B]">
                <TrendingUp size={17} />
              </div>

            </div>

            {/* Percentage */}

            <div className="mt-8 flex items-end justify-between">

              <div>
                <p className="text-5xl font-bold tracking-[-0.05em] text-[#292722]">
                  {stats.completionRate}
                  <span className="text-2xl text-[#A88D67]">
                    %
                  </span>
                </p>

                <p className="mt-1 text-xs text-[#A39A8D]">
                  completion rate
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm font-bold text-[#403A31]">
                  {stats.completed}/{stats.total}
                </p>

                <p className="text-[11px] text-[#A39A8D]">
                  projects
                </p>
              </div>

            </div>

            {/* Main progress */}

            <div className="mt-7">

              <div className="h-3 overflow-hidden rounded-full bg-[#EEE9E0]">

                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#A88C65] to-[#C8B28E] transition-all duration-700"
                  style={{
                    width: `${stats.completionRate}%`,
                  }}
                />

              </div>

            </div>

            {/* Small progress cards */}

            <div className="mt-6 grid grid-cols-2 gap-3">

              <ProgressItem
                label="Completed"
                value={stats.completed}
                total={stats.total}
                accent="bg-[#A78C66]"
              />

              <ProgressItem
                label="In Progress"
                value={stats.inProgress}
                total={stats.total}
                accent="bg-[#C6AF89]"
              />

            </div>

            {/* Insight */}

            <div className="mt-6 rounded-2xl border border-[#E9E2D7] bg-[#F9F6F0] p-4">

              <div className="flex gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#E9E2D7] bg-[#FFFDF9] text-[#9A805D] shadow-sm">
                  <Sparkles size={15} />
                </div>

                <div>

                  <p className="text-xs font-bold text-[#4A4339]">
                    Workspace insight
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#958B7D]">
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

      <section className="relative overflow-hidden rounded-[30px] border border-[#E7E1D7] bg-[#FFFDF9] p-5 shadow-[0_10px_35px_rgba(72,62,48,0.05)] sm:p-6">

        <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-[#F1EBDD]/60 blur-3xl" />

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-4">

            {/* Avatar */}

            <div className="relative">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#302C26] text-lg font-bold text-[#F8F3E9] shadow-lg">
                {firstName.charAt(0).toUpperCase()}
              </div>

              <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-[3px] border-[#FFFDF9] bg-[#B49A72]" />

            </div>

            <div>

              <p className="text-sm font-bold text-[#332F29]">
                {profile?.name || "Your Profile"}
              </p>

              <p className="mt-1 text-xs text-[#9B9285]">
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
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[#E7E1D7] bg-[#FFFDF9] p-4 shadow-[0_8px_25px_rgba(72,62,48,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_35px_rgba(72,62,48,0.08)] sm:p-5">

      {/* Decorative corner */}

      <div className="pointer-events-none absolute -right-5 -top-5 h-16 w-16 rounded-full bg-[#F4EFE6] opacity-0 transition duration-300 group-hover:opacity-100" />

      <div className="relative flex items-start justify-between gap-2">

        <div>

          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#A39A8C] sm:text-[11px]">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold tracking-tight text-[#292722] sm:text-3xl">
            {value}
          </p>

        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E7DFD2] bg-[#F5F0E7] text-[#8F7857] transition duration-300 group-hover:scale-105">
          <Icon size={17} />
        </div>

      </div>

      <p className="relative mt-3 text-[10px] text-[#9B9286] sm:text-[11px]">
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
          ? "border-[#DCD2C2] bg-[#F2EEE6] text-[#806D52]"
          : "border-[#E5D8C3] bg-[#F8F1E6] text-[#9A7D51]"
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
    <div className="rounded-2xl border border-[#E9E3D9] bg-[#FAF8F3] p-3.5">

      <div className="flex items-center justify-between">

        <span className="text-[11px] font-medium text-[#81786B]">
          {label}
        </span>

        <span className="text-xs font-bold text-[#443E35]">
          {value}
        </span>

      </div>

      <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-[#E8E2D8]">

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

      <p className="text-lg font-bold tracking-tight text-[#332F29]">
        {value}
      </p>

      <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#A39A8D]">
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

      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#E8E1D6] bg-[#F8F5EF] text-[#9C9284]">
        <FolderKanban size={21} />
      </div>

      <h3 className="mt-4 text-sm font-bold text-[#4A443B]">
        No projects yet
      </h3>

      <p className="mt-1 max-w-xs text-xs leading-5 text-[#9A9185]">
        Add your first project and it will appear here.
      </p>

    </div>
  );
}

export default Dashboard;