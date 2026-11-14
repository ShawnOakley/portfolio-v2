import type { MDXComponents } from "mdx/types";
import { AiBadge } from "@/components/ui/AiBadge";
import { Callout } from "@/components/ui/Callout";
import { Metric } from "@/components/ui/Metric";
import { SourceLink } from "@/components/ui/SourceLink";
import { StatusChip } from "@/components/ui/StatusChip";

/** Primitives available in every MDX file without an import. */
const components: MDXComponents = {
  AiBadge,
  Callout,
  Metric,
  SourceLink,
  StatusChip,
  wrapper: ({ children }) => <article className="prose">{children}</article>,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
