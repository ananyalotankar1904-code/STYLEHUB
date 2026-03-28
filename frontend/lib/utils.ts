/**
 * Compresses an image to fit within the typical 1MB payload limits of free tier backends.
 */
export async function compressImage(base64: string, maxWidth = 800, quality = 0.6): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      // Scale down if too wide
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("Canvas context error");
      
      ctx.drawImage(img, 0, 0, width, height);
      
      // Export as a smaller JPEG
      const result = canvas.toDataURL("image/jpeg", quality);
      resolve(result);
    };
    img.onerror = (err) => reject(err);
  });
}
