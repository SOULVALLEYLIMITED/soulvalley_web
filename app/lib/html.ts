import DOMPurify from "dompurify";

/** Sanitizes rich-text HTML (from RichTextEditor) before rendering with dangerouslySetInnerHTML. */
export function sanitizeHtml(html: string): string {
  if (typeof window === "undefined") return html;
  return DOMPurify.sanitize(html);
}

/** Strips HTML tags down to plain text, e.g. for building excerpts or counting words. */
export function stripHtml(html: string): string {
  if (typeof window === "undefined") return html.replace(/<[^>]*>/g, " ");
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

/** True if the rich-text HTML has no visible content (e.g. TipTap's empty "<p></p>"). */
export function isHtmlEmpty(html: string): boolean {
  return stripHtml(html).trim().length === 0;
}
