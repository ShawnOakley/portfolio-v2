/** Shape returned by the FastAPI service at /api/health. */
export type Health = {
  status: "ok";
  engine: string;
  engine_version: string;
};

export function isHealth(value: unknown): value is Health {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    v.status === "ok" &&
    typeof v.engine === "string" &&
    typeof v.engine_version === "string"
  );
}

/** Text for the footer. Never throws; an unreachable API is a normal state. */
export function describeEngine(health: Health | null): string {
  if (!health) return "engine: unavailable";
  return `${health.engine} ${health.engine_version}`;
}
