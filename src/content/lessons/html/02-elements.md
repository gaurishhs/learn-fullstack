---
course: html
slug: elements
title: HTML Elements
description: Learn how HTML elements combine opening tags, content, and closing tags to build a page.
---

## What is an element?

An HTML element describes one part of a page. Most elements have three parts: an opening tag, some content, and a closing tag. The browser uses the tag name to understand what the content is.

```html
<p>A paragraph is an HTML element.</p>
```

Here `<p>` is the opening tag, `A paragraph is an HTML element.` is the content, and `</p>` is the closing tag. The closing tag looks like the opening tag with a `/` added.

## Nest elements

An element can sit inside another element. This is called **nesting**. In the example below, the heading and the paragraph are both inside `<main>`.

Adding `live` after the language turns a code block into an editable example with a preview:

```html live
<main>
  <h1>My little corner of the web</h1>
  <p>I'm learning how HTML elements fit together.</p>
</main>
```

Try changing the heading text. The preview updates as you type.

> [!NOTE]
> Always close the inner elements before closing the outer one. `<main>` opens first, so `</main>` comes last.

## Try it yourself

Inside `<main>`, add another `<p>` with a sentence about yourself. Check that it has both an opening and a closing tag.