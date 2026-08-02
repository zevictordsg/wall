"""
Gera imagens placeholder (vermelho/preto) para o AuraPapers.
Roda uma unica vez para popular /public/wallpapers com JPGs de exemplo,
que devem ser substituidos pelas artes reais depois (mesmo nome de arquivo).
"""
import math
import os
import random

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

random.seed(7)

BASE = os.path.join(os.path.dirname(__file__), "..", "public", "wallpapers")
os.makedirs(BASE, exist_ok=True)

# Paleta vermelho / preto
DARK = (8, 6, 6)
DARK2 = (18, 10, 10)
RED_DEEP = (61, 9, 16)
RED_MID = (127, 17, 32)
RED_BRIGHT = (200, 30, 46)
RED_LIGHT = (224, 69, 74)


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def diagonal_gradient(w, h, c1, c2, angle_deg=135):
    """Vetorizado com numpy: gradiente diagonal + leve ondulacao."""
    angle = math.radians(angle_deg)
    dx, dy = math.cos(angle), math.sin(angle)
    max_proj = abs(dx) * w + abs(dy) * h

    xs = np.arange(w)
    ys = np.arange(h)
    proj_x = (xs * dx) / max_proj  # shape (w,)
    proj_y = (ys * dy) / max_proj  # shape (h,)

    t = proj_x[None, :] + proj_y[:, None]  # shape (h, w)
    wave = 0.05 * np.sin(xs[None, :] * 0.008)
    t = np.clip(t + wave, 0.0, 1.0)

    c1a = np.array(c1, dtype=np.float32)
    c2a = np.array(c2, dtype=np.float32)
    rgb = c1a[None, None, :] + (c2a - c1a)[None, None, :] * t[:, :, None]
    rgb = rgb.astype(np.uint8)
    return Image.fromarray(rgb, mode="RGB")


def radial_glow(img, cx, cy, radius, color, max_alpha=120):
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    odraw = ImageDraw.Draw(overlay)
    steps = 40
    for i in range(steps, 0, -1):
        r = radius * i / steps
        alpha = int(max_alpha * (1 - i / steps))
        odraw.ellipse(
            [cx - r, cy - r, cx + r, cy + r],
            fill=(color[0], color[1], color[2], alpha),
        )
    base = img.convert("RGBA")
    base = Image.alpha_composite(base, overlay)
    return base.convert("RGB")


def add_brush_texture(img, seed=0):
    rnd = random.Random(seed)
    draw = ImageDraw.Draw(img, "RGBA")
    w, h = img.size
    n_strokes = int((w * h) / 9000)
    for _ in range(n_strokes):
        x = rnd.randint(0, w)
        y = rnd.randint(0, h)
        length = rnd.randint(20, 90)
        angle = math.radians(rnd.randint(-70, 70) + 45)
        x2 = x + int(length * math.cos(angle))
        y2 = y + int(length * math.sin(angle))
        shade = rnd.choice([DARK, DARK2, RED_DEEP, RED_MID])
        alpha = rnd.randint(18, 55)
        width = rnd.randint(2, 6)
        draw.line(
            [x, y, x2, y2], fill=(shade[0], shade[1], shade[2], alpha), width=width
        )
    return img


def add_noise_grain(img, amount=10, seed=0):
    rng = np.random.default_rng(seed)
    w, h = img.size
    small = rng.integers(110, 145, size=(h // 2 + 1, w // 2 + 1), dtype=np.uint8)
    grain = Image.fromarray(small, mode="L").resize((w, h), Image.BILINEAR)
    grain_rgb = Image.merge("RGB", (grain, grain, grain))
    return Image.blend(img, grain_rgb, amount / 100.0)


def watermark(img, text="AURAPAPERS", seed=0):
    img = img.convert("RGBA")
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    try:
        font = ImageFont.truetype(
            "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 26
        )
    except Exception:
        font = ImageFont.load_default()
    w, h = img.size
    step_x, step_y = 220, 140
    for yy in range(-h, h * 2, step_y):
        for xx in range(-w, w * 2, step_x):
            txt_layer = Image.new("RGBA", (220, 60), (0, 0, 0, 0))
            td = ImageDraw.Draw(txt_layer)
            td.text((0, 0), text, font=font, fill=(255, 255, 255, 22))
            txt_layer = txt_layer.rotate(-30, expand=True)
            overlay.alpha_composite(txt_layer, (xx, yy))
    out = Image.alpha_composite(img, overlay)
    return out.convert("RGB")


def corner_label(img, label):
    img = img.convert("RGBA")
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    try:
        font = ImageFont.truetype(
            "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 20
        )
    except Exception:
        font = ImageFont.load_default()
    pad = 14
    text = label
    bbox = draw.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    box_w, box_h = tw + pad * 2, th + pad * 1.4
    x0, y0 = 20, img.size[1] - box_h - 20
    draw.rounded_rectangle(
        [x0, y0, x0 + box_w, y0 + box_h], radius=8, fill=(200, 30, 46, 160)
    )
    draw.text((x0 + pad, y0 + pad * 0.35), text, font=font, fill=(255, 255, 255, 230))
    out = Image.alpha_composite(img, overlay)
    return out.convert("RGB")


def make_tile(w, h, seed, label=None, vignette=True):
    palettes = [
        (DARK, RED_MID),
        (RED_DEEP, DARK2),
        (DARK, RED_BRIGHT),
        (RED_DEEP, RED_LIGHT),
        (DARK2, RED_DEEP),
    ]
    c1, c2 = palettes[seed % len(palettes)]
    angle = [115, 135, 150, 200, 65][seed % 5]
    img = diagonal_gradient(w, h, c1, c2, angle)
    img = add_brush_texture(img, seed=seed)
    if vignette:
        img = radial_glow(
            img, w * random.Random(seed).uniform(0.2, 0.8), h * 0.15, max(w, h) * 0.7,
            RED_BRIGHT, max_alpha=40,
        )
    img = add_noise_grain(img, amount=6, seed=seed)
    img = watermark(img, "AURAPAPERS", seed=seed)
    if label:
        img = corner_label(img, label)
    img = img.filter(ImageFilter.GaussianBlur(0.4))
    return img


def save(img, name, quality=82):
    path = os.path.join(BASE, name)
    img.save(path, "JPEG", quality=quality)
    print("wrote", path, img.size)


def main():
    # HERO — mockups grandes (notebook) e recortes de canto
    for i in range(1, 5):
        img = make_tile(1200, 800, seed=10 + i, label=f"AP-HERO-{i:02d}")
        save(img, f"hero-{i:02d}.jpg")
    for i in range(5, 9):
        img = make_tile(700, 900, seed=10 + i, label=f"AP-HERO-{i:02d}")
        save(img, f"hero-{i:02d}.jpg")

    # GALERIA — mistura notebook (16:10) e celular (9:16)
    gallery_specs = [
        (1200, 750),
        (1200, 750),
        (1200, 750),
        (700, 1200),
        (700, 1200),
        (700, 1200),
        (1200, 750),
        (1200, 750),
        (1200, 750),
        (1200, 750),
        (1200, 750),
        (1200, 750),
        (700, 1200),
        (700, 1200),
        (700, 1200),
    ]
    for idx, (w, h) in enumerate(gallery_specs, start=1):
        img = make_tile(w, h, seed=idx, label=f"AP-{idx:02d}")
        # arquivos retrato (celular) usam o sufixo "-lock" — é assim que
        # lib/wallpapers.server.ts identifica automaticamente o que é
        # wallpaper de celular/tela de bloqueio.
        is_mobile = h > w
        suffix = "-lock" if is_mobile else ""
        save(img, f"gallery-{idx:02d}{suffix}.jpg")

    # BEFORE / AFTER
    before = make_tile(1600, 1000, seed=101, label="ANTES", vignette=False)
    # deixa o "antes" mais neutro/escuro (wallpaper de fabrica)
    flat = Image.new("RGB", before.size, (14, 14, 16))
    before = Image.blend(before, flat, 0.55)
    save(before, "before.jpg")

    after = make_tile(1600, 1000, seed=102, label="DEPOIS")
    save(after, "after.jpg")

    # COLLECTION HERO (banner largo)
    collection = make_tile(1800, 700, seed=55, label="A COLECAO")
    save(collection, "collection-hero.jpg")

    # TESTIMONIAL THUMBS (quadrados pequenos usados nos prints do whatsapp)
    for i in range(1, 5):
        img = make_tile(500, 500, seed=200 + i, label=None)
        save(img, f"testimonial-{i:02d}.jpg")

    # LIGHTBOX / DESTAQUE (imagem grande do modal)
    spotlight = make_tile(1400, 1400, seed=77, label="AP-DESTAQUE")
    save(spotlight, "spotlight.jpg")


if __name__ == "__main__":
    main()
