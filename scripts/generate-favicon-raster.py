"""Generate PNG + ICO favicons from the same geometry as public/favicon.svg (32px design)."""
from __future__ import annotations

import struct
import zlib
from pathlib import Path


def point_in_polygon(x: float, y: float, poly: list[tuple[float, float]]) -> bool:
    inside = False
    n = len(poly)
    for i in range(n):
        x1, y1 = poly[i]
        x2, y2 = poly[(i + 1) % n]
        if (y1 > y) != (y2 > y) and x < (x2 - x1) * (y - y1) / (y2 - y1 + 1e-9) + x1:
            inside = not inside
    return inside


def star_poly(cx: float, cy: float, scale: float) -> list[tuple[float, float]]:
    # From favicon.svg path, centered and scaled (original viewBox 64)
    pts = [
        (32, 10),
        (37.8, 26.2),
        (54, 32),
        (37.8, 37.8),
        (32, 54),
        (26.2, 37.8),
        (10, 32),
        (26.2, 26.2),
    ]
    return [((px - 32) * scale + cx, (py - 32) * scale + cy) for px, py in pts]


def rounded_rect_border(
    x: int, y: int, w: int, h: int, rx: int, border: int
) -> bool:
    """True if pixel is near the rounded-rect outline (crude, good enough at low res)."""
    if not (0 <= x < w and 0 <= y < h):
        return False
    # Inner rect excludes
    inner_l, inner_t = rx, rx
    inner_r, inner_b = w - rx, h - rx
    if inner_l < x < inner_r and border <= y < h - border:
        return False
    if inner_t < y < inner_b and border <= x < w - border:
        return False
    # Corner circles
    corners = [
        (rx, rx, rx),
        (w - rx - 1, rx, rx),
        (rx, h - rx - 1, rx),
        (w - rx - 1, h - rx - 1, rx),
    ]
    for cx, cy, r in corners:
        d = ((x - cx) ** 2 + (y - cy) ** 2) ** 0.5
        if abs(d - r) < border + 0.5:
            return True
    # Straight edges
    if y < border or y >= h - border:
        if border <= x < w - border:
            return True
    if x < border or x >= w - border:
        if border <= y < h - border:
            return True
    return False


def raster_favicon(size: int) -> list[tuple[int, int, int, int]]:
    w = h = size
    cx = cy = (size - 1) / 2
    scale = size / 64.0
    poly = star_poly(cx, cy, scale)
    r_center = 4.5 * scale
    r_halo = 21 * scale

    dark = (10, 10, 10, 255)
    dark2 = (20, 20, 20, 255)
    gold = (201, 168, 76, 255)
    gold_light = (244, 230, 182, 255)
    stroke = (201, 168, 76, int(255 * 0.5))

    rx = max(2, int(round(14 * scale)))
    border_w = max(1, int(round(scale)))

    pixels: list[tuple[int, int, int, int]] = []
    for y in range(h):
        for x in range(w):
            fx, fy = x + 0.5, y + 0.5
            dist_c = ((fx - cx) ** 2 + (fy - cy) ** 2) ** 0.5

            # Background: subtle radial (two tones)
            if dist_c < r_halo:
                bg = dark2
            else:
                bg = dark

            # Rounded panel like SVG rx=14
            in_panel = 0 <= x < w and 0 <= y < h
            if in_panel:
                # shrink: treat outer 1px as outside for rounding feel at small sizes
                pass

            rgba = bg
            if point_in_polygon(fx, fy, poly):
                rgba = gold_light if dist_c < r_center else gold
            elif rounded_rect_border(x, y, w, h, rx, border_w):
                rgba = stroke

            # Halo ring (very soft)
            if rgba == dark or rgba == dark2:
                if abs(dist_c - r_halo) < 1.2 * scale:
                    mix = int(255 * 0.1)
                    r, g, b, a = gold
                    rgba = (r, g, b, mix)

            pixels.append(rgba)
    return pixels


def write_png(path: Path, width: int, height: int, pixels: list[tuple[int, int, int, int]]) -> None:
    def chunk(tag: bytes, data: bytes) -> bytes:
        return struct.pack(">I", len(data)) + tag + data + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)

    raw = bytearray()
    i = 0
    for _y in range(height):
        raw.append(0)
        for _x in range(width):
            r, g, b, a = pixels[i]
            i += 1
            raw.extend((r, g, b, a))

    compressed = zlib.compress(bytes(raw), 9)
    ihdr = struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0)
    data = b"\x89PNG\r\n\x1a\n"
    data += chunk(b"IHDR", ihdr)
    data += chunk(b"IDAT", compressed)
    data += chunk(b"IEND", b"")
    path.write_bytes(data)


def scale_nn(
    src_w: int, src_h: int, src_px: list[tuple[int, int, int, int]], dw: int, dh: int
) -> list[tuple[int, int, int, int]]:
    out: list[tuple[int, int, int, int]] = []
    for y in range(dh):
        sy = int(y * src_h / dh)
        for x in range(dw):
            sx = int(x * src_w / dw)
            out.append(src_px[sy * src_w + sx])
    return out


def write_ico_png(path: Path, png_bytes: bytes) -> None:
    """Single embedded PNG image (Windows 10+)."""
    # ICONDIR: reserved(0), type(1), count(1)
    # ICONDIRENTRY: width, height, color_count(0), reserved(0), planes(1), bitcount(32), bytes_in_res, offset
    offset = 6 + 16
    w = h = 32
    header = struct.pack("<HHH", 0, 1, 1)
    entry = struct.pack("<BBBBHHII", w, h, 0, 0, 1, 32, len(png_bytes), offset)
    path.write_bytes(header + entry + png_bytes)


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    public = root / "public"

    px32 = raster_favicon(32)
    write_png(public / "favicon-32.png", 32, 32, px32)

    px180 = scale_nn(32, 32, px32, 180, 180)
    write_png(public / "apple-touch-icon.png", 180, 180, px180)

    png32_path = public / "favicon-32.png"
    write_ico_png(public / "favicon.ico", png32_path.read_bytes())

    print("Wrote public/favicon-32.png, public/apple-touch-icon.png, public/favicon.ico")


if __name__ == "__main__":
    main()
