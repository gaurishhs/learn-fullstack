---
course: html
slug: your-first-page
title: Your First HTML Page
description: "HTML is the language we use to describe the structure of a webpage. Think of it like the frame of a house: it gives every piece a place."
---

## Your first HTML document

An HTML document is made from **elements**. Tags tell the browser what each piece of content means and where it belongs.

The browser reads these tags and turns them into the page you see. Try changing the heading in the editor below.

```html live
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>My first page</title>
  </head>
  <body>
    <h1>Hello, World!</h1>
    <p>I made my first webpage.</p>
  </body>
</html>
```

## What does it mean?

The browser reads HTML from top to bottom and turns each tag into something you can see. Tags often come in pairs: an opening tag and a closing tag.

For example, `<h1>` opens a heading and `</h1>` closes it. Text between the tags becomes that heading's content.

> [!NOTE]
> HTML describes what content means. CSS will help decide how it looks.


## Try it yourself

Change the heading in the editor to say your name, then press **Run**. Try adding another paragraph to the page, too.
