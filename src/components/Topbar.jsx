import { Bell, Search } from "lucide-react";
import { motion } from "motion/react";

function Topbar({ setOpen }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
      <div className="flex h-[73px] items-center gap-3 px-4 sm:px-6 lg:px-8">

        {/* Mobile Menu */}
        <button
          onClick={() => setOpen(true)}
          className="rounded-xl p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden"
        >
          <span className="block h-0.5 w-5 bg-current" />
          <span className="my-1.5 block h-0.5 w-5 bg-current" />
          <span className="block h-0.5 w-5 bg-current" />
        </button>

        {/* Search */}
        <div className="relative hidden w-full max-w-md sm:block">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search anything..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-500/5"
          />
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">

          {/* Notification */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <Bell size={19} />

            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-sky-500 ring-2 ring-white" />
          </motion.button>

          {/* Divider */}
          <div className="hidden h-8 w-px bg-slate-200 sm:block" />

          {/* Profile */}
          <button className="flex items-center gap-3 rounded-xl p-1.5 transition hover:bg-slate-50">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white">
              J
            </div>

            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold text-slate-800">
                Judi
              </p>

              <p className="text-[11px] text-slate-400">
                Developer
              </p>
            </div>
          </button>

        </div>
      </div>

      {/* Mobile Search */}
      <div className="border-t border-slate-100 bg-white px-4 py-3 sm:hidden">
        <div className="relative">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search anything..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-sky-300 focus:bg-white"
          />
        </div>
      </div>
    </header>
  );
}

export default Topbar;