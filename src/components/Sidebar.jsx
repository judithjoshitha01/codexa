import { useEffect, useState } from "react";
import {
  Activity,
  BarChart3,
  Code2,
  FolderKanban,
  LayoutDashboard,
  Menu,
  Search,
  Settings,
  User,
  X,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const PROJECTS_KEY = "codexa_projects";
const PROFILE_KEY = "codexa_profile";

function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [projects, setProjects] = useState([]);
  const [profile, setProfile] = useState(null);

  const navigate = useNavigate();

  const navigation = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Projects",
      path: "/projects",
      icon: FolderKanban,
    },
    {
      name: "Skills",
      path: "/skills",
      icon: Code2,
    },
    {
      name: "Analytics",
      path: "/analytics",
      icon: BarChart3,
    },
    {
      name: "Activity",
      path: "/activity",
      icon: Activity,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: User,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ];

  useEffect(() => {
    loadData();

    const update = () => loadData();

    window.addEventListener(
      "codexa-projects-updated",
      update
    );

    window.addEventListener(
      "codexa-profile-updated",
      update
    );

    window.addEventListener("storage", update);

    return () => {
      window.removeEventListener(
        "codexa-projects-updated",
        update
      );

      window.removeEventListener(
        "codexa-profile-updated",
        update
      );

      window.removeEventListener("storage", update);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }

      if (e.key === "Escape") {
        setSearchOpen(false);
        setSearch("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () =>
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
  }, []);

  const loadData = () => {
    try {
      const savedProjects =
        JSON.parse(
          localStorage.getItem(PROJECTS_KEY)
        ) || [];

      const savedProfile =
        JSON.parse(
          localStorage.getItem(PROFILE_KEY)
        ) || null;

      setProjects(
        Array.isArray(savedProjects)
          ? savedProjects
          : []
      );

      setProfile(savedProfile);
    } catch {
      setProjects([]);
      setProfile(null);
    }
  };

  const projectResults = projects
    .filter((project) => {
      const text = `
        ${project.title || ""}
        ${project.description || ""}
        ${project.tech || ""}
        ${project.status || ""}
      `.toLowerCase();

      return text.includes(search.toLowerCase());
    })
    .slice(0, 5);

  const pageResults = navigation.filter((item) =>
    item.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const skillResults = profile?.skills
    ?.filter((skill) =>
      skill
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .slice(0, 5) || [];

  const hasResults =
    search.trim() &&
    (pageResults.length ||
      projectResults.length ||
      skillResults.length);

  const goTo = (path) => {
    navigate(path);
    closeSearch();
    setMobileOpen(false);
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setSearch("");
  };

  return (
    <>
      {/* Mobile Header */}
      <header className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between border-b border-slate-200 bg-[#b8a98b] px-4 lg:hidden">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-slate-900">
            Codexa
          </h1>

          <p className="text-[9px] font-medium uppercase tracking-widest text-slate-400">
            Developer Workspace
          </p>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setSearchOpen(true)}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Search"
          >
            <Search size={20} />
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? (
              <X size={22} />
            ) : (
              <Menu size={22} />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/20 lg:hidden">
          <div className="absolute right-0 top-16 w-64 border-b border-l border-slate-200 bg-white p-4 shadow-xl">
            <nav className="space-y-1">
              {navigation.map(
                ({ name, path, icon: Icon }) => (
                  <NavLink
                    key={name}
                    to={path}
                    onClick={() =>
                      setMobileOpen(false)
                    }
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                        isActive
                          ? "bg-sky-50 text-sky-600"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          size={18}
                          strokeWidth={
                            isActive ? 2.3 : 2
                          }
                        />
                        <span>{name}</span>
                      </>
                    )}
                  </NavLink>
                )
              )}
            </nav>

            <div className="mt-4 border-t border-slate-100 pt-4">
              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-sm font-bold text-white">
                  {getInitial(
                    profile?.name
                  )}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {profile?.name || "Judi"}
                  </p>

                  <p className="truncate text-[11px] text-slate-400">
                    {profile?.role ||
                      "Frontend Developer"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-slate-200 bg-[#F8F6F1] lg:block">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-20 items-center border-b border-slate-100 px-6">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Codexa
              </h1>

              <p className="mt-0.5 text-[10px] font-medium uppercase tracking-widest text-slate-400">
                Developer Workspace
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="px-4 pt-4">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-left transition hover:border-slate-300 hover:bg-white"
            >
              <Search
                size={16}
                className="text-slate-400"
              />

              <span className="flex-1 text-xs text-slate-400">
                Search...
              </span>

              <kbd className="rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[9px] font-semibold text-slate-400">
                Ctrl K
              </kbd>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Workspace
            </p>

            {navigation.map(
              ({ name, path, icon: Icon }) => (
                <NavLink
                  key={name}
                  to={path}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                      isActive
                        ? "bg-sky-50 text-sky-600"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={18}
                        strokeWidth={
                          isActive ? 2.3 : 2
                        }
                        className="shrink-0"
                      />

                      <span>{name}</span>
                    </>
                  )}
                </NavLink>
              )
            )}
          </nav>

          {/* User */}
          <div className="border-t border-slate-100 p-4">
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-sm font-bold text-white">
                {getInitial(profile?.name)}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-800">
                  {profile?.name || "Judi"}
                </p>

                <p className="truncate text-[11px] text-slate-400">
                  {profile?.role ||
                    "Frontend Developer"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Search Modal */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-start justify-center bg-slate-900/40 px-4 pt-[12vh] backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              closeSearch();
            }
          }}
        >
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            {/* Search Input */}
            <div className="flex items-center gap-3 border-b border-slate-100 px-4">
              <Search
                size={20}
                className="text-slate-400"
              />

              <input
                autoFocus
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search pages, projects or skills..."
                className="h-14 min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
              />

              <button
                onClick={closeSearch}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={17} />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto p-3">
              {!search.trim() ? (
                <div className="px-4 py-8 text-center">
                  <Search
                    size={24}
                    className="mx-auto text-slate-300"
                  />

                  <p className="mt-3 text-sm font-semibold text-slate-600">
                    Search your workspace
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Find pages, projects and skills quickly.
                  </p>
                </div>
              ) : !hasResults ? (
                <div className="px-4 py-8 text-center">
                  <p className="text-sm font-semibold text-slate-600">
                    No results found
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Try a different keyword.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Pages */}
                  {pageResults.length > 0 && (
                    <ResultGroup title="Pages">
                      {pageResults.map(
                        ({
                          name,
                          path,
                          icon: Icon,
                        }) => (
                          <Result
                            key={path}
                            icon={Icon}
                            title={name}
                            subtitle={path}
                            onClick={() =>
                              goTo(path)
                            }
                          />
                        )
                      )}
                    </ResultGroup>
                  )}

                  {/* Projects */}
                  {projectResults.length > 0 && (
                    <ResultGroup title="Projects">
                      {projectResults.map(
                        (project) => (
                          <Result
                            key={project.id}
                            icon={FolderKanban}
                            title={
                              project.title ||
                              "Untitled Project"
                            }
                            subtitle={
                              project.description ||
                              "Project"
                            }
                            onClick={() =>
                              goTo("/projects")
                            }
                          />
                        )
                      )}
                    </ResultGroup>
                  )}

                  {/* Skills */}
                  {skillResults.length > 0 && (
                    <ResultGroup title="Skills">
                      {skillResults.map((skill) => (
                        <Result
                          key={skill}
                          icon={Code2}
                          title={skill}
                          subtitle="Developer skill"
                          onClick={() =>
                            goTo("/skills")
                          }
                        />
                      ))}
                    </ResultGroup>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-4 py-3">
              <p className="text-[10px] text-slate-400">
                Press Esc to close
              </p>

              <p className="text-[10px] font-medium text-slate-400">
                Codexa Search
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* Result Group */
function ResultGroup({ title, children }) {
  return (
    <div>
      <p className="mb-1 px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {title}
      </p>

      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
}

/* Search Result */
function Result({
  icon: Icon,
  title,
  subtitle,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-slate-50"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
        <Icon size={17} />
      </div>

      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-slate-700">
          {title}
        </p>

        <p className="truncate text-xs text-slate-400">
          {subtitle}
        </p>
      </div>
    </button>
  );
}

/* Avatar Initial */
function getInitial(name) {
  if (!name?.trim()) return "J";

  return name.trim()[0].toUpperCase();
}

export default Sidebar;