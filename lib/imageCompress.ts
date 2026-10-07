// Browser-side: shrink big photos before upload so they load fast and fit the 4 MB limit.
export async function compressImage(file: File, maxSide = 1800, quality = 0.86): Promise<File> {
  try {
    if (!file.type.startsWith('image/') || file.type === 'image/gif' || file.type === 'image/svg+xml') return file;
    const bmp = await createImageBitmap(file);
    const k = Math.min(1, maxSide / Math.max(bmp.width, bmp.height));
    if (k === 1 && file.size < 900 * 1024) { bmp.close?.(); return file; }
    const w = Math.round(bmp.width * k), h = Math.round(bmp.height * k);
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const ctx = c.getContext('2d'); if (!ctx) return file;
    ctx.drawImage(bmp, 0, 0, w, h); bmp.close?.();
    const blob: Blob | null = await new Promise((r) => c.toBlob(r, 'image/webp', quality));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.\w+$/, '') + '.webp', { type: 'image/webp' });
  } catch { return file; }
}
