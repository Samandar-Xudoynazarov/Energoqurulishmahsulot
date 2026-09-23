/**
 * Compresses an image file in the browser using canvas before upload.
 * Resizes to a max dimension and re-encodes as WebP at the given quality,
 * targeting roughly the given max size (best-effort, not guaranteed).
 */
/** Suv belgisi: markazda xira logo + pastida sayt nomi. Rasm fayliga "yopishtiriladi" — nusxa olinganda ham qoladi. */
async function drawWatermark(ctx: CanvasRenderingContext2D, width: number, height: number): Promise<boolean> {
  try {
    const res = await fetch('/watermark.webp');
    const logo = await createImageBitmap(await res.blob());
    const size = Math.round(Math.min(width, height) * 0.42);
    const x = (width - size) / 2;
    const y = (height - size) / 2 - size * 0.08;
    ctx.save();
    ctx.globalAlpha = 0.28;
    ctx.drawImage(logo, x, y, size, size);
    ctx.globalAlpha = 0.45;
    const fontSize = Math.max(14, Math.round(size * 0.085));
    ctx.font = `700 ${fontSize}px Inter, Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.lineWidth = Math.max(2, fontSize / 8);
    ctx.strokeStyle = 'rgba(0,0,0,0.35)';
    ctx.fillStyle = '#ffffff';
    const text = 'ENERGOQURILISHMAHSULOT';
    const ty = y + size + fontSize * 0.5;
    ctx.strokeText(text, width / 2, ty);
    ctx.fillText(text, width / 2, ty);
    ctx.restore();
    return true;
  } catch {
    return false;
  }
}

export async function compressImage(
  file: File,
  { maxDimension = 1600, quality = 0.82, targetMaxBytes = 700 * 1024, watermark = true }: {
    maxDimension?: number;
    quality?: number;
    targetMaxBytes?: number;
    watermark?: boolean;
  } = {}
): Promise<File> {
  if (!file.type.startsWith('image/')) return file;

  const imageBitmap = await createImageBitmap(file);
  let { width, height } = imageBitmap;

  if (width > maxDimension || height > maxDimension) {
    const scale = maxDimension / Math.max(width, height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return file;
  ctx.drawImage(imageBitmap, 0, 0, width, height);
  const marked = watermark ? await drawWatermark(ctx, width, height) : false;

  let currentQuality = quality;
  let blob: Blob | null = await new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b), 'image/webp', currentQuality)
  );

  // Best-effort: step quality down if still too large
  let attempts = 0;
  while (blob && blob.size > targetMaxBytes && currentQuality > 0.4 && attempts < 5) {
    currentQuality -= 0.1;
    blob = await new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b), 'image/webp', currentQuality)
    );
    attempts++;
  }

  if (!blob) return file;

  // "-wm" — saytga bu rasmda suv belgisi borligini bildiradi (ustiga ikkinchi logo qo'yilmaydi)
  const newName = file.name.replace(/\.[^.]+$/, '') + (marked ? '-wm' : '') + '.webp';
  return new File([blob], newName, { type: 'image/webp' });
}
