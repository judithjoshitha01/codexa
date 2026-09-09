import { motion } from "motion/react";
import { ArrowUpRight, FolderKanban } from "lucide-react";

function ProjectCard({
  title,
  description,
  tech,
  status = "Completed",
}) {
  return (
    <motion.article
      whileHover={{ y: -5 }}
      className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-xl"
    >
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
          <FolderKanban size={20} className="text-slate-700" />
        </div>

        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
          {status}
        </span>
      </div>

      <h3 className="mt-6 text-lg font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {tech.map((item) => (
          <span
            key={item}
            className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600"
          >
            {item}
          </span>
        ))}
      </div>

      <button className="mt-6 flex items-center gap-2 text-sm font-semibold text-sky-600 transition-all group-hover:gap-3">
        View Project
        <ArrowUpRight size={16} />
      </button>
    </motion.article>
  );
}

export default ProjectCard;