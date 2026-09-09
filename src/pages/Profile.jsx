import { useEffect, useMemo, useState } from "react";
import {
  GitBranch,
  LinkIcon,
  Mail,
  Pencil,
  Plus,
  Save,
  UserRound,
  X,
} from "lucide-react";

import { addActivity } from "../utils/activity";
import { useToast } from "../components/ToastProvider";

const KEY = "codexa_profile";

const EMPTY = {
  name: "",
  email: "",
  role: "",
  bio: "",
  github: "",
  linkedin: "",
  skills: [],
};

function Profile() {
  const toast = useToast();

  const [profile, setProfile] = useState(EMPTY);
  const [form, setForm] = useState(EMPTY);
  const [skill, setSkill] = useState("");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const load = () => {
      try {
        const data =
          JSON.parse(localStorage.getItem(KEY)) || EMPTY;

        const value = {
          ...EMPTY,
          ...data,
          skills: Array.isArray(data.skills)
            ? data.skills
            : [],
        };

        setProfile(value);
        setForm(value);
      } catch {
        setProfile(EMPTY);
        setForm(EMPTY);
      }
    };

    load();

    const update = () => load();

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

  const completion = useMemo(() => {
    const fields = [
      profile.name,
      profile.email,
      profile.role,
      profile.bio,
      profile.github,
      profile.linkedin,
      profile.skills.length,
    ];

    return Math.round(
      (fields.filter(Boolean).length /
        fields.length) *
        100
    );
  }, [profile]);

  const change = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const addSkill = () => {
    const value = skill.trim();

    if (!value) {
      toast.warning("Enter a skill first.");
      return;
    }

    const exists = form.skills.some(
      (s) =>
        s.toLowerCase() ===
        value.toLowerCase()
    );

    if (exists) {
      toast.warning(
        `${value} is already in your skills.`
      );
      return;
    }

    setForm({
      ...form,
      skills: [...form.skills, value],
    });

    setSkill("");

    toast.success(
      `${value} added to your skills.`
    );
  };

  const removeSkill = (value) => {
    setForm({
      ...form,
      skills: form.skills.filter(
        (s) => s !== value
      ),
    });

    toast.info(
      `${value} removed from your skills.`
    );
  };

  const save = (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.warning(
        "Please enter your name."
      );
      return;
    }

    if (!form.email.trim()) {
      toast.warning(
        "Please enter your email."
      );
      return;
    }

    const data = {
      ...form,
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role.trim(),
      bio: form.bio.trim(),
      github: form.github.trim(),
      linkedin: form.linkedin.trim(),
    };

    localStorage.setItem(
      KEY,
      JSON.stringify(data)
    );

    setProfile(data);
    setForm(data);
    setEditing(false);

    addActivity(
      "updated",
      "Profile Updated",
      "Your profile information was updated."
    );

    window.dispatchEvent(
      new Event("codexa-profile-updated")
    );

    toast.success(
      "Profile updated successfully."
    );
  };

  const cancel = () => {
    setForm(profile);
    setSkill("");
    setEditing(false);
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-sky-600">
            Developer profile
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            Profile
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage your developer information
            and skills.
          </p>
        </div>

        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <Pencil size={16} />
            Edit Profile
          </button>
        )}
      </header>

      {/* Profile Card */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="px-5 py-6 sm:px-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            {/* User */}
            <div className="flex items-center gap-4">

              {/* Profile Icon */}
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-500">
                <UserRound
                  size={38}
                  strokeWidth={1.8}
                />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {profile.name ||
                    "Your Name"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {profile.role ||
                    "Frontend Developer"}
                </p>

                {profile.email && (
                  <p className="mt-1 text-xs text-slate-400">
                    {profile.email}
                  </p>
                )}
              </div>
            </div>

            {/* Completion */}
            <div className="w-full sm:w-52">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-500">
                  Profile completion
                </span>

                <span className="text-slate-700">
                  {completion}%
                </span>
              </div>

              <div className="mt-2 h-2 rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-sky-500 transition-all"
                  style={{
                    width: `${completion}%`,
                  }}
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="grid gap-6 xl:grid-cols-3">

        {/* Personal Information */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-2">

          <div className="border-b border-slate-100 p-5">
            <h2 className="font-bold text-slate-900">
              Personal information
            </h2>
          </div>

          {editing ? (
            <form
              onSubmit={save}
              className="space-y-5 p-5"
            >

              {/* Inputs */}
              <div className="grid gap-5 sm:grid-cols-2">

                <Input
                  label="Name"
                  name="name"
                  value={form.name}
                  onChange={change}
                />

                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={change}
                />

                <Input
                  label="Role"
                  name="role"
                  value={form.role}
                  onChange={change}
                />

                <Input
                  label="GitBranch"
                  name="github"
                  value={form.github}
                  onChange={change}
                  placeholder="https://github.com/..."
                />

                <Input
                  label="LinkIcon"
                  name="linkedin"
                  value={form.linkedin}
                  onChange={change}
                  placeholder="https://linkedin.com/in/..."
                  className="sm:col-span-2"
                />

              </div>

              {/* Bio */}
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Bio
                </label>

                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={change}
                  rows="4"
                  placeholder="Tell something about yourself..."
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none transition focus:border-sky-400 focus:bg-white"
                />
              </div>

              {/* Skills */}
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Skills
                </label>

                <div className="mt-2 flex gap-2">

                  <input
                    value={skill}
                    onChange={(e) =>
                      setSkill(e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                    placeholder="Add skill..."
                    className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-sky-400 focus:bg-white"
                  />

                  <button
                    type="button"
                    onClick={addSkill}
                    className="rounded-xl bg-slate-900 px-4 text-white transition hover:bg-slate-800"
                  >
                    <Plus size={17} />
                  </button>

                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {form.skills.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600"
                    >
                      {s}

                      <button
                        type="button"
                        onClick={() =>
                          removeSkill(s)
                        }
                        className="text-slate-400 transition hover:text-red-500"
                      >
                        <X size={13} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 border-t border-slate-100 pt-5">

                <button
                  type="button"
                  onClick={cancel}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600"
                >
                  <Save size={16} />
                  Save
                </button>

              </div>

            </form>
          ) : (
            <div className="grid gap-6 p-5 sm:grid-cols-2">

              <Info
                label="Name"
                value={profile.name}
              />

              <Info
                label="Email"
                value={profile.email}
              />

              <Info
                label="Role"
                value={profile.role}
              />

              <Info
                label="Skills"
                value={`${profile.skills.length} skills`}
              />

            </div>
          )}

        </section>

        {/* Contact & Links */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-100 p-5">
            <h2 className="font-bold text-slate-900">
              Contact & Links
            </h2>
          </div>

          <div className="space-y-3 p-5">

            <LinkCard
              icon={Mail}
              label="Email"
              value={profile.email}
              href={
                profile.email
                  ? `mailto:${profile.email}`
                  : ""
              }
            />

            <LinkCard
              icon={GitBranch}
              label="GitHub"
              value={profile.github}
              href={profile.github}
            />

            <LinkCard
              icon={LinkIcon}
              label="LinkedIn"
              value={profile.linkedin}
              href={profile.linkedin}
            />

          </div>
        </section>

      </div>

      {/* About + Skills */}
      <div className="grid gap-6 lg:grid-cols-3">

        {/* About */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-sky-50 p-2 text-sky-600">
              <UserRound size={17} />
            </div>

            <h2 className="font-bold text-slate-900">
              About
            </h2>

          </div>

          <p className="mt-5 text-sm leading-7 text-slate-600">
            {profile.bio ||
              "Add a short developer bio from Edit Profile."}
          </p>

        </section>

        {/* Skills */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="font-bold text-slate-900">
            Skills
          </h2>

          <div className="mt-4 flex flex-wrap gap-2">

            {profile.skills.length ? (
              profile.skills.map((s) => (
                <span
                  key={s}
                  className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600"
                >
                  {s}
                </span>
              ))
            ) : (
              <p className="text-sm text-slate-400">
                No skills added.
              </p>
            )}

          </div>
        </section>

      </div>
    </div>
  );
}

/* Input */
function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
  className = "",
}) {
  return (
    <div className={className}>

      <label className="text-sm font-semibold text-slate-700">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-sky-400 focus:bg-white"
      />

    </div>
  );
}

/* Info */
function Info({ label, value }) {
  return (
    <div>

      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-700">
        {value || "Not provided"}
      </p>

    </div>
  );
}

/* Link Card */
function LinkCard({
  icon: Icon,
  label,
  value,
  href,
}) {
  if (!href) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-slate-100 p-3">

        <Icon
          size={17}
          className="text-slate-400"
        />

        <div>

          <p className="text-xs text-slate-400">
            {label}
          </p>

          <p className="text-sm text-slate-400">
            Not provided
          </p>

        </div>

      </div>
    );
  }

  return (
    <a
      href={href}
      target={
        label === "Email"
          ? undefined
          : "_blank"
      }
      rel="noreferrer"
      className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:bg-sky-50"
    >

      <Icon
        size={17}
        className="text-slate-500"
      />

      <div className="min-w-0">

        <p className="text-xs text-slate-400">
          {label}
        </p>

        <p className="truncate text-sm font-semibold text-slate-700">
          {value}
        </p>

      </div>

    </a>
  );
}

export default Profile;