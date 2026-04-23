import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";

export type Theme = "auto" | "cyan-crimson" | "teal-slate";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
  resolvedScheme: "light" | "dark";
}

const STORAGE_KEY = "linea.theme";
const ThemeContext = createContext<ThemeContextValue | null>(null);

const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  // Both custom themes are dark; auto follows OS. .dark class kept in sync
  // so existing dark: utilities continue to work.
  const isDark =
    theme === "cyan-crimson" ||
    theme === "teal-slate" ||
    (theme === "auto" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  root.classList.toggle("dark", isDark);

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    const colorMap: Record<Theme, string> = {
      auto: isDark ? "#000000" : "#ffffff",
      "cyan-crimson": "#252A34",
      "teal-slate": "#222831",
    };
    meta.setAttribute("content", colorMap[theme]);
  }
};

const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") return "auto";
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (stored === "auto" || stored === "cyan-crimson" || stored === "teal-slate") {
      return stored;
    }
  } catch {
    /* ignore */
  }
  return "auto";
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(() => getInitialTheme());
  const [resolvedScheme, setResolvedScheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => {
      if (theme === "auto") {
        setResolvedScheme(mq.matches ? "dark" : "light");
        applyTheme("auto"); // re-sync .dark class on OS change
      } else {
        setResolvedScheme("dark");
      }
    };
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [theme]);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    try {
      localStorage.setItem(STORAGE_KEY, t);
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedScheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};

// Inline script — applies theme + .dark class before paint to prevent FOUC.
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('${STORAGE_KEY}')||'auto';document.documentElement.setAttribute('data-theme',t);var d=t==='cyan-crimson'||t==='teal-slate'||(t==='auto'&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark');}catch(e){}})();`;
