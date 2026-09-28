---
course: html
slug: elements
title: HTML Elements
description: Learn how HTML elements combine opening tags, content, and closing tags to build a page.
---

## Elements have meaning

An HTML element describes one part of a page. Most elements have an opening tag, some content, and a closing tag. The browser uses the tag name to understand what that content means.

This ordinary code fence stays a simple code sample:

```html
<p>A paragraph is an HTML element.</p>
```

## Nest elements

An element can contain other elements. In this example, the heading and paragraph are both inside `<main>`:

Some elements can sit inside others. Add `live` after the language to turn a fence into an editable example with a preview:

```html live
<main>
  <h1>My little corner of the web</h1>
  <p>I'm learning how HTML elements fit together.</p>
  <a href="https://example.com">A link to explore</a>
</main>
```

Try changing the heading or adding another paragraph. The preview updates as you type.

## Try it yourself

Add a list inside `<main>`. Put two or three `<li>` elements inside a `<ul>` and see how the browser displays them.
