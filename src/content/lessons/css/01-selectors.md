---
course: css
slug: selectors
title: Selectors
description: "CSS selectors tell the browser which parts of your page to style. You can select an element by its name, a class, or an id."
---

## Pick an element

A selector is the part of a CSS rule that chooses which elements receive the styles. Here, `.welcome` selects every element with that class.

Try changing the color or adding a second element with `class="welcome"` to see how the same rule can style more than one thing.

## Try it yourself

Change the selector to `p.welcome` and add the `welcome` class to the paragraph. Then try selecting every `<h1>` by its element name.

```html live
<style>
  .welcome {
    color: #277a49;
    font-size: 28px;
  }
</style>

<h1 class="welcome">Hello, CSS!</h1>
<p>Selectors help us choose what to style.</p>
```
