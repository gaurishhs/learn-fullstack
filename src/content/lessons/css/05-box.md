---
course: css
slug: box-model
title: The Box Model
description: "Learn how padding, border, and margin work, and why box-sizing: border-box matters."
---

Every HTML element is a rectangular box. The box model describes the layers that make up that box, from the inside out:

```
┌────────────────────────── margin ──────────────────────────┐
│  ┌──────────────────────── border ──────────────────────┐  │
│  │  ┌────────────────────── padding ─────────────────┐  │  │
│  │  │                                                 │  │  │
│  │  │                   CONTENT                       │  │  │
│  │  │              (text, images, ...)                │  │  │
│  │  │                                                 │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

| Layer   | What it is                                                       |
| ------- | ------------------------------------------------------------------ |
| Content | the text or image itself                                           |
| Padding | space inside the border, between the content and the border        |
| Border  | a line around the padding and content                              |
| Margin  | space outside the border, pushing other elements away              |

## padding

Padding is the space between the content and the border. It can be set for all four sides at once, or for each side individually.

```css
.box {
  padding: 20px;                 /* all four sides */
  padding: 10px 20px;            /* top & bottom | left & right */
  padding: 10px 20px 30px 40px;  /* top | right | bottom | left (clockwise) */
  padding-left: 15px;            /* a single side */
}
```

## margin

Works exactly like padding (same shorthand), but the space is outside the border.

```css
.box {
  margin: 20px;
  margin: 0 auto;   /* no vertical margin, and centers a block horizontally
                       (the element needs a set width) */
  margin-bottom: 1rem;
}
```

Vertical margins between two stacked elements can collapse: the larger one wins instead of them adding up.

## border

Borders go around the padding and content. You can set the width, style, and color of each side individually, or all at once.

Shorthand: `width style color`.

```css
.box {
  border: 2px solid black;
  border-bottom: 4px dashed tomato;   /* one side only */
}
```

Common styles: `solid`, `dashed`, `dotted`, `double`, `none`.

## border-radius

Rounds the corners of the box.

```css
.card   { border-radius: 8px; }
.pill   { border-radius: 999px; }
.circle { width: 100px; height: 100px; border-radius: 50%; }  /* a circle */
```

## box-sizing: border-box

By default, `width` and `height` only set the size of the content. Padding and border are added on top, which makes the box bigger than you expected.

```css
.box {
  width: 200px;
  padding: 20px;
  border: 5px solid black;
  /* actual width = 200 + 20 + 20 + 5 + 5 = 250px  (surprise!) */
}
```

With `box-sizing: border-box`, the width includes padding and border, so the box stays exactly 200px wide.

```css
.box {
  box-sizing: border-box;
  width: 200px;
  padding: 20px;
  border: 5px solid black;
  /* actual width = 200px  (as expected) */
}
```

Most developers apply it to everything at the start of their stylesheet:

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

Tip: right-click any element in your browser and choose Inspect to see its box model diagram live in DevTools.
