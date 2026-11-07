import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon.svg" alt="Cutout Studio" className="h-7 w-7" />
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

      <section className="mt-24 rounded-3xl border border-neutral-200 bg-white p-10 text-center dark:border-neutral-800 dark:bg-neutral-900">
        <h2 className="text-2xl font-bold">Get in touch</h2>
        <p className="mx-auto mt-3 max-w-2xl text-neutral-600 dark:text-neutral-400">
          Questions, feedback, or want a custom feature? Reach out anytime.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a
            href="https://x.com/Himansh95861047"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-5 py-2.5 text-sm font-medium hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            X / Twitter
          </a>
          <a
            href="https://github.com/himanshu0072510"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-5 py-2.5 text-sm font-medium hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 .5C5.37.5 0 5.78 0 12.292c0 5.211 3.438 9.63 8.207 11.188.6.109.82-.254.82-.567 0-.28-.01-1.022-.015-2.005-3.338.711-4.042-1.582-4.042-1.582-.546-1.361-1.333-1.725-1.333-1.725-1.089-.731.084-.716.084-.716 1.205.082 1.838 1.215 1.838 1.215 1.07 1.803 2.809 1.282 3.495.981.108-.763.417-1.282.76-1.577-2.665-.295-5.466-1.309-5.466-5.827 0-1.287.465-2.339 1.235-3.164-.135-.298-.54-1.497.105-3.121 0 0 1.005-.316 3.3 1.209.96-.262 1.98-.392 3-.398 1.02.006 2.04.136 3 .398 2.28-1.525 3.285-1.209 3.285-1.209.645 1.624.24 2.823.12 3.121.76.825 1.23 1.877 1.23 3.164 0 4.53-2.805 5.527-5.475 5.817.42.354.81 1.077.81 2.182 0 1.578-.015 2.846-.015 3.229 0 .315.21.685.825.568C20.565 21.917 24 17.5 24 12.292 24 5.78 18.627.5 12 .5z" />
            </svg>
            GitHub
          </a>
          <a
            href="mailto:himanshu5179abcd@gmail.com"
            className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-5 py-2.5 text-sm font-medium hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            Email
          </a>
        </div>
      </section>

      <footer className="mt-12 border-t border-neutral-200 pt-8 text-center text-sm text-neutral-500 dark:border-neutral-800">
        Built with Next.js 15, Tailwind v4, TypeScript strict. Free & open source.{" "}
        <a href="https://github.com/himanshu0072510/cutout-studio" className="text-indigo-500 hover:underline">
          Source on GitHub
        </a>
      </footer>
    </main>
  );
}
