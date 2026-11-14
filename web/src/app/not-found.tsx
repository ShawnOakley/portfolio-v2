import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <h1>No page at this address</h1>
      <p className="lede">
        The link may be out of date. <Link href="/">Go to the home page</Link>.
      </p>
    </>
  );
}
