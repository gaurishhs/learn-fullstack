---
course: html
slug: your-first-page
title: Your First HTML Page
description: "HTML is the language we use to describe the structure of a webpage. Think of it like the frame of a house: it gives every piece a place."
---

## Your first HTML document

Every webpage you've ever visited is built with HTML underneath. It's not a programming language — it's a markup language, meaning it uses tags to describe what each piece of content is and where it belongs.

An HTML document is made from **elements**. Tags tell the browser what each piece of content means and where it belongs.

The browser reads these tags top to bottom and turns them into the page you see. Try changing the heading in the editor below.

```html live
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>My first page</title>
  </head>
  <body>
    <h1>Hello, World!</h1>
    <p>I made my first webpage.</p>
  </body>
</html>
```

## What does it mean?

- `<!DOCTYPE html>` tells the browser this is an HTML5 page. It's always the very first line.
- `<html>` wraps the entire page — everything else lives inside it.
- `<head>` holds information about the page that isn't shown directly — like the `<title>` (what shows in the browser tab) and `<meta charset="UTF-8">` (tells the browser how to read the text properly, so things like emojis and special characters don't look broken).
- `<body>` holds everything you actually see on the page — text, images, buttons, all of it.

Tags usually come in pairs: an opening tag and a closing tag. For example, `<h1>` opens a heading and `</h1>` closes it. Text between the tags becomes that heading's content. A few tags, like `<meta>`, don't need a closing tag at all.

> [!NOTE]
> HTML describes what content means. CSS will help decide how it looks.

## Try it yourself

Change the heading in the editor to say your name, then press **Run**. Try adding another paragraph to the page, too. Then try changing `<title>` and see where that text actually shows up.