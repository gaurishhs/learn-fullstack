---
course: css
slug: backgrounds-shadows
title: Backgrounds and Shadows
description: "Learn background-color and box-shadow, then see them combined with selectors, colors, typography, and the box model in one card."
---

## background-color

Sets the background color of an element (accepts any color format).

```css
body {
  background-color: #f5f5f5;
}

.highlight {
  background-color: rgba(255, 235, 59, 0.5);
}
```

The background fills the content, padding and border area (not the margin).

## box-shadow

Adds a shadow around an element's box.

```css
box-shadow: offset-x offset-y blur-radius spread-radius color;
```

```css
.card {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

| Value           | Meaning                                                     |
| --------------- | ----------------------------------------------------------- |
| `offset-x`      | horizontal shift (positive moves right)                     |
| `offset-y`      | vertical shift (positive moves down)                        |
| `blur-radius`   | how soft the shadow is (bigger is blurrier)                 |
| `spread-radius` | optional, grows or shrinks the shadow                    |
| `color`         | shadow color, usually semi-transparent black                |

Add `inset` at the start to draw the shadow inside the box, and separate multiple shadows with commas.

```css
.button {
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2), 0 1px 2px rgba(0, 0, 0, 0.3);
}
```

## Putting it all together

A small card that uses everything from basics, selectors, colors and units, typography, the box model, and backgrounds and shadows.

**HTML**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CSS Card</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <div class="card">
      <h2>Learning CSS</h2>
      <p>Selectors, colors, typography, and the box model.</p>
      <p class="tag">Beginner</p>
    </div>
  </body>
</html>
```

**styles.css**

```css
/* Apply border-box everywhere */
*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-height: 100vh;
  background-color: #eef2f7;
  font-family: "Segoe UI", Arial, sans-serif;
  line-height: 1.6;
  color: #333;
}

.card {
  width: 90%;
  max-width: 400px;
  margin: 3rem auto;          /* centered */
  padding: 1.5rem;
  background-color: white;
  border: 1px solid #dde3ea;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card h2 {
  margin-top: 0;
  color: DodgerBlue;
  text-align: center;
}

.tag {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background-color: hsl(210, 100%, 92%);
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 600;
}
```

## References

- [MDN: CSS first steps](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics)
- [MDN: The box model](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Box_model)
- [W3Schools: CSS Tutorial](https://www.w3schools.com/css/)
