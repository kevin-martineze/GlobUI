#!/usr/bin/env python3
"""Generates the GlobUI brand files from the Bricolage Grotesque font (SIL OFL 1.1).

Wordmark: "glob" (weight 700, text colour) + a dot + "ui" (weight 500), the dot and "ui" in the primary
colour. The dot is the size of a full stop, on the baseline, with the same gap on each side. Letters are
outlined to paths, so the output has no font dependency.

The primary is teal (the Globin teal). On white it is too light for text, so the light wordmark uses the
darker text teal (--glob-primary-text); on dark it uses the fill teal (--glob-primary).

Outputs (apps/docs/public/brand/ and apps/docs/components/):
  logo-light.svg, logo-dark.svg          wordmark for light and dark backgrounds
  favicon.svg, favicon.ico               "g" and dot on a dark rounded square
  apple-touch-icon.png (180), icon-512.png
  og.png (1200x630)                      wordmark and tagline on #0A0A0A
  logo-mark.tsx                          the wordmark as a React component, coloured by --glob-* tokens

Setup (once):  python3 -m venv scripts/brand/.venv && scripts/brand/.venv/bin/pip install fonttools brotli pillow
Run (repo root): scripts/brand/.venv/bin/python scripts/brand/generate-brand.py
"""

import math
import os

from fontTools.pens.basePen import BasePen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from PIL import Image, ImageChops, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
FONT = os.path.join(HERE, "fonts", "BricolageGrotesque-latin-wght.woff2")
PUBLIC = os.path.join(ROOT, "apps", "docs", "public", "brand")
COMPONENTS = os.path.join(ROOT, "apps", "docs", "components")

# Colours: the --glob-* tokens of packages/styles/glob-ui.css. The light primary is --glob-primary-text (4.9:1 on
# white); the dark primary is --glob-primary (10:1 on the dark surface). The logo component uses the text token,
# which resolves to the same value in each theme.
LIGHT = {"text": "#171717", "primary": "#0F7F68"}
DARK = {"text": "#F5F5F5", "primary": "#33CFA8"}
LOGO_LABEL = "glob.ui"
FAVICON_BG = "#171717"
OG_BG = "#0A0A0A"
OG_TAGLINE = "#A3A3A3"  # --glob-text-secondary, dark

TRACKING = -10  # font units between letters (1000 units per em)
DOT_GAP = 60  # font units between "ui" and the dot

_fonts = {}


def font(weight):
    """A static instance of the variable font at one weight."""
    if weight not in _fonts:
        _fonts[weight] = instantiateVariableFont(TTFont(FONT), {"wght": weight}, inplace=False)
    return _fonts[weight]


class Glyph:
    """One letter: weight, glyph name and origin x (font units). Baseline is y = 0."""

    def __init__(self, weight, name, x, color):
        self.weight, self.name, self.x, self.color = weight, name, x, color

    def advance(self):
        return font(self.weight)["hmtx"][self.name][0]


class Dot:
    """A circle with its centre (cx, cy) and radius r in font units, y up."""

    def __init__(self, cx, cy, r, color):
        self.cx, self.cy, self.r, self.color = cx, cy, r, color


def layout(text, weight, x0, color):
    """Glyph ops for a run of text, with tracking. Kerning is not applied."""
    ops, x = [], x0
    cmap = font(weight).getBestCmap()
    for ch in text:
        g = Glyph(weight, cmap[ord(ch)], x, color)
        ops.append(g)
        x += g.advance() + TRACKING
    return ops, x


def bounds_of(ops):
    """Bounds in font units (y up) of the ops."""
    xs0, ys0, xs1, ys1 = [], [], [], []
    for op in ops:
        if isinstance(op, Dot):
            xs0.append(op.cx - op.r)
            ys0.append(op.cy - op.r)
            xs1.append(op.cx + op.r)
            ys1.append(op.cy + op.r)
        else:
            pen = BoundsPen(font(op.weight).getGlyphSet())
            font(op.weight).getGlyphSet()[op.name].draw(TransformPen(pen, (1, 0, 0, 1, op.x, 0)))
            if pen.bounds:
                x0, y0, x1, y1 = pen.bounds
                xs0.append(x0)
                ys0.append(y0)
                xs1.append(x1)
                ys1.append(y1)
    return min(xs0), min(ys0), max(xs1), max(ys1)


def glyph_d(op, scale, tx, ty):
    pen = SVGPathPen(font(op.weight).getGlyphSet(), ntos=lambda v: f"{v:.2f}".rstrip("0").rstrip("."))
    font(op.weight).getGlyphSet()[op.name].draw(TransformPen(pen, (scale, 0, 0, -scale, scale * op.x + tx, ty)))
    return pen.getCommands()


def dot_d(op, scale, tx, ty):
    cx, cy, r = scale * op.cx + tx, -scale * op.cy + ty, scale * op.r
    f = lambda v: f"{v:.2f}".rstrip("0").rstrip(".")
    return f"M{f(cx - r)} {f(cy)}A{f(r)} {f(r)} 0 1 0 {f(cx + r)} {f(cy)}A{f(r)} {f(r)} 0 1 0 {f(cx - r)} {f(cy)}Z"


class Flatten(BasePen):
    """Collects a glyph outline as polygons (curves sampled), for the raster output."""

    def __init__(self, glyph_set):
        super().__init__(glyph_set)
        self.contours, self.cur = [], []

    def _moveTo(self, p):
        self.cur = [p]

    def _lineTo(self, p):
        self.cur.append(p)

    def _curveToOne(self, p1, p2, p3):
        p0 = self.cur[-1]
        for i in range(1, 17):
            t = i / 16
            m = 1 - t
            self.cur.append(
                (
                    m**3 * p0[0] + 3 * m * m * t * p1[0] + 3 * m * t * t * p2[0] + t**3 * p3[0],
                    m**3 * p0[1] + 3 * m * m * t * p1[1] + 3 * m * t * t * p2[1] + t**3 * p3[1],
                )
            )

    def _qCurveToOne(self, p1, p2):
        p0 = self.cur[-1]
        for i in range(1, 17):
            t = i / 16
            m = 1 - t
            self.cur.append(
                (
                    m * m * p0[0] + 2 * m * t * p1[0] + t * t * p2[0],
                    m * m * p0[1] + 2 * m * t * p1[1] + t * t * p2[1],
                )
            )

    def _closePath(self):
        if len(self.cur) > 2:
            self.contours.append(self.cur)
        self.cur = []

    def _endPath(self):
        self._closePath()


def contours_of(op, scale, tx, ty):
    """Polygons of one op in SVG units, for rasterising."""
    if isinstance(op, Dot):
        cx, cy, r = scale * op.cx + tx, -scale * op.cy + ty, scale * op.r
        return [[(cx + r * math.cos(a), cy + r * math.sin(a)) for a in (2 * math.pi * i / 96 for i in range(96))]]
    pen = Flatten(font(op.weight).getGlyphSet())
    font(op.weight).getGlyphSet()[op.name].draw(TransformPen(pen, (scale, 0, 0, -scale, scale * op.x + tx, ty)))
    return pen.contours


def place(ops, box_x, box_y, box_w, box_h, scale=None):
    """Scale and centre ops inside a box. Returns (scale, tx, ty)."""
    x0, y0, x1, y1 = bounds_of(ops)
    s = scale if scale is not None else min(box_w / (x1 - x0), box_h / (y1 - y0))
    tx = box_x + (box_w - s * (x1 - x0)) / 2 - s * x0
    ty = box_y + (box_h + s * (y1 - y0)) / 2 + s * y0  # SVG y of the baseline
    return s, tx, ty


def hex_rgba(h, a=255):
    h = h.lstrip("#")
    return tuple(int(h[i : i + 2], 16) for i in (0, 2, 4)) + (a,)


def rasterize(ops, scale, tx, ty, vb, width, height, bg=None, radius=0, ss=4):
    """Renders ops into a width x height image; vb = (x, y, w, h) of the drawing in SVG units."""
    W, H = width * ss, height * ss
    sx, sy = W / vb[2], H / vb[3]
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    if bg:
        bg_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        ImageDraw.Draw(bg_layer).rounded_rectangle([0, 0, W - 1, H - 1], radius=radius * ss, fill=hex_rgba(bg))
        img = Image.alpha_composite(img, bg_layer)
    colors = []
    for op in ops:
        if op.color not in colors:
            colors.append(op.color)
    for color in colors:
        mask = Image.new("1", (W, H), 0)
        for op in ops:
            if op.color != color:
                continue
            for contour in contours_of(op, scale, tx, ty):
                pts = [((x - vb[0]) * sx, (y - vb[1]) * sy) for x, y in contour]
                m = Image.new("1", (W, H), 0)
                ImageDraw.Draw(m).polygon(pts, fill=1)
                mask = ImageChops.logical_xor(mask, m)  # even-odd: counters stay empty
        solid = Image.new("RGBA", (W, H), hex_rgba(color))
        img.paste(solid, (0, 0), mask.convert("L"))
    return img.resize((width, height), Image.LANCZOS)


def svg_document(ops, scale, tx, ty, vb, label, bg=None, radius=0, title=None):
    """SVG with one path per colour, plus an optional background rect."""
    by_color = {}
    for op in ops:
        d = dot_d(op, scale, tx, ty) if isinstance(op, Dot) else glyph_d(op, scale, tx, ty)
        by_color.setdefault(op.color, []).append(d)
    parts = []
    if bg:
        parts.append(f'  <rect x="{vb[0]:.2f}" y="{vb[1]:.2f}" width="{vb[2]:.2f}" height="{vb[3]:.2f}" rx="{radius}" fill="{bg}"/>')
    for color, ds in by_color.items():
        parts.append(f'  <path fill="{color}" d="{"".join(ds)}"/>')
    title_el = f"  <title>{title}</title>\n" if title else ""
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb[0]:.2f} {vb[1]:.2f} {vb[2]:.2f} {vb[3]:.2f}" '
        f'width="{vb[2]:.0f}" height="{vb[3]:.0f}" role="img" aria-label="{label}">\n'
        f"{title_el}" + "\n".join(parts) + "\n</svg>\n"
    )


def dot_for_text(x, color):
    """A dot the width of a full stop (weight 500), sitting on the baseline at x (font units)."""
    b = bounds_of([Glyph(500, font(500).getBestCmap()[ord(".")], 0, color)])
    r = (b[2] - b[0]) / 2
    return Dot(x + DOT_GAP + r, r, r, color)


def wordmark(colors):
    """'glob' + dot + 'ui', in font units (baseline y = 0). The dot has DOT_GAP on each side."""
    glob, x = layout("glob", 700, 0, colors["text"])
    dot = dot_for_text(x, colors["primary"])
    ui, _ = layout("ui", 500, dot.cx + dot.r + DOT_GAP, colors["primary"])
    return glob + [dot] + ui


def logo_svg(colors, name):
    ops = wordmark(colors)
    x0, y0, x1, y1 = bounds_of(ops)
    pad = 40
    vb = (x0 - pad, -y1 - pad, (x1 - x0) + 2 * pad, (y1 - y0) + 2 * pad)
    scale, tx, ty = 1, 0, 0
    svg = svg_document(ops, scale, tx, ty, vb, label=LOGO_LABEL, title=LOGO_LABEL)
    with open(os.path.join(PUBLIC, name), "w") as f:
        f.write(svg)
    return ops, vb


def logo_mark_tsx(ops, vb):
    """A React component with the same paths, coloured with the --glob-* tokens."""
    colors = {"var(--glob-text)": [], "var(--glob-primary-text)": []}
    token = {LIGHT["text"]: "var(--glob-text)", LIGHT["primary"]: "var(--glob-primary-text)"}
    for op in ops:
        d = dot_d(op, 1, 0, 0) if isinstance(op, Dot) else glyph_d(op, 1, 0, 0)
        colors[token[op.color]].append(d)
    paths = "\n".join(
        f'      <path fill="{c}" d="{"".join(ds)}" />' for c, ds in colors.items() if ds
    )
    return f"""// Generated by scripts/brand/generate-brand.py. Do not edit by hand.
import type {{ SVGProps }} from "react"

/** The glob.ui wordmark. Colours come from the --glob-* tokens, so it follows light and dark themes. */
export function GlobUILogo({{ title = "{LOGO_LABEL}", ...props }}: SVGProps<SVGSVGElement> & {{ title?: string }}) {{
  return (
    <svg
      viewBox="{vb[0]:.2f} {vb[1]:.2f} {vb[2]:.2f} {vb[3]:.2f}"
      role="img"
      aria-label={{title}}
      {{...props}}
    >
      <title>{{title}}</title>
{paths}
    </svg>
  )
}}
"""


def favicon_ops(text_color, dot_color):
    g, x = layout("g", 700, 0, text_color)
    return g + [dot_for_text(x, dot_color)]


def favicon_placed(size, text_color, dot_color):
    ops = favicon_ops(text_color, dot_color)
    margin = size * 0.2
    s, tx, ty = place(ops, margin, margin, size - 2 * margin, size - 2 * margin)
    return ops, s, tx, ty


def main():
    os.makedirs(PUBLIC, exist_ok=True)
    light_ops, _ = logo_svg(LIGHT, "logo-light.svg")
    dark_ops, _ = logo_svg(DARK, "logo-dark.svg")
    with open(os.path.join(COMPONENTS, "logo-mark.tsx"), "w") as f:
        f.write(logo_mark_tsx(light_ops, logo_vb(light_ops)))

    # Favicon, Apple touch icon and 512 icon: "g" and the dot on the dark square.
    fav_ops, s, tx, ty = favicon_placed(512, DARK["text"], DARK["primary"])
    vb512 = (0, 0, 512, 512)
    fav_svg = svg_document(fav_ops, s, tx, ty, vb512, label="GlobUI", bg=FAVICON_BG, radius=112)
    with open(os.path.join(PUBLIC, "favicon.svg"), "w") as f:
        f.write(fav_svg)

    rasterize(fav_ops, s, tx, ty, vb512, 512, 512, bg=FAVICON_BG, radius=112).save(os.path.join(PUBLIC, "icon-512.png"))
    # The Apple icon is a full square: iOS rounds the corners itself.
    apple_ops, s2, tx2, ty2 = favicon_placed(180, DARK["text"], DARK["primary"])
    rasterize(apple_ops, s2, tx2, ty2, (0, 0, 180, 180), 180, 180, bg=FAVICON_BG, radius=0).save(
        os.path.join(PUBLIC, "apple-touch-icon.png")
    )
    # ICO with 16, 32 and 48 px, rendered at 48 and reduced by Pillow.
    ico_ops, s3, tx3, ty3 = favicon_placed(48, DARK["text"], DARK["primary"])
    rasterize(ico_ops, s3, tx3, ty3, (0, 0, 48, 48), 48, 48, bg=FAVICON_BG, radius=11).save(
        os.path.join(PUBLIC, "favicon.ico"), sizes=[(16, 16), (32, 32), (48, 48)]
    )

    # OG image: wordmark on the left, tagline under it.
    W, H = 1200, 630
    og_logo_w = 520
    lx0, ly0, lx1, ly1 = bounds_of(dark_ops)
    s_logo = og_logo_w / (lx1 - lx0)
    logo_x = 120
    logo_base = 300 + s_logo * (ly0 + ly1) / 2  # SVG y of the baseline; logo centred on y = 300
    tag_ops, _ = layout("An accessible React component library, one package per component.", 400, 0, OG_TAGLINE)
    tag_w = 960
    tb = bounds_of(tag_ops)
    s_tag = tag_w / (tb[2] - tb[0])
    tag_tx = 120 - s_tag * tb[0]
    tag_ty = 470  # SVG y of the tagline baseline
    logo_tx = logo_x - s_logo * lx0
    # Logo and tagline have their own transforms, so each is rasterised on its own and composited.
    base = rasterize(dark_ops, s_logo, logo_tx, logo_base, (0, 0, W, H), W, H, bg=OG_BG)
    tag = rasterize(tag_ops, s_tag, tag_tx, tag_ty, (0, 0, W, H), W, H)
    out = Image.alpha_composite(base, tag).convert("RGB")
    out.save(os.path.join(PUBLIC, "og.png"), optimize=True)
    print("brand files written to", PUBLIC)


def logo_vb(ops):
    x0, y0, x1, y1 = bounds_of(ops)
    pad = 40
    return (x0 - pad, -y1 - pad, (x1 - x0) + 2 * pad, (y1 - y0) + 2 * pad)


if __name__ == "__main__":
    main()
