import { useEffect, useState } from "react";
import {
  Bell,
  Check,
  Download,
  FolderKanban,
  RotateCcw,
  Settings as SettingsIcon,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { addActivity } from "../utils/activity";

const PROJECTS_KEY = "codexa_projects";
const PROFILE_KEY = "codexa_profile";
const ACTIVITY_KEY = "codexa_activity";
const NOTIFICATION_KEY = "codexa_notifications";

function Settings() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState(true);
  const [projectsCount, setProjectsCount] = useState(0);
  const [activitiesCount, setActivitiesCount] = useState(0);
  const [profileExists, setProfileExists] = useState(false);
  const [message, setMessage] = useState("");

  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    try {
      const savedNotification = localStorage.getItem(
        NOTIFICATION_KEY
      );

      const projects =
        JSON.parse(
          localStorage.getItem(PROJECTS_KEY)
        ) || [];

      const activities =
        JSON.parse(
          localStorage.getItem(ACTIVITY_KEY)
        ) || [];

      setNotifications(
        savedNotification === null
          ? true
          : savedNotification === "true"
      );

      setProjectsCount(
        Array.isArray(projects) ? projects.length : 0
      );

      setActivitiesCount(
        Array.isArray(activities)
          ? activities.length
          : 0
      );

      setProfileExists(
        Boolean(localStorage.getItem(PROFILE_KEY))
      );
    } catch {
      setNotifications(true);
      setProjectsCount(0);
      setActivitiesCount(0);
      setProfileExists(false);
    }
  };

  const toggleNotifications = () => {
    const newValue = !notifications;

    setNotifications(newValue);

    localStorage.setItem(
      NOTIFICATION_KEY,
      String(newValue)
    );

    showMessage(
      newValue
        ? "Notifications enabled."
        : "Notifications disabled."
    );
  };

  const showMessage = (text) => {
    setMessage(text);

    setTimeout(() => {
      setMessage("");
    }, 2500);
  };

  const exportWorkspace = () => {
    const backup = {
      exportedAt: new Date().toISOString(),
      profile:
        JSON.parse(
          localStorage.getItem(PROFILE_KEY)
        ) || null,
      projects:
        JSON.parse(
          localStorage.getItem(PROJECTS_KEY)
        ) || [],
      activities:
        JSON.parse(
          localStorage.getItem(ACTIVITY_KEY)
        ) || [],
      notifications,
    };

    const blob = new Blob(
      [JSON.stringify(backup, null, 2)],
      {
        type: "application/json",
      }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "codexa-backup.json";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);

    addActivity(
      "created",
      "Workspace Exported",
      "A backup of your Codexa workspace was downloaded."
    );

    showMessage("Workspace backup downloaded.");
  };

  const deleteProjects = () => {
    localStorage.removeItem(PROJECTS_KEY);

    window.dispatchEvent(
      new Event("codexa-projects-updated")
    );

    addActivity(
      "deleted",
      "Projects Deleted",
      "All projects were removed from your workspace."
    );

    setProjectsCount(0);
    setConfirmAction(null);

    showMessage("All projects deleted.");
  };

  const resetWorkspace = () => {
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(PROJECTS_KEY);
    localStorage.removeItem(ACTIVITY_KEY);
    localStorage.removeItem(NOTIFICATION_KEY);

    window.dispatchEvent(
      new Event("codexa-profile-updated")
    );

    window.dispatchEvent(
      new Event("codexa-projects-updated")
    );

    setConfirmAction(null);

    navigate("/setup", {
      replace: true,
    });
  };

  const confirm = () => {
    if (confirmAction === "projects") {
      deleteProjects();
    }

    if (confirmAction === "reset") {
      resetWorkspace();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-sky-600">
          Workspace
        </p>

        <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
          Settings
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Manage your Codexa workspace and preferences.
        </p>
      </header>

      {/* Success Message */}
      {message && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          <Check size={16} />
          {message}
        </div>
      )}

      {/* Preferences */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-100 p-5">
          <div className="rounded-xl bg-sky-50 p-2 text-sky-600">
            <SettingsIcon size={18} />
          </div>

          <div>
            <h2 className="font-bold text-slate-900">
              Preferences
            </h2>

            <p className="text-xs text-slate-400">
              Control how your workspace behaves.
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {/* Notifications */}
          <div className="flex items-center justify-between gap-4 p-5">
            <div className="flex min-w-0 items-center gap-4">
              <div className="rounded-xl bg-slate-50 p-2.5 text-slate-500">
                <Bell size={18} />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-800">
                  Activity notifications
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Keep track of important workspace changes.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={toggleNotifications}
              className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                notifications
                  ? "bg-sky-500"
                  : "bg-slate-200"
              }`}
              aria-label="Toggle notifications"
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                  notifications
                    ? "left-6"
                    : "left-1"
                }`}
              />
            </button>
          </div>
        </div>
      </section>

      {/* Workspace Overview */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-100 p-5">
          <div className="rounded-xl bg-slate-50 p-2 text-slate-600">
            <FolderKanban size={18} />
          </div>

          <div>
            <h2 className="font-bold text-slate-900">
              Workspace overview
            </h2>

            <p className="text-xs text-slate-400">
              Current workspace information.
            </p>
          </div>
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-3">
          <Stat
            label="Projects"
            value={projectsCount}
          />

          <Stat
            label="Activities"
            value={activitiesCount}
          />

          <Stat
            label="Profile"
            value={profileExists ? "Complete" : "Setup"}
          />
        </div>
      </section>

      {/* Data Management */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-5">
          <h2 className="font-bold text-slate-900">
            Data management
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Export or manage your local workspace data.
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {/* Export */}
          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-slate-50 p-2.5 text-slate-500">
                <Download size={18} />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-800">
                  Export workspace
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  Download your profile, projects and activity data.
                </p>
              </div>
            </div>

            <button
              onClick={exportWorkspace}
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <Download size={16} />
              Export JSON
            </button>
          </div>

          {/* Delete Projects */}
          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-red-50 p-2.5 text-red-500">
                <Trash2 size={18} />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-800">
                  Delete all projects
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  Permanently remove all projects from Codexa.
                </p>
              </div>
            </div>

            <button
              onClick={() =>
                setConfirmAction("projects")
              }
              disabled={projectsCount === 0}
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Trash2 size={16} />
              Delete Projects
            </button>
          </div>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="rounded-2xl border border-red-200 bg-white shadow-sm">
        <div className="border-b border-red-100 p-5">
          <h2 className="font-bold text-red-700">
            Danger zone
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            These actions cannot be undone.
          </p>
        </div>

        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-red-50 p-2.5 text-red-500">
              <RotateCcw size={18} />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-800">
                Reset workspace
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-400">
                Delete your profile, projects, activities and
                preferences.
              </p>
            </div>
          </div>

          <button
            onClick={() =>
              setConfirmAction("reset")
            }
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600"
          >
            <RotateCcw size={16} />
            Reset Workspace
          </button>
        </div>
      </section>

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500">
                  {confirmAction === "reset" ? (
                    <RotateCcw size={19} />
                  ) : (
                    <Trash2 size={19} />
                  )}
                </div>

                <h2 className="text-lg font-bold text-slate-900">
                  {confirmAction === "reset"
                    ? "Reset workspace?"
                    : "Delete all projects?"}
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {confirmAction === "reset"
                    ? "This will permanently remove your profile, projects, activities and settings. You will need to set up your profile again."
                    : "All projects will be permanently removed from your workspace."}
                </p>
              </div>

              <button
                onClick={() => setConfirmAction(null)}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setConfirmAction(null)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={confirm}
                className="rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600"
              >
                {confirmAction === "reset"
                  ? "Reset Workspace"
                  : "Delete Projects"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* Stat Card */
function Stat({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}

export default Settings;