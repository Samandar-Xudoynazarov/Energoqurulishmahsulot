/**
 * Compresses an image file in the browser using canvas before upload.
 * Resizes to a max dimension and re-encodes as WebP at the given quality,
 * targeting roughly the given max size (best-effort, not guaranteed).
 */
export async function compressImage(
  file: File,
  { maxDimension = 1600, quality = 0.82, targetMaxBytes = 700 * 1024 }: {
    maxDimension?: number;
    quality?: number;
    targetMaxBytes?: number;
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

  const newName = file.name.replace(/\.[^.]+$/, '') + '.webp';
  return new File([blob], newName, { type: 'image/webp' });
}
