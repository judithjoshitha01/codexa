import { useEffect, useMemo, useState } from "react";
import {
  ExternalLink,
  GitBranch,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import { addActivity } from "../utils/activity";
import { useToast } from "../components/ToastProvider";

const PROJECTS_KEY = "codexa_projects";

const EMPTY_FORM = {
  title: "",
  description: "",
  tech: "",
  github: "",
  live: "",
  status: "Completed",
};

function Projects() {
  const toast = useToast();

  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("All");
  const [modalOpen, setModalOpen] =
    useState(false);
  const [editingId, setEditingId] =
    useState(null);
  const [form, setForm] =
    useState(EMPTY_FORM);

  useEffect(() => {
    loadProjects();

    const update = () => loadProjects();

    window.addEventListener(
      "codexa-projects-updated",
      update
    );

    window.addEventListener(
      "storage",
      update
    );

    return () => {
      window.removeEventListener(
        "codexa-projects-updated",
        update
      );

      window.removeEventListener(
        "storage",
        update
      );
    };
  }, []);

  const loadProjects = () => {
    try {
      const saved =
        JSON.parse(
          localStorage.getItem(
            PROJECTS_KEY
          )
        ) || [];

      setProjects(
        Array.isArray(saved)
          ? saved
          : []
      );
    } catch {
      setProjects([]);
    }
  };

  const filteredProjects = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return projects.filter((project) => {
      const text = `
        ${project.title || ""}
        ${project.description || ""}
        ${project.tech || ""}
      `.toLowerCase();

      const matchesSearch =
        !query ||
        text.includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        project.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    projects,
    search,
    statusFilter,
  ]);

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (project) => {
    setEditingId(project.id);

    setForm({
      title: project.title || "",
      description:
        project.description || "",
      tech: project.tech || "",
      github: project.github || "",
      live: project.live || "",
      status:
        project.status || "Completed",
    });

    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const change = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const saveProject = (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.warning(
        "Please enter a project title."
      );
      return;
    }

    if (!form.description.trim()) {
      toast.warning(
        "Please enter a project description."
      );
      return;
    }

    const cleanProject = {
      title: form.title.trim(),
      description:
        form.description.trim(),
      tech: form.tech.trim(),
      github: form.github.trim(),
      live: form.live.trim(),
      status: form.status,
    };

    let updated;

    if (editingId) {
      updated = projects.map(
        (project) =>
          project.id === editingId
            ? {
                ...project,
                ...cleanProject,
              }
            : project
      );

      addActivity(
        "updated",
        "Project Updated",
        `${cleanProject.title} was updated.`
      );

      toast.success(
        "Project updated successfully."
      );
    } else {
      const newProject = {
        id: Date.now(),
        ...cleanProject,
        createdAt:
          new Date().toISOString(),
      };

      updated = [
        newProject,
        ...projects,
      ];

      addActivity(
        "created",
        "Project Created",
        `${cleanProject.title} was added to your workspace.`
      );

      toast.success(
        "Project added successfully."
      );
    }

    localStorage.setItem(
      PROJECTS_KEY,
      JSON.stringify(updated)
    );

    setProjects(updated);

    window.dispatchEvent(
      new Event(
        "codexa-projects-updated"
      )
    );

    closeModal();
  };

  const deleteProject = (id) => {
    const project = projects.find(
      (item) => item.id === id
    );

    if (!project) return;

    const confirmed = window.confirm(
      `Delete "${project.title}"?`
    );

    if (!confirmed) return;

    const updated = projects.filter(
      (item) => item.id !== id
    );

    localStorage.setItem(
      PROJECTS_KEY,
      JSON.stringify(updated)
    );

    setProjects(updated);

    addActivity(
      "deleted",
      "Project Deleted",
      `${project.title} was removed from your workspace.`
    );

    window.dispatchEvent(
      new Event(
        "codexa-projects-updated"
      )
    );

    toast.success(
      "Project deleted successfully."
    );
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-sky-600">
            Workspace
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            Projects
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage and showcase your development projects.
          </p>
        </div>

        <button
          onClick={openAdd}
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <Plus size={17} />
          Add Project
        </button>
      </header>

      {/* Filters */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row">

          <div className="relative flex-1">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search projects..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-sky-400 focus:bg-white"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-600 outline-none focus:border-sky-400"
          >
            <option value="All">
              All Status
            </option>

            <option value="Completed">
              Completed
            </option>

            <option value="In Progress">
              In Progress
            </option>
          </select>

        </div>
      </section>

      {/* Project Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-600">
          {filteredProjects.length}{" "}
          {filteredProjects.length === 1
            ? "project"
            : "projects"}
        </p>

        {(search ||
          statusFilter !== "All") && (
          <button
            onClick={() => {
              setSearch("");
              setStatusFilter("All");
            }}
            className="text-xs font-semibold text-sky-600 hover:text-sky-700"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Projects */}
      {filteredProjects.length === 0 ? (
        <EmptyState
          search={search}
          onAdd={openAdd}
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map(
            (project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={() =>
                  openEdit(project)
                }
                onDelete={() =>
                  deleteProject(
                    project.id
                  )
                }
              />
            )
          )}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/40 px-4 py-6 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (
              e.target ===
              e.currentTarget
            ) {
              closeModal();
            }
          }}
        >
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl">

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h2 className="font-bold text-slate-900">
                  {editingId
                    ? "Edit Project"
                    : "Add Project"}
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Add project details to your workspace.
                </p>
              </div>

              <button
                onClick={closeModal}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={saveProject}
              className="space-y-5 p-5"
            >

              <Input
                label="Project Title"
                name="title"
                value={form.title}
                onChange={change}
                placeholder="e.g. SpendFlow"
              />

              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={
                    form.description
                  }
                  onChange={change}
                  rows="4"
                  placeholder="Describe your project..."
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none transition focus:border-sky-400 focus:bg-white"
                />
              </div>

              <Input
                label="Technologies"
                name="tech"
                value={form.tech}
                onChange={change}
                placeholder="React, Tailwind CSS, JavaScript"
              />

              <div className="grid gap-5 sm:grid-cols-2">

                <Input
                  label="GitHub URL"
                  name="github"
                  value={form.github}
                  onChange={change}
                  placeholder="https://github.com/..."
                />

                <Input
                  label="Live Demo URL"
                  name="live"
                  value={form.live}
                  onChange={change}
                  placeholder="https://..."
                />

              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Status
                </label>

                <select
                  name="status"
                  value={form.status}
                  onChange={change}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-sky-400"
                >
                  <option value="Completed">
                    Completed
                  </option>

                  <option value="In Progress">
                    In Progress
                  </option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 border-t border-slate-100 pt-5">

                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600"
                >
                  {editingId
                    ? "Save Changes"
                    : "Add Project"}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* Project Card */
function ProjectCard({
  project,
  onEdit,
  onDelete,
}) {
  const technologies = project.tech
    ? project.tech
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

  return (
    <article className="group flex min-h-[290px] flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

      {/* Top */}
      <div className="flex items-start justify-between gap-3">

        <div className="min-w-0">
          <h2 className="truncate text-lg font-bold text-slate-900">
            {project.title ||
              "Untitled Project"}
          </h2>

          <span
            className={`mt-2 inline-flex rounded-lg px-2.5 py-1 text-[10px] font-bold ${
              project.status ===
              "Completed"
                ? "bg-emerald-50 text-emerald-600"
                : "bg-amber-50 text-amber-600"
            }`}
          >
            {project.status ||
              "Completed"}
          </span>
        </div>

        <div className="flex shrink-0 gap-1">

          <button
            onClick={onEdit}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            title="Edit project"
          >
            <Pencil size={15} />
          </button>

          <button
            onClick={onDelete}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
            title="Delete project"
          >
            <Trash2 size={15} />
          </button>

        </div>
      </div>

      {/* Description */}
      <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-500">
        {project.description ||
          "No description provided."}
      </p>

      {/* Technologies */}
      <div className="mt-4 flex flex-wrap gap-2">
        {technologies.length ? (
          technologies
            .slice(0, 5)
            .map((tech) => (
              <span
                key={tech}
                className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-[10px] font-semibold text-slate-600"
              >
                {tech}
              </span>
            ))
        ) : (
          <span className="text-xs text-slate-400">
            No technologies added
          </span>
        )}
      </div>

      {/* Links */}
      <div className="mt-auto flex gap-2 border-t border-slate-100 pt-4">

        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            <GitBranch size={14} />
            Repository
          </a>
        )}

        {project.live && (
          <a
            href={project.live}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-600 transition hover:bg-sky-100"
          >
            <ExternalLink size={14} />
            Live Demo
          </a>
        )}

      </div>
    </article>
  );
}

/* Empty State */
function EmptyState({
  search,
  onAdd,
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">

      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
        <Plus size={22} />
      </div>

      <h2 className="mt-4 font-bold text-slate-800">
        {search
          ? "No projects found"
          : "No projects yet"}
      </h2>

      <p className="mx-auto mt-2 max-w-sm text-sm text-slate-400">
        {search
          ? "Try another search keyword or clear your filters."
          : "Add your first project and start building your developer workspace."}
      </p>

      {!search && (
        <button
          onClick={onAdd}
          className="mt-5 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Add Project
        </button>
      )}

    </div>
  );
}

/* Input */
function Input({
  label,
  name,
  value,
  onChange,
  placeholder,
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-slate-700">
        {label}
      </label>

      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-sky-400 focus:bg-white"
      />
    </div>
  );
}

export default Projects;