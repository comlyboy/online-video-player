function escapeSvgText(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function buildPlaceholderPosterDataUrl(lines: string[]): string {
  const lineHeight = 30;
  const startY = 330 - ((lines.length - 1) * lineHeight) / 2;

  const textLines = lines
    .map(
      (line, index) =>
        `<text x="480" y="${startY + index * lineHeight}" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" fill="#94a3b8">${escapeSvgText(line)}</text>`,
    )
    .join("");

  const svg = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540" viewBox="0 0 960 540">',
    '<rect width="960" height="540" fill="#0f172a" />',
    '<circle cx="480" cy="220" r="56" fill="none" stroke="#22d3ee" stroke-width="4" />',
    '<path d="M465 195 L465 245 L505 220 Z" fill="#22d3ee" />',
    textLines,
    "</svg>",
  ].join("");

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
