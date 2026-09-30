---
course: css
slug: interaction-states
title: Interaction and States
description: "Learn how to style elements based on user interaction, using hover, focus, active, transitions, cursor, and form styling."
---

So far every style has looked the same all the time. But elements can also change style based on what the user is doing, like hovering the mouse over a button, or clicking into an input.

This is done using pseudo-classes.

## What is a pseudo-class?

A pseudo-class is added to a selector with a colon. It selects an element only when it is in a certain state.

```css
selector:pseudo-class {
  property: value;
}
```

## :hover

Applies while the mouse is over the element.

```css
button {
  background-color: DodgerBlue;
  color: white;
}

button:hover {
  background-color: royalblue;
}
```

Move your mouse over the button, and the background color changes. Move it away, and it goes back to normal.

## :focus

Applies while an element is selected, usually by clicking into it or tabbing to it with the keyboard. This is mostly used on form inputs.

```css
input:focus {
  outline: 2px solid DodgerBlue;
  border-color: DodgerBlue;
}
```

Click into the input, and the outline appears. Click somewhere else, and it disappears again.

## :active

Applies for the short moment while an element is being clicked, between mouse down and mouse up.

```css
button:active {
  background-color: navy;
}
```

## transition

Without a transition, style changes on hover or focus happen instantly, in a single frame. The transition property makes that change happen smoothly over time instead.

```css
transition: property duration timing-function;
```

```css
button {
  background-color: DodgerBlue;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: royalblue;
}
```

Now the color fades from one shade to the other over 0.3 seconds, instead of snapping instantly.

You can transition more than one property at once, separated by commas.

```css
button {
  transition: background-color 0.3s ease, transform 0.2s ease;
}

button:hover {
  background-color: royalblue;
  transform: scale(1.05);
}
```

## cursor

Changes what the mouse pointer looks like when it is over an element.

```css
button {
  cursor: pointer;
}
```

Buttons and links get the pointer cursor automatically. But a div or span acting like a button does not, so you need to set it yourself.

```css
.clickable-card {
  cursor: pointer;
}
```

| Value | Meaning |
| --- | --- |
| `default` | the normal pointer arrow |
| `pointer` | a hand, tells the user this is clickable |
| `not-allowed` | a blocked circle, tells the user this is disabled |

## Styling form elements

By default, inputs, textareas, and buttons look plain and inconsistent across browsers. A few properties clean this up.

```css
input,
textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-family: inherit;
}

button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  background-color: DodgerBlue;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

button:hover {
  background-color: royalblue;
}
```

Note the `font-family: inherit` on the input and textarea. Form elements do not automatically use the same font as the rest of the page, so without this line they can look like they belong to a different site.

## Putting it together

A button with hover, active, and a smooth transition, plus a styled input with a focus state.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Interaction Example</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        padding: 2rem;
      }

      input {
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 6px;
        font-family: inherit;
      }

      input:focus {
        outline: 2px solid DodgerBlue;
        border-color: DodgerBlue;
      }

      button {
        padding: 0.5rem 1rem;
        margin-left: 0.5rem;
        border: none;
        border-radius: 6px;
        background-color: DodgerBlue;
        color: white;
        cursor: pointer;
        transition: background-color 0.2s ease;
      }

      button:hover {
        background-color: royalblue;
      }

      button:active {
        background-color: navy;
      }
    </style>
  </head>
  <body>
    <input type="text" placeholder="Your name" />
    <button>Save</button>
  </body>
</html>
```
