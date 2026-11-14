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
    textLines,
    "</svg>",
  ].join("");

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
