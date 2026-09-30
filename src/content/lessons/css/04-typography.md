---
course: css
slug: typography
title: Typography
description: "Learn the core CSS text properties: font-family, font-size, font-weight, line-height, text-align, and color."
---

Typography properties control how text looks.

## font-family

Sets the typeface. Always list fallback fonts, ending with a generic family, in case the first one isn't available.

```css
body {
  font-family: "Poppins", Arial, sans-serif;
}
```

- Font names with spaces go in quotes (`"Times New Roman"`).
- Generic families: `serif`, `sans-serif`, `monospace`, `cursive`.

## font-size

```css
h1 { font-size: 2.5rem; }
p  { font-size: 16px; }
```

## font-weight

How bold the text is. Use keywords or numbers from `100` to `900`.

```css
p      { font-weight: normal; }  /* same as 400 */
strong { font-weight: bold; }    /* same as 700 */
.light { font-weight: 300; }
```

## line-height

The space between lines of text. A unitless number is recommended, since it scales with the font size.

```css
p {
  line-height: 1.6;
}
```

A value of `1.5` to `1.7` makes body text much easier to read.

## text-align

Horizontal alignment of text inside its container.

```css
h1 { text-align: center; }
p  { text-align: left; }    /* also: right, justify */
```

## color

The color of the text itself (not the background).

```css
p {
  color: #333333;
}
```

## Putting it together

```css
body {
  font-family: "Segoe UI", Arial, sans-serif;
  font-size: 1rem;
  line-height: 1.6;
  color: #333;
}

h1 {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  color: DodgerBlue;
}
```
