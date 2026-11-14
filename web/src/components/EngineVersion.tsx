"use client";

import { useEffect, useState } from "react";
import { describeEngine, isHealth, type Health } from "@/lib/health";

/**
 * Shows which engine version the API is running, so "the site runs the code
 * the benchmarks measured" can be checked from the footer.
 */
export function EngineVersion() {
  const [health, setHealth] = useState<Health | null>(null);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/health", { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((body: unknown) => {
        setHealth(isHealth(body) ? body : null);
        setSettled(true);
      })
      .catch(() => {
        if (!controller.signal.aborted) setSettled(true);
      });
    return () => controller.abort();
  }, []);

  return (
    <code data-testid="engine-version" aria-live="polite">
      {settled ? describeEngine(health) : "engine: checking"}
    </code>
  );
}
