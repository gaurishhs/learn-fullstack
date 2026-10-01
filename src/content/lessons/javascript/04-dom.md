---
course: javascript
slug: dom
title: The DOM
description: "Learn how JavaScript finds, changes, creates and reacts to things on your web page."
---

## The DOM

Until now, JavaScript has lived in the console. Boring, right? Nobody visits a website to stare at `console.log`.

The **DOM** is how JavaScript reaches into your web page and moves things around: change text, add stuff, react to clicks, read what the user typed.

## What is the DOM?

**DOM** stands for **Document Object Model**. Fancy name, simple idea: when the browser loads your HTML, it turns every tag into a JavaScript **object** you can grab and change.

```html
<body>
  <h1 id="title">Hello</h1>
  <p class="note">I am a paragraph</p>
</body>
```

Think of your page as a family tree. `body` is the parent, `h1` and `p` are its kids. JavaScript can visit any of them.

> [!NOTE]
> Put your `<script>` tag at the **bottom of the `<body>`** (or add `defer` to it). If the script runs before the HTML exists, JavaScript can't find anything and you get `null`.

```html
<body>
  <h1 id="title">Hello</h1>

  <script src="script.js"></script>
</body>
```

## Finding elements

Before you can change something, you have to **grab it**. Like pointing at something and saying "that one!"

### The two you'll use the most

```javascript
// Grab ONE element by its id
const title = document.getElementById("title");

// Grab the FIRST element that matches a CSS selector
const note = document.querySelector(".note");
```

`querySelector` uses the same selectors as CSS:

| You want | Write this |
|---|---|
| An element with id `title` | `"#title"` |
| An element with class `note` | `".note"` |
| A tag | `"p"` |

> [!NOTE]
> Forgetting the `#` or the `.` is the #1 reason "it's not working". `querySelector("title")` looks for a `<title>` tag, not your id!

### Grabbing many elements

`querySelector` gives you only the **first** match. To get **all** matches, use `querySelectorAll`. It gives you a list, and you already know how to loop over lists:

```javascript
const allNotes = document.querySelectorAll(".note");

allNotes.forEach(function (note) {
  console.log(note.textContent);
});
```

### What if nothing is found?

If the selector matches nothing, you get `null`. Then any line that uses that element will crash with an error like *"Cannot read properties of null"*. If you see that, check your selector and check your script tag position.

## Changing text: `textContent` vs `innerHTML`

Once you've grabbed an element, you can change what's inside it.

```javascript
const title = document.getElementById("title");

title.textContent = "Hello, world!";
```

There are two ways to change what's inside:

| | What it does | Example |
|---|---|---|
| `textContent` | Treats everything as **plain text** | `"<b>Hi</b>"` shows the actual symbols `<b>Hi</b>` |
| `innerHTML` | Treats it as **HTML** | `"<b>Hi</b>"` shows a bold **Hi** |

```javascript
const box = document.querySelector("#box");

box.textContent = "<b>Hi</b>"; // page shows: <b>Hi</b>
box.innerHTML = "<b>Hi</b>";   // page shows: Hi (in bold)
```

> [!NOTE]
> Default to `textContent`. It's simpler and safer. Only use `innerHTML` when you really want to write HTML tags yourself, and **never** put text typed by a user into `innerHTML`.


## Creating new elements

So far we only changed things that already existed. But what if we want to **make new stuff** from JavaScript, like a new item in a list?

It takes 3 steps: **create it → fill it → add it to the page**.

```html
<ul id="list"></ul>
```

```javascript
const list = document.querySelector("#list");

// 1. Create a new <li> (it exists, but it's floating in the void)
const item = document.createElement("li");

// 2. Fill it
item.textContent = "Buy milk";

// 3. Add it to the page
list.appendChild(item);
```

> [!NOTE]
> `createElement` alone does **nothing visible**. The element only shows up once you attach it with `appendChild`.

And to get rid of an element:

```javascript
item.remove();
```

## Events: making the page react

An **event** is something that happens on the page: a click, a key press, a form submit. An **event listener** is you telling JavaScript: *"hey, when this happens, run this function."*

```html
<button id="btn">Click me</button>
<p id="message"></p>
```

```javascript
const btn = document.querySelector("#btn");
const message = document.querySelector("#message");

btn.addEventListener("click", function () {
  message.textContent = "You clicked me!";
});
```

The recipe is always:

```javascript
element.addEventListener("eventName", functionToRun);
```

Some events you'll meet: `"click"`, `"input"` (every time the user types), `"submit"` (a form is sent).

### The event object

JavaScript hands your function an **event object** with details about what just happened. Most people name it `event` (or `e`).

```javascript
btn.addEventListener("click", function (event) {
  console.log(event); // lots of info about the click
});
```

You won't need most of it right now. We only need it for one thing, which we'll get to in a moment.

## Reading what the user typed: `input.value`

```html
<input id="nameInput" type="text" placeholder="Your name" />
<button id="greetBtn">Greet me</button>
<p id="greeting"></p>
```

```javascript
const nameInput = document.querySelector("#nameInput");
const greetBtn = document.querySelector("#greetBtn");
const greeting = document.querySelector("#greeting");

greetBtn.addEventListener("click", function () {
  const name = nameInput.value; // what's typed in the box right now
  greeting.textContent = "Hello, " + name + "!";
});
```

> [!NOTE]
> `input.value` is **always a string**, even if the user types a number. `"5" + "5"` is `"55"`, not `10`. Use `Number(input.value)` if you need real math.

You can also clear the box after using it:

```javascript
nameInput.value = "";
```

## Forms and `event.preventDefault()`

Here's a fun surprise. When you submit a `<form>`, the browser's default behavior is to **refresh the whole page**. Your JavaScript runs for a split second, then poof, gone.

`event.preventDefault()` says: *"Browser, chill. I've got this. Don't refresh."*

```html
<form id="nameForm">
  <input id="nameInput" type="text" placeholder="Your name" />
  <button type="submit">Greet me</button>
</form>
<p id="greeting"></p>
```

```javascript
const form = document.querySelector("#nameForm");
const nameInput = document.querySelector("#nameInput");
const greeting = document.querySelector("#greeting");

form.addEventListener("submit", function (event) {
  event.preventDefault(); // stop the page refresh

  greeting.textContent = "Hello, " + nameInput.value + "!";
});
```

> [!NOTE]
> Listen for `"submit"` on the **form**, not `"click"` on the button. That way pressing Enter works too.

## Putting it all together: adding items to a list

Everything from this page in one place. This example only **creates** (adds) items. Editing and deleting are not covered here, since you'll get the full picture in the project.

```html
<form id="todoForm">
  <input id="todoInput" type="text" placeholder="Add a task" />
  <button type="submit">Add</button>
</form>
<ul id="todoList"></ul>
```

```javascript
const form = document.querySelector("#todoForm");
const input = document.querySelector("#todoInput");
const list = document.querySelector("#todoList");

form.addEventListener("submit", function (event) {
  event.preventDefault();               // don't refresh

  const text = input.value;             // read what was typed
  if (text === "") {
    return;                             // ignore empty tasks
  }

  const item = document.createElement("li"); // create
  item.textContent = text;                   // fill
  list.appendChild(item);                    // add to page

  input.value = "";                     // clear the box
});
```

## Common mistakes

- Forgetting `#` (id) or `.` (class) in `querySelector`.
- Writing `input.value` **once** at the top and expecting it to update. Read it **inside** the event function, when you need it.
- Using `querySelector` when you needed `querySelectorAll` (you only get the first match).
- Creating an element with `createElement` and forgetting `appendChild`.
- Forgetting `event.preventDefault()` on a form, so the page refreshes.

## Try it yourself

1. Make an `<h1>` and a button. When the button is clicked, change the `<h1>` text to anything you like.
2. Make an input and a button. When clicked, show what the user typed in a `<p>` below.
3. Make an input and a `<p>`. Use the `"input"` event so the `<p>` shows what the user is typing **live**, letter by letter.
4. Make an `<ul>` with 3 `<li>` items. Use `querySelectorAll` and `forEach` to turn every item's text to uppercase.
