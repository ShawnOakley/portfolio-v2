"use client";

import { useSyncExternalStore } from "react";
import { applyTheme, readStoredTheme, THEMES, type Theme } from "@/lib/theme";
import styles from "./ThemeControl.module.css";

const LABELS: Record<Theme, string> = {
  system: "Auto",
  light: "Light",
  dark: "Dark",
};

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Keep other tabs in step.
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function choose(theme: Theme) {
  applyTheme(theme);
  listeners.forEach((listener) => listener());
}

/**
 * Three choices, not a two-way switch: "Auto" follows the device, and the
 * visitor can always get back to it.
 */
export function ThemeControl() {
  // The server cannot know the stored choice; it renders "system" and the
  // client corrects on hydration without a mismatch warning.
  const theme = useSyncExternalStore<Theme>(
    subscribe,
    readStoredTheme,
    () => "system",
  );

  return (
    <fieldset className={styles.control}>
      <legend className="visually-hidden">Color theme</legend>
      {THEMES.map((option) => (
        <label key={option} className={styles.option}>
          <input
            className="visually-hidden"
            type="radio"
            name="theme"
            value={option}
            checked={theme === option}
            onChange={() => choose(option)}
          />
          <span>{LABELS[option]}</span>
        </label>
      ))}
    </fieldset>
  );
}
