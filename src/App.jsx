import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import ToastProvider from "./components/ToastProvider";

import Welcome from "./pages/Welcome";
import ProfileSetup from "./pages/ProfileSetup";

import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Skills from "./pages/Skills";
import Analytics from "./pages/Analytics";
import Activity from "./pages/Activity";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

function MainApp() {
    const hasProfile = Boolean(
        localStorage.getItem("codexa_profile")
    );

    if (!hasProfile) {
        return <Navigate to="/setup" replace />;
    }

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#f7f8fc] text-slate-900">
            {/* Soft background decorations */}
            <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
                {/* Top left glow */}
                <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-violet-200/30 blur-3xl animate-soft-float" />

                {/* Top right glow */}
                <div className="absolute right-[-100px] top-[100px] h-80 w-80 rounded-full bg-sky-200/25 blur-3xl animate-soft-float-delayed" />

                {/* Bottom glow */}
                <div className="absolute bottom-[-140px] left-[35%] h-96 w-96 rounded-full bg-indigo-200/20 blur-3xl animate-soft-float" />

                {/* Subtle grid */}
                <div
                    className="absolute inset-0 opacity-[0.35]"
                    style={{
                        backgroundImage: `
                            linear-gradient(to right, rgba(148,163,184,0.08) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(148,163,184,0.08) 1px, transparent 1px)
                        `,
                        backgroundSize: "40px 40px",
                    }}
                />

                {/* Minimal decorative circles */}
                <div className="absolute left-[18%] top-[18%] h-2 w-2 rounded-full bg-violet-400/40" />
                <div className="absolute right-[14%] top-[28%] h-3 w-3 rounded-full border border-slate-300/60" />
                <div className="absolute bottom-[20%] right-[24%] h-2 w-2 rounded-full bg-sky-400/30" />
            </div>

            {/* Existing sidebar */}
            <div className="relative z-20">
                <Sidebar />
            </div>

            {/* Main Content */}
            <main className="relative z-10 min-h-screen pt-16 lg:ml-64 lg:pt-0">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <div className="animate-page-enter">
                        <Routes>
                            <Route
                                path="/dashboard"
                                element={<Dashboard />}
                            />

                            <Route
                                path="/projects"
                                element={<Projects />}
                            />

                            <Route
                                path="/skills"
                                element={<Skills />}
                            />

                            <Route
                                path="/analytics"
                                element={<Analytics />}
                            />

                            <Route
                                path="/activity"
                                element={<Activity />}
                            />

                            <Route
                                path="/profile"
                                element={<Profile />}
                            />

                            <Route
                                path="/settings"
                                element={<Settings />}
                            />

                            <Route
                                path="*"
                                element={
                                    <Navigate
                                        to="/dashboard"
                                        replace
                                    />
                                }
                            />
                        </Routes>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <ToastProvider>
                <Routes>
                    {/* First page */}
                    <Route
                        path="/"
                        element={<Welcome />}
                    />

                    {/* First-time profile setup */}
                    <Route
                        path="/setup"
                        element={<ProfileSetup />}
                    />

                    {/* Main application */}
                    <Route
                        path="/*"
                        element={<MainApp />}
                    />
                </Routes>
            </ToastProvider>
        </BrowserRouter>
    );
}