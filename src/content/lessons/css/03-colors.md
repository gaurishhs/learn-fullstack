---
course: css
slug: colors-units
title: Colors and Units
description: "Learn CSS color formats (names, hex, rgb, hsl) and the length units used for sizing and spacing."
---

CSS colors can be specified using a predefined name, or an RGB, HEX, HSL, RGBA or HSLA value.

### Color names

CSS supports 140 named colors. A few:

`Tomato` · `Orange` · `DodgerBlue` · `MediumSeaGreen` · `Gray` · `SlateBlue` · `Violet` · `LightGray`

```css
h1 {
  color: DodgerBlue;
}
```

### RGB

An RGB color represents Red, Green and Blue light sources. Each value goes from `0` to `255`.

```css
color: rgb(255, 99, 71); /* tomato */
```

### RGBA

RGB plus an alpha channel for opacity, from `0` (fully transparent) to `1` (fully opaque).

```css
background-color: rgba(255, 99, 71, 0.5); /* half-transparent tomato */
```

### HEX

A hexadecimal color is written `#RRGGBB`, where `rr` (red), `gg` (green) and `bb` (blue) are hex values from `00` to `ff` (decimal 0-255).

- `#ff0000` is red (red is at max `ff`, the others at `00`)
- `#000000` is black (all values at `00`)
- `#ffffff` is white (all values at `ff`)

```css
color: #ff6347; /* tomato */
```

Short form: `#f00` is the same as `#ff0000`.

## Units

Many properties (font size, width, margin, ...) need a length. There are two kinds.

### Absolute unit

| Unit | Meaning                                              |
| ---- | ---------------------------------------------------- |
| `px` | pixels, a fixed size that doesn't change with context |

### Relative units

| Unit  | Relative to                                                          |
| ----- | -------------------------------------------------------------------- |
| `%`   | the parent element's size                                            |
| `em`  | the font size of the current element (or its parent, for `font-size`) |
| `rem` | the font size of the root (`<html>`) element, 16px by default     |
| `vw`  | 1% of the viewport width                                          |
| `vh`  | 1% of the viewport height                                         |

```css
.box {
  width: 50%;       /* half of the parent's width */
  height: 50vh;     /* half of the screen height */
  padding: 1rem;    /* 16px by default */
  font-size: 1.25rem;
}

.hero {
  width: 100vw;     /* the full width of the screen */
  height: 100vh;    /* the full height of the screen */
}
```

Tip: `rem` is great for font sizes and spacing because it respects the user's browser font settings. Use `%`, `vw` and `vh` for layouts that adapt to screen size.
