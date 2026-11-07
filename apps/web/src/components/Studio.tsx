"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Upload,
  Download,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Scissors,
  Sparkles,
  SlidersHorizontal,
  Crop,
  Trash2,
  Loader2,
  Check,
} from "lucide-react";

type BgMode = "transparent" | "color" | "gradient" | "blur" | "image";
type ExportFormat = "png" | "jpeg" | "webp";

interface Adjustments {
  brightness: number; // 0..200, 100 = normal
  contrast: number;
  saturation: number;
  temperature: number;
}

const DEFAULT_ADJ: Adjustments = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  temperature: 0,
};

const ASPECT_PRESETS: { label: string; value: number | null }[] = [
  { label: "Free", value: null },
  { label: "1:1", value: 1 },
  { label: "4:3", value: 4 / 3 },
  { label: "16:9", value: 16 / 9 },
  { label: "3:4", value: 3 / 4 },
  { label: "9:16", value: 9 / 16 },
];

const EXPORT_SIZES: { label: string; w: number; h: number }[] = [
  { label: "Original", w: 0, h: 0 },
  { label: "1080×1080", w: 1080, h: 1080 },
  { label: "1080×1350", w: 1080, h: 1350 },
  { label: "1920×1080", w: 1920, h: 1080 },
  { label: "800×800", w: 800, h: 800 },
];

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = src;
  });
}

function fileToUrl(file: File): string {
  return URL.createObjectURL(file);
}

export function Studio() {
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [cutoutUrl, setCutoutUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const [bgMode, setBgMode] = useState<BgMode>("transparent");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [gradientFrom, setGradientFrom] = useState("#6366f1");
  const [gradientTo, setGradientTo] = useState("#ec4899");
  const [blurAmount, setBlurAmount] = useState(12);
  const [bgImageUrl, setBgImageUrl] = useState<string | null>(null);

  const [adj, setAdj] = useState<Adjustments>(DEFAULT_ADJ);
  const [rotation, setRotation] = useState(0); // 0,90,180,270
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);

  const [aspect, setAspect] = useState<number | null>(null);
  const [exportSize, setExportSize] = useState(0);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("png");

  const [dragOver, setDragOver] = useState(false);
  const [comparePos, setComparePos] = useState(50);
  const [showCompare, setShowCompare] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const originalImgRef = useRef<HTMLImageElement | null>(null);
  const cutoutImgRef = useRef<HTMLImageElement | null>(null);
  const bgImgRef = useRef<HTMLImageElement | null>(null);

  // Load images into refs whenever urls change
  useEffect(() => {
    if (!originalUrl) {
      originalImgRef.current = null;
      return;
    }
    loadImage(originalUrl).then((img) => {
      originalImgRef.current = img;
    });
  }, [originalUrl]);

  useEffect(() => {
    if (!cutoutUrl) {
      cutoutImgRef.current = null;
      return;
    }
    loadImage(cutoutUrl).then((img) => {
      cutoutImgRef.current = img;
    });
  }, [cutoutUrl]);

  useEffect(() => {
    if (!bgImageUrl) {
      bgImgRef.current = null;
      return;
    }
    loadImage(bgImageUrl).then((img) => {
      bgImgRef.current = img;
    });
  }, [bgImageUrl]);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    setError(null);
    setCutoutUrl(null);
    setBgMode("transparent");
    setAdj(DEFAULT_ADJ);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    const url = fileToUrl(file);
    setOriginalUrl(url);
    setStatus("Image loaded. Click “Remove background” to cut out the subject.");
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const f = e.dataTransfer.files?.[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  const removeBg = useCallback(async () => {
    if (!originalUrl) return;
    setBusy(true);
    setProgress(0);
    setError(null);
    setStatus("Loading model & removing background…");
    try {
      const { removeBackground } = await import("@imgly/background-removal");
      const res = await fetch(originalUrl);
      const blob = await res.blob();
      const out: Blob = await removeBackground(blob, {
        progress: (_key: string, current: number, total: number) => {
          if (total > 0) setProgress(Math.round((current / total) * 100));
        },
        output: { format: "image/png", quality: 1 },
      });
      const url = URL.createObjectURL(out);
      setCutoutUrl(url);
      setBgMode("transparent");
      setStatus("Background removed. Adjust, replace, or export.");
    } catch (e) {
      console.error(e);
      setError(
        "Background removal failed. Try a smaller image, or a different browser. " +
          (e instanceof Error ? e.message : "")
      );
      setStatus("");
    } finally {
      setBusy(false);
      setProgress(0);
    }
  }, [originalUrl]);

  const clearAll = useCallback(() => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (cutoutUrl) URL.revokeObjectURL(cutoutUrl);
    if (bgImageUrl) URL.revokeObjectURL(bgImageUrl);
    setOriginalUrl(null);
    setCutoutUrl(null);
    setBgImageUrl(null);
    setBgMode("transparent");
    setAdj(DEFAULT_ADJ);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setStatus("");
    setError(null);
  }, [originalUrl, cutoutUrl, bgImageUrl]);

  // Render to canvas for export (and preview sizing)
  const renderToCanvas = useCallback(
    async (canvas: HTMLCanvasElement) => {
      const subject = cutoutUrl ? cutoutImgRef.current : originalImgRef.current;
      if (!subject) return false;

      // determine source dimensions
      let srcW = subject.naturalWidth;
      let srcH = subject.naturalHeight;

      // crop to aspect ratio (center crop)
      let cropW = srcW;
      let cropH = srcH;
      if (aspect) {
        const srcAspect = srcW / srcH;
        if (srcAspect > aspect) {
          cropW = Math.round(srcH * aspect);
          cropH = srcH;
        } else {
          cropW = srcW;
          cropH = Math.round(srcW / aspect);
        }
      }
      const cropX = Math.round((srcW - cropW) / 2);
      const cropY = Math.round((srcH - cropH) / 2);

      // rotation handling: swap dimensions for 90/270
      const rotated = rotation === 90 || rotation === 270;
      const baseW = rotated ? cropH : cropW;
      const baseH = rotated ? cropW : cropH;

      // export size
      let outW = baseW;
      let outH = baseH;
      const sizeIdx = exportSize;
      const chosenSize = EXPORT_SIZES[sizeIdx] ?? EXPORT_SIZES[0]!;
      if (chosenSize!.w > 0) {
        outW = chosenSize!.w;
        outH = chosenSize!.h;
        // fit aspect
        const targetAspect = outW / outH;
        const srcA = baseW / baseH;
        if (srcA > targetAspect) {
          outH = Math.round(outW / srcA);
        } else {
          outW = Math.round(outH * srcA);
        }
      }

      canvas.width = outW;
      canvas.height = outH;
      const ctx = canvas.getContext("2d");
      if (!ctx) return false;

      // background layer
      ctx.save();
      if (bgMode === "color") {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, outW, outH);
      } else if (bgMode === "gradient") {
        const g = ctx.createLinearGradient(0, 0, outW, outH);
        g.addColorStop(0, gradientFrom);
        g.addColorStop(1, gradientTo);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, outW, outH);
      } else if (bgMode === "blur" && originalImgRef.current) {
        // draw original blurred as background
        ctx.filter = `blur(${blurAmount}px)`;
        ctx.drawImage(originalImgRef.current, 0, 0, outW, outH);
        ctx.filter = "none";
      } else if (bgMode === "image" && bgImgRef.current) {
        // cover
        const bi = bgImgRef.current;
        const ba = bi.naturalWidth / bi.naturalHeight;
        const ta = outW / outH;
        let dw = outW,
          dh = outH,
          dx = 0,
          dy = 0;
        if (ba > ta) {
          dh = outH;
          dw = Math.round(outH * ba);
          dx = Math.round((outW - dw) / 2);
        } else {
          dw = outW;
          dh = Math.round(outW / ba);
          dy = Math.round((outH - dh) / 2);
        }
        ctx.drawImage(bi, dx, dy, dw, dh);
      } else {
        // transparent: for jpeg, fill white
        if (exportFormat === "jpeg") {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, outW, outH);
        }
      }

      // subject draw with transforms + filters + crop
      ctx.filter = `brightness(${adj.brightness}%) contrast(${adj.contrast}%) saturate(${adj.saturation}%) hue-rotate(${adj.temperature}deg)`;
      ctx.save();
      // map to output coordinates with rotation/flip
      const cx = outW / 2;
      const cy = outH / 2;
      ctx.translate(cx, cy);
      ctx.rotate((rotation * Math.PI) / 180);
      if (flipH) ctx.scale(-1, 1);
      if (flipV) ctx.scale(1, -1);
      // scale from crop size to output size
      const scaleX = outW / baseW;
      const scaleY = outH / baseH;
      // when rotated, baseW/baseH swapped; handle by scaling uniformly
      const s = Math.min(scaleX, scaleY);
      ctx.scale(s, s);
      // draw the cropped region centered
      ctx.drawImage(
        subject,
        cropX,
        cropY,
        cropW,
        cropH,
        -cropW / 2,
        -cropH / 2,
        cropW,
        cropH
      );
      ctx.restore();
      ctx.restore();
      return true;
    },
    [
      cutoutUrl,
      originalUrl,
      bgMode,
      bgColor,
      gradientFrom,
      gradientTo,
      blurAmount,
      bgImageUrl,
      adj,
      rotation,
      flipH,
      flipV,
      aspect,
      exportSize,
      exportFormat,
    ]
  );

  // live preview via CSS is handled in JSX; canvas used for export only.
  // But we also render a preview canvas for accuracy? Use img+css for speed.

  const download = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ok = await renderToCanvas(canvas);
    if (!ok) {
      setError("Nothing to export yet.");
      return;
    }
    const mime =
      exportFormat === "jpeg"
        ? "image/jpeg"
        : exportFormat === "webp"
        ? "image/webp"
        : "image/png";
    const quality = exportFormat === "png" ? undefined : 0.92;
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setError("Export failed.");
          return;
        }
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `cutout-${Date.now()}.${exportFormat === "jpeg" ? "jpg" : exportFormat}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        setStatus("Exported.");
      },
      mime,
      quality
    );
  }, [renderToCanvas, exportFormat]);

  // preview CSS filter string
  const filterStyle = `brightness(${adj.brightness}%) contrast(${adj.contrast}%) saturate(${adj.saturation}%) hue-rotate(${adj.temperature}deg)`;
  const transformStyle = `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`;

  const subjectUrl = cutoutUrl ?? originalUrl;

  // Clipboard paste support
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const it of Array.from(items)) {
        if (it.type.startsWith("image/")) {
          const f = it.getAsFile();
          if (f) {
            handleFile(f);
            e.preventDefault();
            return;
          }
        }
      }
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [handleFile]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (!originalUrl) return;
      if (e.key === "r" || e.key === "R") setRotation((r) => (r + 90) % 360);
      if (e.key === "h" || e.key === "H") setFlipH((v) => !v);
      if (e.key === "v" || e.key === "V") setFlipV((v) => !v);
      if (e.key === "b" || e.key === "B") {
        if (!cutoutUrl && !busy) removeBg();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        download();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [originalUrl, cutoutUrl, busy, removeBg, download]);

  const copyToClipboard = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas || !subjectUrl) return;
    const ok = await renderToCanvas(canvas);
    if (!ok) return;
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      try {
        await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
        setCopied(true);
        setStatus("Copied to clipboard.");
        setTimeout(() => setCopied(false), 1800);
      } catch {
        setError("Clipboard not supported in this browser. Use Export instead.");
      }
    }, "image/png");
  }, [renderToCanvas, subjectUrl]);


  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white/80 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <a href="/" className="flex items-center gap-2 font-semibold">
            <span className="inline-block h-6 w-6 rounded-md bg-gradient-to-br from-indigo-500 to-fuchsia-500" />
            Cutout Studio
          </a>
          <div className="flex items-center gap-2">
            {subjectUrl && (
              <button
                onClick={clearAll}
                className="inline-flex items-center gap-1 rounded-lg border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
              >
                <Trash2 className="h-4 w-4" /> Reset
              </button>
            )}
            <button
              onClick={copyToClipboard}
              disabled={!subjectUrl || busy}
              className="inline-flex items-center gap-1 rounded-lg border border-neutral-300 px-3 py-1.5 text-sm font-medium hover:bg-neutral-100 disabled:opacity-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
            >
              {copied ? <Check className="h-4 w-4" /> : <Download className="h-4 w-4" />} {copied ? "Copied" : "Copy"}
            </button>
            <button
              onClick={download}
              disabled={!subjectUrl || busy}
              className="inline-flex items-center gap-1 rounded-lg bg-indigo-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-600 disabled:opacity-50"
            >
              <Download className="h-4 w-4" /> Export
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        {!originalUrl ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed p-16 text-center transition ${
              dragOver
                ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30"
                : "border-neutral-300 hover:border-neutral-400 dark:border-neutral-700"
            }`}
          >
            <Upload className="h-12 w-12 text-neutral-400" />
            <h2 className="mt-4 text-xl font-semibold">Drop an image here</h2>
            <p className="mt-1 text-sm text-neutral-500">or click to browse · PNG, JPG, WebP</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
                e.target.value = "";
              }}
            />
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            {/* Preview */}
            <div className="flex flex-col gap-3">
              <div
                className="relative flex min-h-[420px] items-center justify-center overflow-hidden rounded-2xl border border-neutral-200 bg-[linear-gradient(45deg,#e5e5e5_25%,transparent_25%),linear-gradient(-45deg,#e5e5e5_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#e5e5e5_75%),linear-gradient(-45deg,transparent_75%,#e5e5e5_75%)] bg-[length:16px_16px] bg-[position:0_0,0_8px,8px_-8px,-8px_0] dark:border-neutral-800 dark:bg-neutral-900"
                style={{ backgroundSize: "16px 16px" }}
              >
                {showCompare && originalUrl && cutoutUrl ? (
                  <div className="relative h-full w-full">
                    {/* after (result) full */}
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={
                        bgMode !== "transparent"
                          ? bgMode === "color"
                            ? { background: bgColor }
                            : bgMode === "gradient"
                            ? { background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` }
                            : undefined
                          : undefined
                      }
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={cutoutUrl}
                        alt="after"
                        className="max-h-[70vh] max-w-full object-contain"
                        style={{ filter: filterStyle, transform: transformStyle }}
                      />
                    </div>
                    {/* before (original) clipped */}
                    <div
                      className="absolute inset-0 flex items-center justify-center overflow-hidden"
                      style={{ width: `${comparePos}%` }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={originalUrl}
                        alt="before"
                        className="max-h-[70vh] max-w-full object-contain"
                        style={{ filter: "none", transform: "none" }}
                      />
                    </div>
                    {/* divider */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg"
                      style={{ left: `${comparePos}%` }}
                    />
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={comparePos}
                      onChange={(e) => setComparePos(Number(e.target.value))}
                      className="absolute bottom-4 left-1/2 w-2/3 -translate-x-1/2"
                    />
                    <span className="absolute left-4 top-4 rounded bg-black/60 px-2 py-1 text-xs font-semibold text-white">
                      BEFORE
                    </span>
                    <span className="absolute right-4 top-4 rounded bg-black/60 px-2 py-1 text-xs font-semibold text-white">
                      AFTER
                    </span>
                  </div>
                ) : (
                  <>
                {/* background layer for non-transparent modes */}
                {bgMode !== "transparent" && (
                  <div
                    className="absolute inset-0"
                    style={
                      bgMode === "color"
                        ? { background: bgColor }
                        : bgMode === "gradient"
                        ? { background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` }
                        : bgMode === "blur"
                        ? {
                            backgroundImage: `url(${originalUrl})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            filter: `blur(${blurAmount}px)`,
                            transform: "scale(1.1)",
                          }
                        : bgImageUrl
                        ? {
                            backgroundImage: `url(${bgImageUrl})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }
                        : undefined
                    }
                  />
                )}
                {subjectUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={subjectUrl}
                    alt="preview"
                    className="relative max-h-[70vh] max-w-full object-contain"
                    style={{ filter: filterStyle, transform: transformStyle }}
                  />
                )}
                  </>
                )}
                {busy && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/40 text-white">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <div className="text-sm font-medium">
                      {status || "Working…"} {progress > 0 ? `${progress}%` : ""}
                    </div>
                    {progress > 0 && (
                      <div className="h-1.5 w-48 overflow-hidden rounded-full bg-white/30">
                        <div
                          className="h-full bg-white transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {error && (
                <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
                  {error}
                </div>
              )}
              {status && !busy && (
                <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <Check className="h-4 w-4 text-green-500" /> {status}
                </div>
              )}

              {/* BG remove button */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setShowCompare((v) => !v)}
                  disabled={!cutoutUrl || busy}
                  className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium disabled:opacity-50 ${
                    showCompare
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300"
                      : "border-neutral-300 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
                  }`}
                >
                  Before / After
                </button>
                <button
                  onClick={removeBg}
                  disabled={busy || !originalUrl || !!cutoutUrl}
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-600 disabled:opacity-50"
                >
                  <Scissors className="h-4 w-4" />
                  {cutoutUrl ? "Background removed" : "Remove background"}
                </button>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800">
                  <Upload className="h-4 w-4" /> Replace image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleFile(f);
                      e.target.value = "";
                    }}
                  />
                </label>
              </div>
            </div>

            {/* Sidebar controls */}
            <aside className="space-y-5 rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
              {/* Background */}
              <section>
                <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                  <Sparkles className="h-4 w-4" /> Background
                </h3>
                <div className="grid grid-cols-3 gap-1.5">
                  {(
                    [
                      ["transparent", "Transparent"],
                      ["color", "Color"],
                      ["gradient", "Gradient"],
                      ["blur", "Blur"],
                      ["image", "Image"],
                    ] as [BgMode, string][]
                  ).map(([m, label]) => (
                    <button
                      key={m}
                      onClick={() => setBgMode(m)}
                      className={`rounded-lg border px-2 py-1.5 text-xs font-medium ${
                        bgMode === m
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300"
                          : "border-neutral-200 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                {bgMode === "color" && (
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="mt-2 h-9 w-full cursor-pointer rounded-lg border border-neutral-200 dark:border-neutral-700"
                  />
                )}
                {bgMode === "gradient" && (
                  <div className="mt-2 flex gap-2">
                    <input
                      type="color"
                      value={gradientFrom}
                      onChange={(e) => setGradientFrom(e.target.value)}
                      className="h-9 flex-1 cursor-pointer rounded-lg border border-neutral-200 dark:border-neutral-700"
                    />
                    <input
                      type="color"
                      value={gradientTo}
                      onChange={(e) => setGradientTo(e.target.value)}
                      className="h-9 flex-1 cursor-pointer rounded-lg border border-neutral-200 dark:border-neutral-700"
                    />
                  </div>
                )}
                {bgMode === "blur" && (
                  <div className="mt-2">
                    <label className="text-xs text-neutral-500">Blur: {blurAmount}px</label>
                    <input
                      type="range"
                      min={2}
                      max={40}
                      value={blurAmount}
                      onChange={(e) => setBlurAmount(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                )}
                {bgMode === "image" && (
                  <div className="mt-2">
                    <button
                      onClick={() => bgInputRef.current?.click()}
                      className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-xs hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                    >
                      Choose background image
                    </button>
                    <input
                      ref={bgInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) {
                          if (bgImageUrl) URL.revokeObjectURL(bgImageUrl);
                          setBgImageUrl(fileToUrl(f));
                        }
                        e.target.value = "";
                      }}
                    />
                  </div>
                )}
              </section>

              {/* Adjustments */}
              <section>
                <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                  <SlidersHorizontal className="h-4 w-4" /> Adjustments
                </h3>
                {(
                  [
                    ["brightness", "Brightness"],
                    ["contrast", "Contrast"],
                    ["saturation", "Saturation"],
                  ] as const
                ).map(([key, label]) => (
                  <div key={key} className="mb-2">
                    <div className="flex justify-between text-xs text-neutral-500">
                      <span>{label}</span>
                      <span>{adj[key]}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={200}
                      value={adj[key]}
                      onChange={(e) =>
                        setAdj((a) => ({ ...a, [key]: Number(e.target.value) }))
                      }
                      className="w-full"
                    />
                  </div>
                ))}
                <div className="mb-2">
                  <div className="flex justify-between text-xs text-neutral-500">
                    <span>Temperature</span>
                    <span>{adj.temperature}</span>
                  </div>
                  <input
                    type="range"
                    min={-90}
                    max={90}
                    value={adj.temperature}
                    onChange={(e) =>
                      setAdj((a) => ({ ...a, temperature: Number(e.target.value) }))
                    }
                    className="w-full"
                  />
                </div>
                <button
                  onClick={() => setAdj(DEFAULT_ADJ)}
                  className="text-xs text-indigo-500 hover:underline"
                >
                  Reset adjustments
                </button>
              </section>

              {/* Transform */}
              <section>
                <h3 className="mb-2 text-sm font-semibold">Transform</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setRotation((r) => (r + 90) % 360)}
                    className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-neutral-200 px-2 py-2 text-xs hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                  >
                    <RotateCw className="h-4 w-4" /> Rotate
                  </button>
                  <button
                    onClick={() => setFlipH((v) => !v)}
                    className={`inline-flex flex-1 items-center justify-center gap-1 rounded-lg border px-2 py-2 text-xs ${
                      flipH
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40"
                        : "border-neutral-200 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                    }`}
                  >
                    <FlipHorizontal className="h-4 w-4" /> Flip H
                  </button>
                  <button
                    onClick={() => setFlipV((v) => !v)}
                    className={`inline-flex flex-1 items-center justify-center gap-1 rounded-lg border px-2 py-2 text-xs ${
                      flipV
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40"
                        : "border-neutral-200 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                    }`}
                  >
                    <FlipVertical className="h-4 w-4" /> Flip V
                  </button>
                </div>
              </section>

              {/* Crop aspect */}
              <section>
                <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                  <Crop className="h-4 w-4" /> Crop ratio
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {ASPECT_PRESETS.map((p) => (
                    <button
                      key={p.label}
                      onClick={() => setAspect(p.value)}
                      className={`rounded-lg border px-2.5 py-1 text-xs ${
                        aspect === p.value
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300"
                          : "border-neutral-200 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
                <p className="mt-1 text-xs text-neutral-500">
                  Center-crops to the chosen ratio on export.
                </p>
              </section>

              {/* Export */}
              <section>
                <h3 className="mb-2 text-sm font-semibold">Export</h3>
                <div className="space-y-2">
                  <div>
                    <label className="text-xs text-neutral-500">Format</label>
                    <select
                      value={exportFormat}
                      onChange={(e) => setExportFormat(e.target.value as ExportFormat)}
                      className="mt-1 w-full rounded-lg border border-neutral-200 bg-white px-2 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                    >
                      <option value="png">PNG</option>
                      <option value="jpeg">JPEG</option>
                      <option value="webp">WebP</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-neutral-500">Size</label>
                    <select
                      value={exportSize}
                      onChange={(e) => setExportSize(Number(e.target.value))}
                      className="mt-1 w-full rounded-lg border border-neutral-200 bg-white px-2 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                    >
                      {EXPORT_SIZES.map((s, i) => (
                        <option key={s.label} value={i}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>
            </aside>
          </div>
        )}
      </main>

      <footer className="border-t border-neutral-200 px-4 py-6 text-center text-xs text-neutral-500 dark:border-neutral-800">
        Built by Himanshu ·{" "}
        <a href="https://x.com/Himansh95861047" target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:underline">
          X
        </a>{" · "}
        <a href="https://github.com/himanshu0072510/cutout-studio" target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:underline">
          GitHub
        </a>{" · "}
        <a href="mailto:himanshu5179abcd@gmail.com" className="text-indigo-500 hover:underline">
          Email
        </a>
        <span className="mx-2 text-neutral-300 dark:text-neutral-700">·</span>
        <span>Shortcuts: R rotate · H flip H · V flip V · B remove bg · ⌘S export · paste image to load</span>
      </footer>

      {/* hidden canvas for export */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
