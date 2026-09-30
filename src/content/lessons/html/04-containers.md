---
course: html
slug: containers
title: Containers, Lists & Semantic Tags
description: "Learn how to group content with div, create proper lists, and structure webpages using semantic HTML elements."
---

## Containers with div

The `<div>` element is a generic container used to group related HTML elements together. It has no special meaning by itself, but it is useful for structure, styling, or scripting.

```html live
<div>
<h2>About me</h2>
<p>I am learning HTML.</p>
</div>
```

**Result:**

<div>
<h2>About me</h2>
<p>I am learning HTML.</p>
</div>

## Class

`class` lets you label an element so you can style or target it later — especially useful when you want the same style on more than one element.

```html live
<div class="card">First card</div>
<div class="card">Second card</div>
```

> [!NOTE]
> Adding a `class` by itself doesn't change how anything looks — it just gives the browser (and your future CSS) something to target.

## Unordered lists

Use `<ul>` (unordered list) when the order of items doesn't matter. Every item goes in its own `<li>` (list item) tag, and browsers add bullets automatically.

```html live
<ul>
  <li>HTML</li>
  <li>CSS</li>
  <li>JavaScript</li>
</ul>
```

**Result:**

<ul>
  <li>HTML</li>
  <li>CSS</li>
  <li>JavaScript</li>
</ul>

## Ordered lists

Use `<ol>` (ordered list) when the order matters, like steps or rankings. It uses the same `<li>` items, but the browser numbers them for you.

```html live
<ol>
  <li>Write some HTML</li>
  <li>Save the file</li>
  <li>Open it in the browser</li>
</ol>
```

**Result:**

<ol>
  <li>Write some HTML</li>
  <li>Save the file</li>
  <li>Open it in the browser</li>
</ol>

## Using lists properly

- `<li>` must be **inside** a `<ul>` or `<ol>`, never on its own.
- The only direct children of `<ul>` and `<ol>` are `<li>` elements.
- To nest a list, place the new `<ul>` or `<ol>` **inside** an `<li>`.

```html live
<ul>
  <li>Frontend
    <ul>
      <li>HTML</li>
      <li>CSS</li>
    </ul>
  </li>
  <li>Backend</li>
</ul>
```

**Result:**

<ul>
  <li>Frontend
    <ul>
      <li>HTML</li>
      <li>CSS</li>
    </ul>
  </li>
  <li>Backend</li>
</ul>

> [!NOTE]
> Putting a nested `<ul>` directly inside the outer `<ul>` (between two `<li>` tags) may look fine, but it's invalid HTML.

## Semantic tags

A page made only of `<div>` elements works, but nothing tells browsers, search engines, or screen readers what each part *is*. **Semantic** tags give each part a meaningful name:

- `<header>`: introductory content, like a title or logo
- `<nav>`: a group of main navigation links
- `<main>`: the central content of the page (use only **one** per page)
- `<section>`: a group of related content, usually with its own heading
- `<footer>`: closing content, like copyright text

They improve accessibility, help search engines, and make your code easier to read.

## Putting it together

This page uses all five semantic tags, plus a list inside `<nav>` and an ordered list inside `<section>`.

```html live
<!-- header: page title and intro -->
<header>
  <h1>My Study Notes</h1>

  <!-- nav: main navigation links -->
  <nav>
    <ul>
      <li><a href="#">Home</a></li>
      <li><a href="#">Notes</a></li>
    </ul>
  </nav>
</header>

<!-- main: the central content of the page -->
<main>
  <!-- section: a group of related content with a heading -->
  <section>
    <h2>Today's goals</h2>
    <ol>
      <li>Learn about lists</li>
      <li>Learn about semantic tags</li>
    </ol>
  </section>
</main>

<!-- footer: closing content -->
<footer>
  <p>&copy; 2026 My Study Notes</p>
</footer>
```

**Result:**

<header>
  <h1>My Study Notes</h1>
  <nav>
    <ul>
      <li><a href="#">Home</a></li>
      <li><a href="#">Notes</a></li>
    </ul>
  </nav>
</header>

<main>
  <section>
    <h2>Today's goals</h2>
    <ol>
      <li>Learn about lists</li>
      <li>Learn about semantic tags</li>
    </ol>
  </section>
</main>

<footer>
  <p>&copy; 2026 My Study Notes</p>
</footer>

> [!NOTE]
> If a group of content has no natural heading, use `<div>` instead of `<section>`. Use `<div>` whenever you only need a container for styling.

## Try it yourself

Build a small personal website layout using all five semantic tags. Add a `<header>` with your name as an `<h1>` and a `<nav>` with an unordered list of three links. In `<main>`, add two `<section>` elements: one with an ordered list of your top three goals, and one with a short paragraph about you. Finish with a `<footer>`, and leave a comment above each major tag explaining its purpose.