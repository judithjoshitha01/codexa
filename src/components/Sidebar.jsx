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
      if (
        (e.ctrlKey || e.metaKey) &&
        e.key.toLowerCase() === "k"
      ) {
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

  const skillResults =
    profile?.skills
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
      {/* =====================================================
          MOBILE HEADER
      ====================================================== */}

      <header className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between border-b border-[#E8E2D8] bg-[#FFFDF9] px-4 shadow-[0_4px_18px_rgba(72,62,48,0.04)] lg:hidden">

        <div>
          <h1 className="text-lg font-bold tracking-tight text-[#292722]">
            Codexa
          </h1>

          <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#9E9588]">
            Developer Workspace
          </p>
        </div>

        <div className="flex items-center gap-1">

          <button
            onClick={() => setSearchOpen(true)}
            className="rounded-xl p-2 text-[#81786B] transition hover:bg-[#F3EFE7] hover:text-[#5E5140]"
            aria-label="Search"
          >
            <Search size={20} />
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-xl p-2 text-[#6F665A] transition hover:bg-[#F3EFE7]"
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

      {/* =====================================================
          MOBILE MENU
      ====================================================== */}

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-[#292722]/20 backdrop-blur-[2px] lg:hidden">

          <div className="absolute right-0 top-16 w-64 border-b border-l border-[#E7E0D5] bg-[#FFFDF9] p-4 shadow-2xl">

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
                      `group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                        isActive
                          ? "bg-[#F0E9DC] text-[#806B4D] shadow-sm"
                          : "text-[#777064] hover:bg-[#F8F5EF] hover:text-[#39342D]"
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

                        {isActive && (
                          <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#B49A72]" />
                        )}
                      </>
                    )}
                  </NavLink>
                )
              )}

            </nav>

            {/* Mobile User */}

            <div className="mt-4 border-t border-[#ECE6DC] pt-4">

              <div className="flex items-center gap-3 rounded-xl border border-[#E9E2D7] bg-[#F8F5EF] p-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#302C26] text-sm font-bold text-[#F8F3E9]">
                  {getInitial(profile?.name)}
                </div>

                <div className="min-w-0">

                  <p className="truncate text-sm font-semibold text-[#3B362F]">
                    {profile?.name || "Judi"}
                  </p>

                  <p className="truncate text-[11px] text-[#999083]">
                    {profile?.role ||
                      "Frontend Developer"}
                  </p>

                </div>

              </div>

            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          DESKTOP SIDEBAR
      ====================================================== */}

      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-[#E6E0D6] bg-[#FFFDF9] lg:block">

        <div className="flex h-full flex-col">

          {/* =================================================
              LOGO
          ================================================== */}

          <div className="flex h-20 items-center border-b border-[#EEE9E0] px-6">

            <div>

              <div className="flex items-center gap-2">

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#302C26] text-xs font-bold text-[#F8F3E9]">
                  C
                </div>

                <h1 className="text-xl font-bold tracking-tight text-[#292722]">
                  Codexa
                </h1>

              </div>

              <p className="ml-10 mt-0.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#9E9588]">
                Developer Workspace
              </p>

            </div>

          </div>

          {/* =================================================
              SEARCH
          ================================================== */}

          <div className="px-4 pt-4">

            <button
              onClick={() => setSearchOpen(true)}
              className="group flex w-full items-center gap-2 rounded-xl border border-[#E6DFD4] bg-[#F8F5EF] px-3 py-2.5 text-left transition duration-200 hover:border-[#D9CCBA] hover:bg-[#FFFDF9] hover:shadow-sm"
            >

              <Search
                size={16}
                className="text-[#9A9082] transition group-hover:text-[#806B4D]"
              />

              <span className="flex-1 text-xs text-[#9B9286]">
                Search...
              </span>

              <kbd className="rounded-md border border-[#E2DBD0] bg-[#FFFDF9] px-1.5 py-0.5 text-[9px] font-semibold text-[#9B9286]">
                Ctrl K
              </kbd>

            </button>

          </div>

          {/* =================================================
              NAVIGATION
          ================================================== */}

          <nav className="flex-1 space-y-1 overflow-y-auto p-4">

            <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#A39A8D]">
              Workspace
            </p>

            {navigation.map(
              ({ name, path, icon: Icon }) => (
                <NavLink
                  key={name}
                  to={path}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition duration-200 ${
                      isActive
                        ? "bg-[#F0E9DC] text-[#806B4D] shadow-[0_3px_12px_rgba(122,99,66,0.07)]"
                        : "text-[#777064] hover:bg-[#F8F5EF] hover:text-[#39342D]"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>

                      {/* Active indicator */}

                      {isActive && (
                        <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-[#B49A72]" />
                      )}

                      <Icon
                        size={18}
                        strokeWidth={
                          isActive ? 2.3 : 2
                        }
                        className={`shrink-0 transition-transform duration-200 ${
                          isActive
                            ? ""
                            : "group-hover:scale-105"
                        }`}
                      />

                      <span>{name}</span>

                      {isActive && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#B49A72]" />
                      )}

                    </>
                  )}
                </NavLink>
              )
            )}

          </nav>

          {/* =================================================
              USER
          ================================================== */}

          <div className="border-t border-[#EEE9E0] p-4">

            <div className="group flex items-center gap-3 rounded-xl border border-[#E9E2D7] bg-[#F8F5EF] p-3 transition hover:bg-[#F3EEE5]">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#302C26] text-sm font-bold text-[#F8F3E9] shadow-sm">
                {getInitial(profile?.name)}
              </div>

              <div className="min-w-0">

                <p className="truncate text-sm font-semibold text-[#3B362F]">
                  {profile?.name || "Judi"}
                </p>

                <p className="truncate text-[11px] text-[#999083]">
                  {profile?.role ||
                    "Frontend Developer"}
                </p>

              </div>

            </div>

          </div>

        </div>
      </aside>

      {/* =====================================================
          SEARCH MODAL
      ====================================================== */}

      {searchOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-start justify-center bg-[#292722]/35 px-4 pt-[12vh] backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              closeSearch();
            }
          }}
        >

          <div className="w-full max-w-2xl overflow-hidden rounded-[22px] border border-[#E4DDD2] bg-[#FFFDF9] shadow-[0_25px_70px_rgba(50,43,34,0.18)]">

            {/* Search Input */}

            <div className="flex items-center gap-3 border-b border-[#EEE8DE] px-4">

              <Search
                size={20}
                className="text-[#9A9082]"
              />

              <input
                autoFocus
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search pages, projects or skills..."
                className="h-14 min-w-0 flex-1 bg-transparent text-sm text-[#3A352E] outline-none placeholder:text-[#AAA195]"
              />

              <button
                onClick={closeSearch}
                className="rounded-lg p-1.5 text-[#9A9185] transition hover:bg-[#F2EEE7] hover:text-[#5B5144]"
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
                    className="mx-auto text-[#C5BBAE]"
                  />

                  <p className="mt-3 text-sm font-semibold text-[#5B5348]">
                    Search your workspace
                  </p>

                  <p className="mt-1 text-xs text-[#A39A8D]">
                    Find pages, projects and skills quickly.
                  </p>

                </div>
              ) : !hasResults ? (
                <div className="px-4 py-8 text-center">

                  <p className="text-sm font-semibold text-[#5B5348]">
                    No results found
                  </p>

                  <p className="mt-1 text-xs text-[#A39A8D]">
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

            <div className="flex items-center justify-between border-t border-[#EEE8DE] bg-[#F8F5EF] px-4 py-3">

              <p className="text-[10px] text-[#A39A8D]">
                Press Esc to close
              </p>

              <p className="text-[10px] font-semibold text-[#A39A8D]">
                Codexa Search
              </p>

            </div>

          </div>
        </div>
      )}
    </>
  );
}

/* =========================================================
   RESULT GROUP
========================================================= */

function ResultGroup({ title, children }) {
  return (
    <div>

      <p className="mb-1 px-2 text-[10px] font-bold uppercase tracking-wider text-[#A39A8D]">
        {title}
      </p>

      <div className="space-y-1">
        {children}
      </div>

    </div>
  );
}

/* =========================================================
   SEARCH RESULT
========================================================= */

function Result({
  icon: Icon,
  title,
  subtitle,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition duration-200 hover:bg-[#F6F2EA]"
    >

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#E8E1D6] bg-[#F9F6F0] text-[#8E806D] transition group-hover:border-[#DDD1BE] group-hover:bg-[#F0E9DC] group-hover:text-[#806B4D]">
        <Icon size={17} />
      </div>

      <div className="min-w-0">

        <p className="truncate text-sm font-semibold text-[#4A443B]">
          {title}
        </p>

        <p className="truncate text-xs text-[#A0988C]">
          {subtitle}
        </p>

      </div>

    </button>
  );
}

/* =========================================================
   AVATAR INITIAL
========================================================= */

function getInitial(name) {
  if (!name?.trim()) return "J";

  return name.trim()[0].toUpperCase();
}

export default Sidebar;