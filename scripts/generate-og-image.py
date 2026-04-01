"""Generate public/og-image.png (1200×630) for Open Graph — favicon star + palette on a wide banner."""
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


def star_poly(cx: float, cy: float, s: float) -> list[tuple[float, float]]:
    """Same nodal points as favicon.svg; s matches (size/64) in the favicon generator."""
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
    return [((px - 32) * s + cx, (py - 32) * s + cy) for px, py in pts]


def raster_og(w: int, h: int) -> list[tuple[int, int, int, int]]:
    # Large star, left third (title is shown separately in og:title)
    s = min(w, h) * (6.8 / 630)
    cx, cy = w * 0.22, h * 0.5
    poly = star_poly(cx, cy, s)
    r_center = 4.5 * s
    r_halo = 21 * s

    dark = (10, 10, 10, 255)
    dark2 = (20, 20, 20, 255)
    gold = (201, 168, 76, 255)
    gold_light = (244, 230, 182, 255)
    gold_soft = (201, 168, 76, int(255 * 0.14))

    border = 4

    pixels: list[tuple[int, int, int, int]] = []
    for y in range(h):
        for x in range(w):
            fx, fy = x + 0.5, y + 0.5
            dist_c = ((fx - cx) ** 2 + (fy - cy) ** 2) ** 0.5
            # Vignette toward bottom-right (room for text feel)
            gx, gy = w * 0.72, h * 0.48
            dist_g = ((fx - gx) ** 2 + (fy - gy) ** 2) ** 0.5
            max_g = (w**2 + h**2) ** 0.5
            t = min(1.0, dist_g / (max_g * 0.42))
            r0 = int(dark[0] + (dark2[0] - dark[0]) * t)
            g0 = int(dark[1] + (dark2[1] - dark[1]) * t)
            b0 = int(dark[2] + (dark2[2] - dark[2]) * t)
            rgba = (r0, g0, b0, 255)

            if dist_c < r_halo:
                blend = 1.0 - dist_c / r_halo
                rgba = (
                    int(rgba[0] * (1 - blend * 0.2) + dark2[0] * (blend * 0.2)),
                    int(rgba[1] * (1 - blend * 0.2) + dark2[1] * (blend * 0.2)),
                    int(rgba[2] * (1 - blend * 0.2) + dark2[2] * (blend * 0.2)),
                    255,
                )

            if point_in_polygon(fx, fy, poly):
                rgba = gold_light if dist_c < r_center else gold
            elif abs(dist_c - r_halo) < s * 0.2:
                rg, gg, bg, ag = gold_soft
                r, g, b, _ = rgba
                a = ag / 255.0
                rgba = (
                    min(255, int(r * (1 - a) + rg * a)),
                    min(255, int(g * (1 - a) + gg * a)),
                    min(255, int(b * (1 - a) + bg * a)),
                    255,
                )

            if x < border or x >= w - border or y < border or y >= h - border:
                r, g, b, _ = rgba
                mr, mg, mb = gold[:3]
                rgba = (
                    min(255, (r + mr) // 2),
                    min(255, (g + mg) // 2),
                    min(255, (b + mb) // 2),
                    255,
                )

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


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    out = root / "public" / "og-image.png"
    w, h = 1200, 630
    write_png(out, w, h, raster_og(w, h))
    print(f"Wrote {out}")


if __name__ == "__main__":
    main()
