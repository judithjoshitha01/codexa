import { useEffect, useMemo, useState } from "react";
import {
  Code2,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";

import { addActivity } from "../utils/activity";
import { useToast } from "../components/ToastProvider";

const PROFILE_KEY = "codexa_profile";

const CATEGORIES = {
  Frontend: [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Next.js",
    "Tailwind CSS",
  ],
  Tools: [
    "Git",
    "GitHub",
    "VS Code",
    "Vite",
  ],
  Backend: [
    "Node.js",
    "Express",
    "MongoDB",
    "MySQL",
  ],
  Other: [
    "Python",
    "C++",
    "REST API",
    "Responsive Design",
  ],
};

function Skills() {
  const toast = useToast();

  const [skills, setSkills] =
    useState([]);
  const [newSkill, setNewSkill] =
    useState("");
  const [activeCategory, setActiveCategory] =
    useState("All");

  useEffect(() => {
    loadSkills();

    const update = () => loadSkills();

    window.addEventListener(
      "codexa-profile-updated",
      update
    );

    window.addEventListener(
      "storage",
      update
    );

    return () => {
      window.removeEventListener(
        "codexa-profile-updated",
        update
      );

      window.removeEventListener(
        "storage",
        update
      );
    };
  }, []);

  const loadSkills = () => {
    try {
      const profile =
        JSON.parse(
          localStorage.getItem(
            PROFILE_KEY
          )
        ) || {};

      setSkills(
        Array.isArray(profile.skills)
          ? profile.skills
          : []
      );
    } catch {
      setSkills([]);
    }
  };

  const addSkillItem = () => {
    const value =
      newSkill.trim();

    if (!value) {
      toast.warning(
        "Enter a skill first."
      );
      return;
    }

    const exists = skills.some(
      (skill) =>
        skill.toLowerCase() ===
        value.toLowerCase()
    );

    if (exists) {
      toast.warning(
        `${value} is already added.`
      );
      return;
    }

    const updated = [
      ...skills,
      value,
    ];

    saveSkills(updated);

    setNewSkill("");

    addActivity(
      "updated",
      "Skill Added",
      `${value} was added to your skills.`
    );

    toast.success(
      `${value} added successfully.`
    );
  };

  const removeSkill = (skill) => {
    const updated = skills.filter(
      (item) => item !== skill
    );

    saveSkills(updated);

    addActivity(
      "updated",
      "Skill Removed",
      `${skill} was removed from your skills.`
    );

    toast.success(
      `${skill} removed successfully.`
    );
  };

  const saveSkills = (updatedSkills) => {
    try {
      const profile =
        JSON.parse(
          localStorage.getItem(
            PROFILE_KEY
          )
        ) || {};

      const updatedProfile = {
        ...profile,
        skills: updatedSkills,
      };

      localStorage.setItem(
        PROFILE_KEY,
        JSON.stringify(
          updatedProfile
        )
      );

      setSkills(updatedSkills);

      window.dispatchEvent(
        new Event(
          "codexa-profile-updated"
        )
      );
    } catch {
      toast.error(
        "Unable to save skills."
      );
    }
  };

  const getCategory = (skill) => {
    for (const [category, list] of Object.entries(
      CATEGORIES
    )) {
      if (
        list.some(
          (item) =>
            item.toLowerCase() ===
            skill.toLowerCase()
        )
      ) {
        return category;
      }
    }

    return "Other";
  };

  const categoryCounts = useMemo(() => {
    const counts = {
      Frontend: 0,
      Tools: 0,
      Backend: 0,
      Other: 0,
    };

    skills.forEach((skill) => {
      counts[getCategory(skill)]++;
    });

    return counts;
  }, [skills]);

  const filteredSkills =
    activeCategory === "All"
      ? skills
      : skills.filter(
          (skill) =>
            getCategory(skill) ===
            activeCategory
        );

  const suggestedSkills =
    Object.values(CATEGORIES)
      .flat()
      .filter(
        (skill) =>
          !skills.some(
            (existing) =>
              existing.toLowerCase() ===
              skill.toLowerCase()
          )
      )
      .slice(0, 8);

  return (
    <div className="space-y-6">

      {/* Header */}
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-sky-600">
          Developer toolkit
        </p>

        <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
          Skills
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Track the technologies and tools you work with.
        </p>
      </header>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <Stat
          label="Total Skills"
          value={skills.length}
          icon={Code2}
        />

        <Stat
          label="Frontend"
          value={categoryCounts.Frontend}
          icon={Sparkles}
        />

        <Stat
          label="Tools"
          value={categoryCounts.Tools}
          icon={Code2}
        />

        <Stat
          label="Backend"
          value={categoryCounts.Backend}
          icon={Code2}
        />

      </div>

      {/* Add Skill */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="flex items-center gap-3">

          <div className="rounded-xl bg-sky-50 p-2 text-sky-600">
            <Plus size={18} />
          </div>

          <div>
            <h2 className="font-bold text-slate-900">
              Add a skill
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Add technologies that you know or are learning.
            </p>
          </div>

        </div>

        <div className="mt-4 flex gap-2">

          <input
            value={newSkill}
            onChange={(e) =>
              setNewSkill(
                e.target.value
              )
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addSkillItem();
              }
            }}
            placeholder="e.g. React"
            className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-sky-400 focus:bg-white"
          />

          <button
            onClick={addSkillItem}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">
              Add
            </span>
          </button>

        </div>

      </section>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">

        {[
          "All",
          "Frontend",
          "Tools",
          "Backend",
          "Other",
        ].map((category) => (
          <button
            key={category}
            onClick={() =>
              setActiveCategory(
                category
              )
            }
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
              activeCategory ===
              category
                ? "bg-slate-900 text-white"
                : "border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
            }`}
          >
            {category}
          </button>
        ))}

      </div>

      {/* Skills List */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="flex items-center justify-between">

          <div>
            <h2 className="font-bold text-slate-900">
              My Skills
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              {filteredSkills.length}{" "}
              {filteredSkills.length === 1
                ? "skill"
                : "skills"}
            </p>
          </div>

          <Code2
            size={20}
            className="text-slate-300"
          />

        </div>

        {filteredSkills.length === 0 ? (
          <div className="py-12 text-center">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
              <Code2 size={22} />
            </div>

            <h3 className="mt-4 text-sm font-bold text-slate-700">
              No skills here
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              Add a skill to see it in this section.
            </p>

          </div>
        ) : (
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

            {filteredSkills.map(
              (skill) => (
                <SkillItem
                  key={skill}
                  skill={skill}
                  category={getCategory(
                    skill
                  )}
                  onRemove={() =>
                    removeSkill(
                      skill
                    )
                  }
                />
              )
            )}

          </div>
        )}

      </section>

      {/* Suggestions */}
      {suggestedSkills.length > 0 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-amber-50 p-2 text-amber-600">
              <Sparkles size={17} />
            </div>

            <div>
              <h2 className="font-bold text-slate-900">
                Suggested skills
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Common technologies you can add to your workspace.
              </p>
            </div>

          </div>

          <div className="mt-4 flex flex-wrap gap-2">

            {suggestedSkills.map(
              (skill) => (
                <button
                  key={skill}
                  onClick={() => {
                    saveSkills([
                      ...skills,
                      skill,
                    ]);

                    addActivity(
                      "updated",
                      "Skill Added",
                      `${skill} was added to your skills.`
                    );

                    toast.success(
                      `${skill} added successfully.`
                    );
                  }}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-600"
                >
                  + {skill}
                </button>
              )
            )}

          </div>

        </section>
      )}

    </div>
  );
}

/* Stat */
function Stat({
  label,
  value,
  icon: Icon,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div className="rounded-xl bg-slate-100 p-2.5 text-slate-500">
          <Icon size={18} />
        </div>

        <span className="text-2xl font-bold text-slate-900">
          {value}
        </span>

      </div>

      <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>

    </div>
  );
}

/* Skill Item */
function SkillItem({
  skill,
  category,
  onRemove,
}) {
  return (
    <div className="group flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3 transition hover:border-slate-200 hover:bg-white">

      <div className="flex min-w-0 items-center gap-3">

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-sky-500 shadow-sm">
          <Code2 size={17} />
        </div>

        <div className="min-w-0">

          <p className="truncate text-sm font-semibold text-slate-700">
            {skill}
          </p>

          <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-400">
            {category}
          </p>

        </div>

      </div>

      <button
        onClick={onRemove}
        className="rounded-lg p-2 text-slate-300 opacity-0 transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
        title={`Remove ${skill}`}
      >
        <Trash2 size={15} />
      </button>

    </div>
  );
}

export default Skills;