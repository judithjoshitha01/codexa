import { motion } from "motion/react";
import { CheckCircle2, Code2 } from "lucide-react";

function SkillCard({ name, level, progress }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-lg"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
            <Code2 size={18} className="text-slate-700" />
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {name}
            </h3>

            <p className="text-xs text-slate-400">
              {level}
            </p>
          </div>
        </div>

        <CheckCircle2
          size={17}
          className="text-emerald-500"
        />
      </div>

      <div className="mt-6">
        <div className="flex justify-between text-xs">
          <span className="text-slate-400">
            Proficiency
          </span>

          <span className="font-semibold text-slate-700">
            {progress}%
          </span>
        </div>

        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${progress}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="h-full rounded-full bg-sky-500"
          />
        </div>
      </div>
    </motion.div>
  );
}

export default SkillCard;