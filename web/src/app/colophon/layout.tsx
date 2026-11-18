import { BackLink } from "@/components/site/BackLink";

export default function ColophonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BackLink href="/notes" label="Back to Notes" />
      {children}
    </>
  );
}
