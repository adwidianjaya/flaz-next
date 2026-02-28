import Link from "next/link";
import Script from "next/script";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Pages",
};

export default async function Page() {
  return (
    <>
      <Script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4" />
    </>
  );
}
