function escapeSvgText(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function buildPlaceholderPosterDataUrl(lines: string[]): string {
  const lineHeight = 30;
  const startY = 330 - ((lines.length - 1) * lineHeight) / 2;

  const textLines = lines
    .map(
      (line, index) =>
        `<text x="480" y="${startY + index * lineHeight}" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" fill="#a89a7d">${escapeSvgText(line)}</text>`,
    )
    .join("");

  const svg = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540" viewBox="0 0 960 540">',
    '<rect width="960" height="540" fill="#16130e" />',
    '<circle cx="480" cy="220" r="56" fill="none" stroke="#e8a33d" stroke-width="4" />',
    '<path d="M465 195 L465 245 L505 220 Z" fill="#e8a33d" />',
    textLines,
    "</svg>",
  ].join("");

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
