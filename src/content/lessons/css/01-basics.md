---
course: css
slug: basics
title: CSS Basics
description: "Learn the syntax of CSS, the three ways to add it to a page, and how to write comments."
---

CSS stands for Cascading Style Sheets.

HTML gives a page its structure. CSS makes it look better and feel alive, and it is what lets one page adapt to different devices and screen sizes.

## How do you write CSS?

CSS is a rule-based language. You define a rule with a group of styles and apply it to a set of HTML elements.

Every rule answers two questions:

1. Which element should it change? (the selector)
2. What should it change about it? (the declarations)

### Example: changing the font and color of an h1

```css
h1 {
  color: red;
  font-size: 2.5em;
}
```

| Part        | Name     |
| ----------- | -------- |
| `h1`        | selector |
| `color`     | property |
| `red`       | value    |
| `font-size` | property |
| `2.5em`     | value    |

A `property: value;` pair is called a declaration. The whole thing (selector plus the declarations in `{ }`) is called a CSS rule.

```
selector {
  property: value;   ← declaration
  property: value;   ← declaration
}
```

Every declaration ends with a semicolon `;`. Forgetting one is the most common beginner bug.

## Three ways to add CSS to your HTML

### 1. Inline styles

Add a `style` attribute directly to an HTML element. It affects only that one element.

```html
<span style="color: purple; font-weight: bold">span element</span>
```

Here the text inside the `<span>` becomes purple and bold.

Avoid this. It's hard to keep the page consistent, and you can't reuse the styles.

### 2. Internal stylesheet

Write CSS inside a `<style>` element, usually in the `<head>`.

```html
<head>
  <style>
    p {
      color: red;
    }
  </style>
</head>
```

This works for a single page, but gets repetitive fast when you have many pages.

### 3. External stylesheet (the one you'll use most)

Put your CSS in a separate `.css` file. Create `styles.css` in the same folder as your HTML file, then link it inside the `<head>`:

```html
<link rel="stylesheet" href="styles.css" />
```

- `<link>` tells the HTML document it is connected to another resource.
- `rel="stylesheet"` says that resource is a stylesheet.
- `href` is the location of the file.

One stylesheet can style your whole website, and changing it once updates every page.

## CSS comments

Comments help you (and others) remember what a piece of code does. Browsers ignore them.

```css
/* Setting the color to red */
p {
  color: red;
}

/* Setting
   the color to red
   but across multiple lines */
p {
  color: red;
}
```
