---
course: html
slug: links-and-media
title: Links & Images
description: "Learn how to connect pages with links using the a tag and add pictures to a page with the img tag."
---

## Links with a

The `<a>` (anchor) element creates a link. The `href` attribute holds the destination, and the text between the tags is what the reader clicks.

```html live
<p>Learn more at <a href="https://developer.mozilla.org">MDN Web Docs</a>.</p>
```

**Result:**

<p>Learn more at <a href="https://developer.mozilla.org">MDN Web Docs</a>.</p>

## Link destinations

`href` can point to different places:

- **A full URL** like `https://osdc.dev` links to Osdc website.
- **A file path** like `about.html` links to another page in your project.
- **An id** like `#contact` jumps to the element with `id="contact"` on the same page.

```html live
<ul>
  <li><a href="https://osdc.dev">Osdc website</a></li>
  <li><a href="about.html">Another page</a></li>
  <li><a href="#contact">Jump to contact</a></li>
</ul>

<h2 id="contact">Contact</h2>
```

**Result:**

<ul>
  <li><a href="https://osdc.dev">Osdc Website</a></li>
  <li><a href="about.html">Another page</a></li>
  <li><a href="#contact">Jump to contact</a></li>
</ul>

<h2 id="contact">Contact</h2>

> [!NOTE]
> Write link text that makes sense on its own. "Read the HTML guide" is better than "click here", because screen reader users often jump from link to link.

To open a link in a new tab, add `target="_blank"` and pair it with `rel="noopener noreferrer"`.

```html live
<a href="https://example.com" target="_blank" rel="noopener noreferrer">Open in a new tab</a>
```

**Result:**

<a href="https://example.com" target="_blank" rel="noopener noreferrer">Open in a new tab</a>

## Images with img

The `<img>` element displays an image. It's self-closing (no `</img>`) and needs **both** of these attributes:

- `src`: where the image file is, as a URL or a file path.
- `alt`: a text description of the image.

`src` tells the browser *what to show*, and `alt` tells everyone else *what it is*.

```html live
<img src="https://placehold.co/300x150" alt="A grey placeholder rectangle">
```

**Result:**

<img src="https://placehold.co/300x150" alt="A grey placeholder rectangle">

## Why alt matters

`alt` is read aloud by screen readers, and it's shown in place of the image if the file fails to load. The path below is broken on purpose, so you'll see the `alt` text.

```html live
<img src="missing-photo.jpg" alt="A dog catching a frisbee at the beach">
```

**Result:**

<img src="missing-photo.jpg" alt="A dog catching a frisbee at the beach">

> [!NOTE]
> Describe what the image shows, not "image of...". For a purely decorative image, use an empty `alt=""`. Never leave `alt` out entirely.

## Putting it together

An image inside a link becomes clickable. It still needs both `src` and `alt`.

```html live
<a href="https://developer.mozilla.org">
  <img src="https://placehold.co/200x100" alt="Visit MDN Web Docs">
</a>
```

**Result:**

<a href="https://developer.mozilla.org">
  <img src="https://placehold.co/200x100" alt="Visit MDN Web Docs">
</a>

## Try it yourself

Add a link to a site you like, then an `<img>` with both `src` and `alt`. Finally, wrap that image in an `<a>` to make it clickable.