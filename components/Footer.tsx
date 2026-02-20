import Link from "next/link";

export default function Footer({ shop, phone }: { shop: string; phone?: string }) {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="text-sm text-gray-600">
          © {new Date().getFullYear()} <span className="font-semibold text-gray-900">{shop}</span>. Since 2021.
        </div>
        <Link href="/admin" className="text-sm underline">
          Login as admin?
        </Link>
      </div>
    </footer>
  );
}
