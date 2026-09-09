import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  User,
  Mail,
  Briefcase,
  FileText,
  GitBranch,
  LinkIcon,
  ArrowRight,
  Code2,
} from "lucide-react";

function ProfileSetup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    bio: "",
    github: "",
    linkedin: "",
    skills: [],
  });

  const [skillInput, setSkillInput] = useState("");
  const [error, setError] = useState("");

  // =========================
  // INPUT CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  // =========================
  // ADD SKILL
  // =========================

  const addSkill = () => {
    const skill = skillInput.trim();

    if (!skill) return;

    const alreadyExists = formData.skills.some(
      (item) => item.toLowerCase() === skill.toLowerCase()
    );

    if (alreadyExists) {
      setSkillInput("");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, skill],
    }));

    setSkillInput("");
  };

  // =========================
  // REMOVE SKILL
  // =========================

  const removeSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter(
        (skill) => skill !== skillToRemove
      ),
    }));
  };

  // =========================
  // ENTER KEY FOR SKILL
  // =========================

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!formData.role.trim()) {
      setError("Please enter your developer role.");
      return;
    }

    // Profile object
    const profile = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      role: formData.role.trim(),
      bio: formData.bio.trim(),
      github: formData.github.trim(),
      linkedin: formData.linkedin.trim(),
      skills: formData.skills,
      updatedAt: new Date().toISOString(),
    };

    // Save profile
    localStorage.setItem(
      "codexa_profile",
      JSON.stringify(profile)
    );

    // Navigate to dashboard
    navigate("/dashboard", {
      replace: true,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">

      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-sky-100/60 blur-3xl" />

        <div className="absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-slate-200/60 blur-3xl" />

      </div>

      <div className="relative mx-auto max-w-3xl">

        {/* =========================
            LOGO
        ========================= */}

        <div className="mb-8 text-center">

          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Codexa
          </h1>

          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            Developer Workspace
          </p>

        </div>


        {/* =========================
            CARD
        ========================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.4,
          }}
          className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
        >

          {/* =========================
              HEADER
          ========================= */}

          <div className="border-b border-slate-100 p-6 sm:p-8">

            <div className="flex items-start gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-500">
                <User size={19} />
              </div>

              <div>

                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-500">
                  Welcome to Codexa
                </p>

                <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                  Set up your profile
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Add your developer information to personalize
                  your Codexa workspace.
                </p>

              </div>

            </div>

          </div>


          {/* =========================
              FORM
          ========================= */}

          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-8"
          >

            {/* =========================
                BASIC INFORMATION
            ========================= */}

            <div>

              <h3 className="text-sm font-bold text-slate-800">
                Basic information
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                Your basic developer details.
              </p>

            </div>


            <div className="mt-5 grid gap-5 sm:grid-cols-2">

              <Input
                label="Full name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                icon={User}
                required
              />

              <Input
                label="Email address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                icon={Mail}
                required
              />

              <Input
                label="Developer role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="Frontend Developer"
                icon={Briefcase}
                required
              />

            </div>


            {/* =========================
                BIO
            ========================= */}

            <div className="mt-5">

              <label className="mb-2 block text-xs font-semibold text-slate-600">
                About you
              </label>

              <div className="relative">

                <FileText
                  size={16}
                  className="absolute left-4 top-4 text-slate-400"
                />

                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Write a short introduction about yourself..."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-11 py-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-400/10"
                />

              </div>

            </div>


            {/* =========================
                SKILLS
            ========================= */}

            <div className="mt-8 border-t border-slate-100 pt-8">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                  <Code2 size={16} />
                </div>

                <div>

                  <h3 className="text-sm font-bold text-slate-800">
                    Your skills
                  </h3>

                  <p className="text-xs text-slate-400">
                    Add technologies you work with.
                  </p>

                </div>

              </div>


              {/* Skill input */}

              <div className="mt-4 flex flex-col gap-2 sm:flex-row">

                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) =>
                    setSkillInput(e.target.value)
                  }
                  onKeyDown={handleSkillKeyDown}
                  placeholder="React, JavaScript, Tailwind CSS..."
                  className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-400/10"
                />

                <button
                  type="button"
                  onClick={addSkill}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Add skill
                </button>

              </div>


              {/* Added skills */}

              {formData.skills.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">

                  {formData.skills.map((skill) => (
                    <div
                      key={skill}
                      className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5"
                    >

                      <span className="text-xs font-medium text-slate-600">
                        {skill}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          removeSkill(skill)
                        }
                        className="text-sm font-bold text-slate-400 transition hover:text-red-500"
                      >
                        ×
                      </button>

                    </div>
                  ))}

                </div>
              )}

            </div>


            {/* =========================
                DEVELOPER LINKS
            ========================= */}

            <div className="mt-8 border-t border-slate-100 pt-8">

              <h3 className="text-sm font-bold text-slate-800">
                Developer links
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                Optional — you can add these later from Profile.
              </p>


              <div className="mt-5 grid gap-5 sm:grid-cols-2">

                {/* GitHub */}

                <Input
                  label="GitHub"
                  name="github"
                  value={formData.github}
                  onChange={handleChange}
                  placeholder="https://github.com/username"
                  icon={GitBranch}
                />


                {/* LinkedIn */}

                <Input
                  label="LinkedIn"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/username"
                  icon={LinkIcon}
                />

              </div>

            </div>


            {/* =========================
                ERROR
            ========================= */}

            {error && (
              <div className="mt-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs font-medium text-red-500">
                {error}
              </div>
            )}


            {/* =========================
                SUBMIT
            ========================= */}

            <div className="mt-8 border-t border-slate-100 pt-6">

              <button
                type="submit"
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >

                Continue to Codexa

                <ArrowRight
                  size={16}
                  className="transition group-hover:translate-x-1"
                />

              </button>

              <p className="mt-3 text-center text-[11px] text-slate-400">
                You can update your information anytime from Profile.
              </p>

            </div>

          </form>

        </motion.div>

      </div>

    </div>
  );
}


/* ========================================
   REUSABLE INPUT
======================================== */

function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  icon: Icon,
  required = false,
}) {
  return (
    <div>

      <label className="mb-2 block text-xs font-semibold text-slate-600">
        {label}
      </label>

      <div className="relative">

        <Icon
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-400/10"
        />

      </div>

    </div>
  );
}

export default ProfileSetup;