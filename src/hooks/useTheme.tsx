import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";

export type Theme = "auto" | "colorful" | "purple-dark";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
  resolvedScheme: "light" | "dark";
}

const STORAGE_KEY = "linea.theme";
const ThemeContext = createContext<ThemeContextValue | null>(null);

const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  // Remove any prior theme attribute, set new one
  root.setAttribute("data-theme", theme);
  // For "auto", let the prefers-color-scheme media query inside CSS take over.
  // For explicit dark themes, also set .dark class so existing dark utilities still work.
  if (theme === "purple-dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
  // Update theme-color meta for native UI (status bar)
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    const colorMap: Record<Theme, string> = {
      auto: "#ffffff",
      colorful: "#fdf2ff",
      "purple-dark": "#1a0b2e",
    };
    meta.setAttribute("content", colorMap[theme]);
  }
};

const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") return "auto";
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (stored === "auto" || stored === "colorful" || stored === "purple-dark") {
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

  // Apply on mount & whenever theme changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Track system preference for "auto" mode
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => {
      if (theme === "auto") {
        setResolvedScheme(mq.matches ? "dark" : "light");
      } else {
        setResolvedScheme(theme === "purple-dark" ? "dark" : "light");
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

// Inline script content for index.html — applies theme before paint to avoid FOUC.
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('${STORAGE_KEY}')||'auto';document.documentElement.setAttribute('data-theme',t);if(t==='purple-dark')document.documentElement.classList.add('dark');}catch(e){}})();`;
