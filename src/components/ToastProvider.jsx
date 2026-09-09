import {
  CheckCircle2,
  CircleAlert,
  Info,
  X,
  XCircle,
} from "lucide-react";
import {
  createContext,
  useContext,
  useState,
} from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = (id) => {
    setToasts((prev) =>
      prev.filter((toast) => toast.id !== id)
    );
  };

  const showToast = (
    message,
    type = "success",
    duration = 3000
  ) => {
    const id = Date.now() + Math.random();

    setToasts((prev) => [
      ...prev,
      {
        id,
        message,
        type,
      },
    ]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const toast = {
    success: (message) =>
      showToast(message, "success"),

    error: (message) =>
      showToast(message, "error"),

    warning: (message) =>
      showToast(message, "warning"),

    info: (message) =>
      showToast(message, "info"),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}

      <div className="fixed right-4 top-20 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3 sm:right-6 sm:w-full">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            toast={toast}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function Toast({ toast, onClose }) {
  const config = {
    success: {
      icon: CheckCircle2,
      title: "Success",
      iconClass: "bg-emerald-50 text-emerald-600",
    },

    error: {
      icon: XCircle,
      title: "Error",
      iconClass: "bg-red-50 text-red-600",
    },

    warning: {
      icon: CircleAlert,
      title: "Warning",
      iconClass: "bg-amber-50 text-amber-600",
    },

    info: {
      icon: Info,
      title: "Information",
      iconClass: "bg-sky-50 text-sky-600",
    },
  };

  const style =
    config[toast.type] || config.success;

  const Icon = style.icon;

  return (
    <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-lg">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${style.iconClass}`}
      >
        <Icon size={18} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-800">
          {style.title}
        </p>

        <p className="mt-0.5 text-xs leading-5 text-slate-500">
          {toast.message}
        </p>
      </div>

      <button
        onClick={onClose}
        className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
      >
        <X size={16} />
      </button>
    </div>
  );
}

export function useToast() {
  const toast = useContext(ToastContext);

  if (!toast) {
    throw new Error(
      "useToast must be used inside ToastProvider"
    );
  }

  return toast;
}
export default ToastProvider;