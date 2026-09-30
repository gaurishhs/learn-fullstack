---
course: css
slug: selectors
title: Selectors
description: "Learn how to target HTML elements with element, class, and id selectors, combinators, and specificity."
---

Selectors "select" the HTML elements you want to style.

## Simple selectors

### Element selector

Selects every element with that tag name.

```css
p {
  text-align: center;
  color: red;
}
```

All `<p>` elements become centered and red.

### Class selector

Write a dot `.` followed by the class name. Selects every element with that class.

```html
<p class="center">Hello</p>
<h2 class="center">World</h2>
```

```css
.center {
  text-align: center;
  color: red;
}
```

All elements with `class="center"` are centered and red. An element can have several classes: `class="center big"`.

### ID selector

Write a hash `#` followed by the id. An id must be unique on the page, so it selects exactly one element.

```html
<p id="para1">Hello</p>
```

```css
#para1 {
  text-align: center;
  color: red;
}
```

Class vs id: prefer classes for styling. Use ids sparingly (for one-off things like a page section or a link target).

### Grouping selector

If several elements share the same style, separate the selectors with commas.

```css
h1,
h2,
p {
  text-align: center;
  color: red;
}
```

`h1`, `h2` and `p` all get the same style, so you don't have to repeat yourself.

### Universal selector

`*` selects everything. It's often used for resets:

```css
* {
  margin: 0;
  box-sizing: border-box;
}
```

## Combinators

A selector can contain more than one simple selector. Between them we can place a combinator to make the selection more specific.

### Descendant combinator (space)

Matches all elements that are descendants (children, grandchildren, and so on) of a given element.

```css
/* every <p> anywhere inside a <div> */
div p {
  background-color: yellow;
}
```

### Child combinator (>)

Matches only direct children.

```css
/* only <p> elements that are direct children of a <div> */
div > p {
  background-color: yellow;
}
```

### Next sibling combinator (+)

Selects the element placed directly after another. Both must share the same parent.

```css
/* the first <p> right after a <div> */
div + p {
  background-color: yellow;
}
```

### Subsequent-sibling combinator (~)

Selects all later siblings of an element that share the same parent.

```css
/* all <p> siblings that come after a <div> */
div ~ p {
  background-color: yellow;
}
```

## Which rule wins? (Specificity and the cascade)

When two rules target the same element, CSS decides using:

1. Specificity: id beats class, and class beats element.
2. Order: if specificity is equal, the rule written later wins.

```css
p { color: blue; }        /* weakest */
.note { color: green; }   /* stronger */
#intro { color: red; }    /* strongest of the three */
```

This is the "cascading" in Cascading Style Sheets.
