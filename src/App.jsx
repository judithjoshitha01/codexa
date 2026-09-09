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
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <Sidebar />

            <main className="min-h-screen pt-16 lg:ml-64 lg:pt-0">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
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