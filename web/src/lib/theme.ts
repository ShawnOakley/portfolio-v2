/** Theme preference. "system" means: follow the device setting. */
export const THEMES = ["system", "light", "dark"] as const;
export type Theme = (typeof THEMES)[number];

export const THEME_KEY = "theme";

export function isTheme(value: unknown): value is Theme {
  return THEMES.includes(value as Theme);
}

/**
 * Runs in <head> before first paint, so a stored choice never flashes the
 * other theme. Kept as a string because it must not wait for React.
 * Storage can be unavailable (private mode, blocked cookies); then the
 * system setting applies.
 */
export const THEME_INIT_SCRIPT = `try{var t=localStorage.getItem("${THEME_KEY}");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export function readStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    return isTheme(stored) ? stored : "system";
  } catch {
    return "system";
  }
}

export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  if (theme === "system") delete root.dataset.theme;
  else root.dataset.theme = theme;
  try {
    if (theme === "system") localStorage.removeItem(THEME_KEY);
    else localStorage.setItem(THEME_KEY, theme);
  } catch {
    // The choice still applies for this page view.
  }
}
