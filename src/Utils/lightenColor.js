export function lightenColor(hex, percent) {
  hex = hex.replace(/^#/, "");

  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }

  const num = parseInt(hex, 16);
  const r = Math.min(255, (num >> 16) + (255 - (num >> 16)) * percent);
  const g = Math.min(
    255,
    ((num >> 8) & 0x00ff) + (255 - ((num >> 8) & 0x00ff)) * percent,
  );
  const b = Math.min(
    255,
    (num & 0x0000ff) + (255 - (num & 0x0000ff)) * percent,
  );

  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}
