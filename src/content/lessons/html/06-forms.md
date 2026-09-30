---
course: html
slug: forms-basics
title: Basic Forms
description: "Forms let users enter information and send it to a website. Here's how to build a basic one."
---

## The form tag

Everything a user fills out and submits goes inside a `<form>` tag.

```html live
<form>
  <p>Form content goes here.</p>
</form>
```

## Label and input

`<input>` creates a field for the user to type into. `<label>` gives that field a visible name. Connect them using `for` on the label and a matching `id` on the input.

```html live
<form>
  <label for="username">Username</label>
  <input type="text" id="username" name="username">
</form>
```

## What does it mean?

- `id="username"` on the input matches `for="username"` on the label — this links them together, so clicking the label focuses the input.
- `name="username"` is what identifies this field when the form is submitted.
- `type="text"` makes it a plain text field. Other common types: `email`, `password`, `number`.

## Placeholder

`placeholder` shows a light hint inside the field before the user types anything.

```html live
<form>
  <label for="email">Email</label>
  <input type="email" id="email" name="email" placeholder="you@example.com">
</form>
```

> [!NOTE]
> `placeholder` disappears once you start typing — never use it as a replacement for `<label>`.

## More field types

Not everything is a single-line `<input>`. A few other common fields:

```html live
<form>
  <label for="bio">Bio</label>
  <textarea id="bio" name="bio" placeholder="Tell us about yourself"></textarea>

  <label for="subscribe">
    <input type="checkbox" id="subscribe" name="subscribe">
    Subscribe to updates
  </label>
</form>
```

## What does it mean?

- `<textarea>` is for longer, multi-line text — unlike `<input>`, it has an opening and closing tag, and whatever's typed goes between them.
- `type="checkbox"` gives a box the user can tick on or off, useful for yes/no choices.

## Radio buttons

Checkboxes let the user pick any number of options. Radio buttons let them pick only one.

```html live
<form>
  <label for="free"><input type="radio" id="free" name="plan" value="free"> Free</label>
  <label for="pro"><input type="radio" id="pro" name="plan" value="pro"> Pro</label>
</form>
```

> [!NOTE]
> Radio buttons in the same group must share the same `name` — that is what makes picking one un-pick the others. Each still needs its own `id` and `value`.

## Dropdown menus

`<select>` creates a dropdown list. Each choice goes inside an `<option>`.

```html live
<form>
  <label for="country">Country</label>
  <select id="country" name="country">
    <option value="india">India</option>
    <option value="usa">United States</option>
    <option value="uk">United Kingdom</option>
  </select>
</form>
```

> [!NOTE]
> The text between the `<option>` tags is what the user sees. The `value` is what gets sent when that choice is picked.

## Required fields

Add `required` to a field and the browser will not submit the form until it is filled in.

```html live
<form>
  <label for="email">Email</label>
  <input type="email" id="email" name="email" required>
  <button type="submit">Sign up</button>
</form>
```

## Submit button

`<button type="submit">` submits the form when clicked.

```html live
<form>
  <label for="email">Email</label>
  <input type="email" id="email" name="email">
  <button type="submit">Sign up</button>
</form>
```

> [!NOTE]
> `type="submit"` is what makes it submit the form. Without it, a `<button>` inside a form does nothing by default.

## Putting it together

A form usually has more than one field, and a button to submit it. Here's a simple sign-up form using everything above.

```html live
<form>
  <label for="username">Username</label>
  <input type="text" id="username" name="username" placeholder="e.g. adwait123">

  <label for="email">Email</label>
  <input type="email" id="email" name="email" placeholder="you@example.com">

  <label for="password">Password</label>
  <input type="password" id="password" name="password" placeholder="Enter a password">

  <label for="bio">Bio</label>
  <textarea id="bio" name="bio" placeholder="Tell us about yourself"></textarea>

  <label for="subscribe">
    <input type="checkbox" id="subscribe" name="subscribe">
    Subscribe to updates
  </label>

  <button type="submit">Sign up</button>
</form>
```

## Try it yourself

Add another field for phone number, with its own label, id, name, and placeholder.