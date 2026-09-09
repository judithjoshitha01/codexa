// src/pages/Activity.jsx

import { useEffect, useMemo, useState } from "react";
import {
  Activity as ActivityIcon,
  CheckCircle2,
  Clock3,
  FilePlus2,
  Pencil,
  Trash2,
  UserRound,
  Wrench,
  X,
} from "lucide-react";

const ACTIVITY_KEY = "codexa_activity";

function Activity() {
  const [activities, setActivities] = useState([]);
  const [search, setSearch] = useState("");

  // --------------------------------
  // LOAD ACTIVITIES
  // --------------------------------
  useEffect(() => {
    const loadActivities = () => {
      try {
        const stored = localStorage.getItem(ACTIVITY_KEY);
        const parsed = stored ? JSON.parse(stored) : [];

        setActivities(Array.isArray(parsed) ? parsed : []);
      } catch {
        setActivities([]);
      }
    };

    loadActivities();

    const handleActivityUpdate = () => {
      loadActivities();
    };

    const handleStorage = (event) => {
      if (event.key === ACTIVITY_KEY) {
        loadActivities();
      }
    };

    window.addEventListener(
      "codexa-activity-updated",
      handleActivityUpdate
    );

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(
        "codexa-activity-updated",
        handleActivityUpdate
      );

      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  // --------------------------------
  // FILTER ACTIVITIES
  // --------------------------------
  const filteredActivities = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return activities;
    }

    return activities.filter((activity) =>
      [
        activity.title,
        activity.description,
        activity.type,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(query)
        )
    );
  }, [activities, search]);

  // --------------------------------
  // CLEAR HISTORY
  // --------------------------------
  const clearHistory = () => {
    const confirmed = window.confirm(
      "Are you sure you want to clear your entire activity history?"
    );

    if (!confirmed) return;

    localStorage.removeItem(ACTIVITY_KEY);

    setActivities([]);

    window.dispatchEvent(
      new Event("codexa-activity-updated")
    );
  };

  return (
    <div className="space-y-6">
      {/* --------------------------------
          HEADER
      -------------------------------- */}
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-sky-600">
            Workspace history
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Activity
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Keep track of changes and actions across your Codexa
            workspace.
          </p>
        </div>

        {activities.length > 0 && (
          <button
            type="button"
            onClick={clearHistory}
            className="inline-flex w-fit items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 size={16} />
            Clear history
          </button>
        )}
      </header>

      {/* --------------------------------
          SUMMARY
      -------------------------------- */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={ActivityIcon}
          label="Total activities"
          value={activities.length}
        />

        <SummaryCard
          icon={Clock3}
          label="Recent activity"
          value={
            activities.length > 0
              ? formatRelativeTime(activities[0].timestamp)
              : "None"
          }
        />

        <SummaryCard
          icon={CheckCircle2}
          label="Workspace status"
          value="Active"
        />
      </section>

      {/* --------------------------------
          SEARCH
      -------------------------------- */}
      {activities.length > 0 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="relative">
            <ActivityIcon
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search activity..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-10 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-50"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </section>
      )}

      {/* --------------------------------
          ACTIVITY TIMELINE
      -------------------------------- */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Recent activity
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                {filteredActivities.length}{" "}
                {filteredActivities.length === 1
                  ? "activity"
                  : "activities"}{" "}
                found
              </p>
            </div>

            <div className="hidden h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-600 sm:flex">
              <ActivityIcon size={17} />
            </div>
          </div>
        </div>

        {filteredActivities.length === 0 ? (
          <EmptyState
            hasSearch={Boolean(search)}
            clearSearch={() => setSearch("")}
          />
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredActivities.map((activity) => (
              <ActivityItem
                key={activity.id}
                activity={activity}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

/* =====================================
   SUMMARY CARD
===================================== */

function SummaryCard({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
          <Icon size={18} />
        </div>
      </div>

      <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 truncate text-xl font-bold tracking-tight text-slate-900">
        {value}
      </p>
    </div>
  );
}

/* =====================================
   ACTIVITY ITEM
===================================== */

function ActivityItem({ activity }) {
  const { icon: Icon, wrapperClass, iconClass } =
    getActivityStyle(activity.type);

  return (
    <div className="group flex gap-4 px-5 py-5 transition hover:bg-slate-50/70 sm:px-6">
      {/* Icon */}
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${wrapperClass}`}
      >
        <Icon size={17} className={iconClass} />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-slate-800">
              {activity.title || "Workspace activity"}
            </h3>

            {activity.description && (
              <p className="mt-1 text-sm leading-6 text-slate-500">
                {activity.description}
              </p>
            )}
          </div>

          <time className="shrink-0 text-xs font-medium text-slate-400">
            {formatActivityDate(activity.timestamp)}
          </time>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            {activity.type || "activity"}
          </span>

          <span className="text-[11px] text-slate-400">
            {formatRelativeTime(activity.timestamp)}
          </span>
        </div>
      </div>
    </div>
  );
}

/* =====================================
   ACTIVITY STYLE
===================================== */

function getActivityStyle(type) {
  switch (type) {
    case "created":
      return {
        icon: FilePlus2,
        wrapperClass: "bg-emerald-50",
        iconClass: "text-emerald-600",
      };

    case "updated":
      return {
        icon: Pencil,
        wrapperClass: "bg-sky-50",
        iconClass: "text-sky-600",
      };

    case "deleted":
      return {
        icon: Trash2,
        wrapperClass: "bg-red-50",
        iconClass: "text-red-500",
      };

    case "added":
      return {
        icon: Wrench,
        wrapperClass: "bg-violet-50",
        iconClass: "text-violet-600",
      };

    case "profile":
      return {
        icon: UserRound,
        wrapperClass: "bg-amber-50",
        iconClass: "text-amber-600",
      };

    default:
      return {
        icon: ActivityIcon,
        wrapperClass: "bg-slate-100",
        iconClass: "text-slate-600",
      };
  }
}

/* =====================================
   EMPTY STATE
===================================== */

function EmptyState({
  hasSearch,
  clearSearch,
}) {
  return (
    <div className="flex min-h-[360px] items-center justify-center px-6 py-12">
      <div className="max-w-sm text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
          {hasSearch ? (
            <X size={24} />
          ) : (
            <ActivityIcon size={26} />
          )}
        </div>

        <h3 className="mt-5 text-base font-bold text-slate-900">
          {hasSearch
            ? "No matching activity"
            : "No activity yet"}
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          {hasSearch
            ? "Try a different search term or clear your current search."
            : "Your workspace actions will appear here automatically as you create, update, or manage your projects."}
        </p>

        {hasSearch && (
          <button
            type="button"
            onClick={clearSearch}
            className="mt-5 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Clear search
          </button>
        )}
      </div>
    </div>
  );
}

/* =====================================
   DATE HELPERS
===================================== */

function formatActivityDate(timestamp) {
  if (!timestamp) return "Unknown date";

  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatRelativeTime(timestamp) {
  if (!timestamp) return "Unknown";

  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  const difference = Date.now() - date.getTime();

  const seconds = Math.floor(difference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 10) {
    return "Just now";
  }

  if (seconds < 60) {
    return `${seconds}s ago`;
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  if (hours < 24) {
    return `${hours}h ago`;
  }

  if (days < 7) {
    return `${days}d ago`;
  }

  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });
}

export default Activity;