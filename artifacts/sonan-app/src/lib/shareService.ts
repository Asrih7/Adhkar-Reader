export interface SharePayload {
  title: string;
  text: string;
  url?: string;
}

export type SocialPlatform = "WhatsApp" | "Telegram" | "Facebook" | "Twitter" | "Instagram" | "TikTok";
export type ShareResult = "shared" | "copied" | "downloaded" | "cancelled";

export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    textarea.remove();
    return copied;
  } catch {
    return false;
  }
}

function wrapText(context: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(/\s+/)) {
    const candidate = `${line} ${word}`.trim();
    if (context.measureText(candidate).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export async function createShareCard(payload: SharePayload): Promise<File> {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1350;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas is unavailable");

  const isArabic = /[\u0600-\u06ff]/.test(payload.text);
  const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#0c2d2a");
  gradient.addColorStop(1, "#071a2d");
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = "#d4af37";
  context.lineWidth = 8;
  context.strokeRect(36, 36, canvas.width - 72, canvas.height - 72);
  context.textAlign = "center";
  context.direction = isArabic ? "rtl" : "ltr";
  context.fillStyle = "#f1d47b";
  context.font = "bold 56px Tajawal, Arial, sans-serif";
  context.fillText(payload.title, canvas.width / 2, 190);
  context.fillStyle = "#ffffff";
  context.font = "bold 48px Tajawal, Arial, sans-serif";
  const lines = wrapText(context, payload.text, 860);
  lines.slice(0, 9).forEach((line, index) => context.fillText(line, canvas.width / 2, 390 + index * 78));
  context.fillStyle = "#a7d7ce";
  context.font = "32px Tajawal, Arial, sans-serif";
  context.fillText("سنن ونصائح الرسول", canvas.width / 2, 1190);

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) throw new Error("Could not create share card");
  return new File([blob], "adhkar-share-card.png", { type: "image/png" });
}

async function downloadFile(file: File): Promise<void> {
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.download = file.name;
  link.href = url;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function shareContent(payload: SharePayload): Promise<ShareResult> {
  try {
    const card = await createShareCard(payload);
    if (navigator.share && navigator.canShare?.({ files: [card] })) {
      await navigator.share({ title: payload.title, text: payload.text, files: [card] });
      return "shared";
    }
    // Never fall back to a text-only or URL-only share: the requested artifact is the card image.
    await downloadFile(card);
    return "downloaded";
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") return "cancelled";
    return "cancelled";
  }
}

export async function openSocialShare(platform: SocialPlatform, payload: SharePayload): Promise<boolean> {
  try {
    const card = await createShareCard({ ...payload, title: `${payload.title} · ${platform}` });
    if (navigator.share && navigator.canShare?.({ files: [card] })) {
      await navigator.share({ title: payload.title, text: payload.text, files: [card] });
      return true;
    }
    await downloadFile(card);
    return true;
  } catch (error) {
    return !(error instanceof DOMException && error.name === "AbortError");
  }
}

export async function downloadShareCard(payload: SharePayload & { filename?: string }): Promise<void> {
  const file = await createShareCard(payload);
  const renamed = payload.filename ? new File([file], payload.filename, { type: file.type }) : file;
  await downloadFile(renamed);
}
