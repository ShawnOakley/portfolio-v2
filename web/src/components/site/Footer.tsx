import { EngineVersion } from "@/components/EngineVersion";

export function Footer() {
  return (
    <footer className="flex flex-wrap justify-between gap-x-site-5 gap-y-site-2 border-t border-rule px-gutter py-site-4 text-step-small text-ink-soft">
      <p>Software I built. Not legal services or legal advice.</p>
      <p>
        <EngineVersion />
      </p>
    </footer>
  );
}
