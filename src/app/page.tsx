import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <Link
        href="/campaigns/new"
        className="text-3xl font-bold text-blue-600 hover:underline"
      >
        Crear campaña&nbsp;🚀
      </Link>
    </main>
  );
}
