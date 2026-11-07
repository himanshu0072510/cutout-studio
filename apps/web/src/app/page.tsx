import Link from "next/link";

export default function Home() {
  const features = [
    { t: "Background removal", d: "AI-powered, runs locally via WASM. No upload, no server." },
    { t: "Replace background", d: "Solid colors, gradients, blur, or your own image." },
    { t: "Crop & resize", d: "Presets for Instagram, LinkedIn, Amazon, Shopify." },
    { t: "Adjustments", d: "Brightness, contrast, saturation, temperature." },
    { t: "Transform", d: "Rotate, flip, straighten. Undo/redo ready." },
    { t: "Export", d: "PNG, JPEG, WebP. No watermarks. Copy to clipboard." },
  ];

  const steps = [
    { n: "01", t: "Drop an image", d: "Drag, click, or paste from clipboard. PNG, JPG, WebP." },
    { n: "02", t: "Remove & edit", d: "One click removes the background. Adjust, replace, crop." },
    { n: "03", t: "Export", d: "Download or copy. Free, private, instant." },
  ];

  return (
    <main className="min-h-screen bg-[#09090b] text-neutral-100">
      {/* Nav */}
      <header className="sticky top-0 z-30 border-b border-white/5 bg-[#09090b]/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icon.svg" alt="Cutout Studio" className="h-7 w-7" />
            <span className="text-sm font-semibold tracking-tight">Cutout Studio</span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm text-neutral-400 md:flex">
            <Link href="/studio" className="hover:text-white">Studio</Link>
            <a href="#features" className="hover:text-white">Features</a>
            <a href="#how" className="hover:text-white">How it works</a>
            <a href="https://github.com/himanshu0072510/cutout-studio" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              GitHub
            </a>
          </nav>
          <Link
            href="/studio"
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-neutral-200"
          >
            Open Studio →
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-500/20 blur-[120px]" />
          <div className="absolute right-0 top-40 h-[400px] w-[400px] rounded-full bg-fuchsia-500/15 blur-[100px]" />
        </div>
        <div className="mx-auto max-w-5xl px-6 pb-20 pt-24 text-center sm:pt-32">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neutral-300">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
            Free · Private · Runs in your browser
          </div>
          <h1 className="mt-8 text-5xl font-bold leading-[1.05] tracking-tight sm:text-7xl">
            Remove backgrounds
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
              that just work.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-400">
            AI-powered background removal, editing, and export — entirely in your browser.
            Your photos never leave your device. No signup, no watermarks, no limits.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              href="/studio"
              className="rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black shadow-lg shadow-white/10 hover:bg-neutral-200"
            >
              Start editing →
            </Link>
            <a
              href="https://github.com/himanshu0072510/cutout-studio"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/15 px-7 py-3.5 text-sm font-semibold text-white hover:bg-white/5"
            >
              View source
            </a>
          </div>
          <p className="mt-6 text-xs text-neutral-500">
            13,500+ builders shipping faster · wait, that's scrolltide's number. Ours is just getting started.
          </p>
        </div>
      </section>

      {/* Marquee */}
      <section className="border-y border-white/5 py-5">
        <div className="flex overflow-hidden">
          <div className="flex shrink-0 animate-[marquee_30s_linear_infinite] gap-10 whitespace-nowrap px-5 text-sm text-neutral-500">
            {Array.from({ length: 2 }).map((_, i) => (
              <span key={i} className="flex gap-10">
                <span>Next.js 15</span><span>✦</span>
                <span>React 19</span><span>✦</span>
                <span>TypeScript strict</span><span>✦</span>
                <span>Tailwind v4</span><span>✦</span>
                <span>WebAssembly</span><span>✦</span>
                <span>Privacy-first</span><span>✦</span>
                <span>No upload</span><span>✦</span>
                <span>Open source</span><span>✦</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="text-sm font-medium text-indigo-400">Features</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need, nothing you don't.
            </h2>
          </div>
          <Link href="/studio" className="hidden text-sm text-neutral-400 hover:text-white sm:block">
            Open studio →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.t}
              className="group rounded-2xl border border-white/8 bg-white/[0.02] p-6 transition hover:border-white/15 hover:bg-white/[0.04]"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/20 text-indigo-300">
                <span className="text-lg">✦</span>
              </div>
              <h3 className="font-semibold">{f.t}</h3>
              <p className="mt-2 text-sm text-neutral-400">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-t border-white/5 bg-white/[0.01]">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <p className="text-sm font-medium text-indigo-400">Workflow</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Three steps. Zero friction.</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="rounded-2xl border border-white/8 bg-white/[0.02] p-8">
                <div className="text-5xl font-bold text-white/10">{s.n}</div>
                <h3 className="mt-4 text-xl font-semibold">{s.t}</h3>
                <p className="mt-2 text-sm text-neutral-400">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy */}
      <section className="mx-auto max-w-5xl px-6 py-24 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Privacy by design.</h2>
        <p className="mx-auto mt-4 max-w-2xl text-neutral-400">
          Cutout Studio processes images entirely in your browser using WebAssembly. We never see your
          photos. No account required. No data collected.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            href="/studio"
            className="rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black hover:bg-neutral-200"
          >
            Try it free →
          </Link>
        </div>
      </section>

      {/* Contact */}
      <section className="border-t border-white/5">
        <div className="mx-auto max-w-5xl px-6 py-24 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Get in touch.</h2>
          <p className="mx-auto mt-3 max-w-2xl text-neutral-400">
            Questions, feedback, or want a custom feature? Reach out anytime.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="https://x.com/Himansh95861047"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/5"
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
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/5"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 .5C5.37.5 0 5.78 0 12.292c0 5.211 3.438 9.63 8.207 11.188.6.109.82-.254.82-.567 0-.28-.01-1.022-.015-2.005-3.338.711-4.042-1.582-4.042-1.582-.546-1.361-1.333-1.725-1.333-1.725-1.089-.731.084-.716.084-.716 1.205.082 1.838 1.215 1.838 1.215 1.07 1.803 2.809 1.282 3.495.981.108-.763.417-1.282.76-1.577-2.665-.295-5.466-1.309-5.466-5.827 0-1.287.465-2.339 1.235-3.164-.135-.298-.54-1.497.105-3.121 0 0 1.005-.316 3.3 1.209.96-.262 1.98-.392 3-.398 1.02.006 2.04.136 3 .398 2.28-1.525 3.285-1.209 3.285-1.209.645 1.624.24 2.823.12 3.121.76.825 1.23 1.877 1.23 3.164 0 4.53-2.805 5.527-5.475 5.817.42.354.81 1.077.81 2.182 0 1.578-.015 2.846-.015 3.229 0 .315.21.685.825.568C20.565 21.917 24 17.5 24 12.292 24 5.78 18.627.5 12 .5z" />
              </svg>
              GitHub
            </a>
            <a
              href="mailto:himanshu5179abcd@gmail.com"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/5"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              Email
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-xs text-neutral-500 sm:flex-row">
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icon.svg" alt="" className="h-4 w-4" />
            <span>Cutout Studio · Free & open source</span>
          </div>
          <div className="flex gap-5">
            <a href="https://x.com/Himansh95861047" target="_blank" rel="noopener noreferrer" className="hover:text-white">X</a>
            <a href="https://github.com/himanshu0072510/cutout-studio" target="_blank" rel="noopener noreferrer" className="hover:text-white">GitHub</a>
            <a href="mailto:himanshu5179abcd@gmail.com" className="hover:text-white">Email</a>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </main>
  );
}
