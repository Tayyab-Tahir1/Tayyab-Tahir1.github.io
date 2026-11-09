const escapeMap: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** Escape text, then allow **bold** as the only inline markup (used in result lines). */
export function inlineMarkup(text: string): string {
  const escaped = text.replace(/[&<>"']/g, (c) => escapeMap[c]);
  return escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

/** Remove **bold** markers for plain-text contexts such as meta descriptions. */
export function plain(text: string): string {
  return text.replace(/\*\*(.+?)\*\*/g, '$1');
}
