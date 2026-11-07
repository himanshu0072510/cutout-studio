import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold">
          <span className="inline-block h-7 w-7 rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-500" />
          Cutout Studio
        </div>
        <Link
          href="/studio"
          className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-white dark:text-neutral-900"
        >
          Open studio →
        </Link>
      </header>

      <section className="mt-20 text-center">
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
          Remove backgrounds. Edit photos. <span className="text-indigo-500">Free & private.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">
          Everything runs in your browser. Your photos never leave your device. No signup, no
          watermarks, no limits.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            href="/studio"
            className="rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-600"
          >
            Start editing
          </Link>
          <a
            href="#features"
            className="rounded-full border border-neutral-300 px-6 py-3 text-sm font-semibold hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
          >
            See features
          </a>
        </div>
      </section>

      <section id="features" className="mt-24 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { t: "Background removal", d: "AI-powered, runs locally via WASM. No upload." },
          { t: "Replace background", d: "Solid colors, gradients, blur, or your own image." },
          { t: "Crop & resize", d: "Presets for Instagram, LinkedIn, Amazon, Shopify." },
          { t: "Adjustments", d: "Brightness, contrast, saturation, temperature." },
          { t: "Transform", d: "Rotate, flip, straighten." },
          { t: "Export", d: "PNG, JPEG, WebP. No watermarks." },
        ].map((f) => (
          <div
            key={f.t}
            className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
          >
            <h3 className="font-semibold">{f.t}</h3>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{f.d}</p>
          </div>
        ))}
      </section>

      <section className="mt-24 rounded-3xl border border-neutral-200 bg-white p-10 text-center dark:border-neutral-800 dark:bg-neutral-900">
        <h2 className="text-2xl font-bold">Privacy by design</h2>
        <p className="mx-auto mt-3 max-w-2xl text-neutral-600 dark:text-neutral-400">
          Cutout Studio processes images entirely in your browser using WebAssembly. We never see
          your photos. No account required.
        </p>
      </section>

      <footer className="mt-24 border-t border-neutral-200 pt-8 text-center text-sm text-neutral-500 dark:border-neutral-800">
        Built with Next.js 15, Tailwind v4, TypeScript strict. Free & open source.
      </footer>
    </main>
  );
}
