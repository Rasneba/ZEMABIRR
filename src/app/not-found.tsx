import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <div className="text-7xl">🎲</div>
      <h1 className="mt-4 text-3xl font-black">Page not found</h1>
      <p className="mt-1 text-mute">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link href="/" className="btn-gold mt-6 inline-block rounded-xl px-6 py-3">Back to home</Link>
    </div>
  );
}
