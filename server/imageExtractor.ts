import JSZip from "jszip";
import path from "path";
import zlib from "zlib";

interface ExtractedImage {
  mime: string;
  base64: string;
  dataUrl: string;
  width?: number;
  height?: number;
  size: number;
}

/**
 * Parses dimensions from JPEG SOF markers
 */
function getJpegDimensions(buf: Buffer): { width: number; height: number } | null {
  try {
    let pos = 2;
    while (pos < buf.length - 8) {
      if (buf[pos] !== 0xff) {
        pos++;
        continue;
      }
      const marker = buf[pos + 1];
      // Skip padding bytes
      if (marker === 0xff || marker === 0x00) {
        pos++;
        continue;
      }
      // EOI or SOS marker indicates end of header
      if (marker === 0xd9 || marker === 0xda) break;

      const length = buf.readUInt16BE(pos + 2);
      if (length < 2) break;

      // SOF0 (0xC0), SOF1 (0xC1), SOF2 (0xC2), SOF3 (0xC3)
      if (
        marker === 0xc0 ||
        marker === 0xc1 ||
        marker === 0xc2 ||
        marker === 0xc3 ||
        marker === 0xc9 ||
        marker === 0xca
      ) {
        const height = buf.readUInt16BE(pos + 5);
        const width = buf.readUInt16BE(pos + 7);
        return { width, height };
      }
      pos += 2 + length;
    }
  } catch (err) {
    // Ignore corrupt markers
  }
  return null;
}

/**
 * Extracts embedded JPEG images from a PDF buffer by scanning for SOI and EOI markers
 */
export function extractJpegsFromPdfBuffer(pdfBuf: Buffer): ExtractedImage[] {
  const images: ExtractedImage[] = [];
  const minSize = 2500; // 2.5KB to filter out icons / tiny dots
  const maxSize = 20 * 1024 * 1024; // 20MB limit

  let searchIndex = 0;
  while (searchIndex < pdfBuf.length - 4) {
    // Look for JPEG SOI: 0xFF, 0xD8, 0xFF
    const soiIndex = pdfBuf.indexOf(Buffer.from([0xff, 0xd8, 0xff]), searchIndex);
    if (soiIndex === -1) break;

    // Look for corresponding JPEG EOI: 0xFF, 0xD9
    let eoiIndex = pdfBuf.indexOf(Buffer.from([0xff, 0xd9]), soiIndex + 3);
    if (eoiIndex === -1) {
      searchIndex = soiIndex + 3;
      continue;
    }

    // Check for next EOI in case of embedded thumbnails or markers
    const candidateBuf = pdfBuf.subarray(soiIndex, eoiIndex + 2);

    if (candidateBuf.length >= minSize && candidateBuf.length <= maxSize) {
      const dims = getJpegDimensions(candidateBuf);
      // Valid JPEG check: either parsed dimensions or has standard JFIF/Exif header
      const isLikelyJpeg =
        dims !== null ||
        candidateBuf.subarray(0, 10).includes(Buffer.from("JFIF")) ||
        candidateBuf.subarray(0, 10).includes(Buffer.from("Exif"));

      if (isLikelyJpeg) {
        const base64 = candidateBuf.toString("base64");
        const dataUrl = `data:image/jpeg;base64,${base64}`;
        images.push({
          mime: "image/jpeg",
          base64,
          dataUrl,
          width: dims?.width,
          height: dims?.height,
          size: candidateBuf.length,
        });
      }
    }

    searchIndex = eoiIndex + 2;
  }

  return images;
}

/**
 * Extracts embedded PNG/JPEG images from a DOCX buffer using JSZip
 */
export async function extractImagesFromDocxBuffer(docxBuf: Buffer): Promise<ExtractedImage[]> {
  const images: ExtractedImage[] = [];
  try {
    const zip = await JSZip.loadAsync(docxBuf);
    const mediaFolder = zip.folder("word/media");
    if (!mediaFolder) return [];

    for (const [filename, fileObj] of Object.entries(mediaFolder.files)) {
      if (!fileObj.dir) {
        const ext = path.extname(filename).toLowerCase().replace(".", "");
        let mime = "";
        if (ext === "png") mime = "image/png";
        else if (ext === "jpg" || ext === "jpeg") mime = "image/jpeg";
        else if (ext === "webp") mime = "image/webp";
        else if (ext === "gif") mime = "image/gif";

        if (mime) {
          const imgBuf = await fileObj.async("nodebuffer");
          // Ignore small decorative bullets or spacers (< 2KB)
          if (imgBuf.length > 2000) {
            let dims: { width: number; height: number } | null = null;
            if (mime === "image/jpeg") {
              dims = getJpegDimensions(imgBuf);
            }
            const base64 = imgBuf.toString("base64");
            images.push({
              mime,
              base64,
              dataUrl: `data:${mime};base64,${base64}`,
              size: imgBuf.length,
              width: dims?.width,
              height: dims?.height,
            });
          }
        }
      }
    }
  } catch (err) {
    console.warn("[imageExtractor] Error reading DOCX zip media:", err);
  }
  return images;
}

/**
 * Finds the most likely portrait / profile picture from a list of candidate images
 * - Prefers portrait or square aspect ratios (0.6 - 1.6)
 * - Prefers dimensions in typical avatar range (> 80px)
 * - Prefers reasonable file size
 */
export function selectBestProfilePhoto(candidates: ExtractedImage[]): string | null {
  if (!candidates || candidates.length === 0) return null;

  // Score candidate images
  const scored = candidates.map((img) => {
    let score = 10;

    if (img.width && img.height) {
      const ratio = img.width / img.height;
      // Headshots are typically near square or vertical 3:4 (0.65 to 1.35)
      if (ratio >= 0.65 && ratio <= 1.35) {
        score += 50;
      } else if (ratio >= 0.5 && ratio <= 1.8) {
        score += 20;
      } else {
        // Ultra-wide headers or banner lines get penalized
        score -= 40;
      }

      // Sufficient resolution for headshot
      if (img.width >= 100 && img.height >= 100) {
        score += 20;
      }
    }

    // Larger image size generally means higher detail photo rather than small icon
    if (img.size > 15000) {
      score += 25;
    } else if (img.size > 6000) {
      score += 15;
    }

    return { img, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0].img.dataUrl;
}

/**
 * Extracts a profile photo from an uploaded resume document (PDF or DOCX or Image)
 */
export async function extractResumePhoto(params: {
  fileBase64?: string;
  mimeType?: string;
  fileName?: string;
}): Promise<string | null> {
  const { fileBase64, mimeType, fileName } = params;
  if (!fileBase64) return null;

  try {
    const buffer = Buffer.from(fileBase64, "base64");
    const isPdf = mimeType === "application/pdf" || fileName?.toLowerCase().endsWith(".pdf");
    const isDocx =
      mimeType?.includes("word") ||
      mimeType?.includes("officedocument") ||
      fileName?.toLowerCase().endsWith(".docx");
    const isImage =
      mimeType?.startsWith("image/") ||
      /\.(png|jpe?g|webp)$/i.test(fileName || "");

    if (isPdf) {
      const pdfImages = extractJpegsFromPdfBuffer(buffer);
      if (pdfImages.length > 0) {
        const best = selectBestProfilePhoto(pdfImages);
        if (best) return best;
      }
    } else if (isDocx) {
      const docxImages = await extractImagesFromDocxBuffer(buffer);
      if (docxImages.length > 0) {
        const best = selectBestProfilePhoto(docxImages);
        if (best) return best;
      }
    } else if (isImage) {
      // If an image was uploaded as the file itself
      const ext = path.extname(fileName || "").toLowerCase().replace(".", "");
      let resolvedMime = mimeType || "image/jpeg";
      if (ext === "png") resolvedMime = "image/png";
      else if (ext === "webp") resolvedMime = "image/webp";
      return `data:${resolvedMime};base64,${fileBase64}`;
    }
  } catch (err) {
    console.warn("[imageExtractor] Failed to extract photo from resume document:", err);
  }

  return null;
}
