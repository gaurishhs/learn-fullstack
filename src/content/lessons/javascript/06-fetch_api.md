---
course: javascript
slug: fetch-api
title: The Fetch API & Working with APIs
description: "Learn what JSON is, what an API is, and how to use the Fetch API to get data from a server."
---

Frontend is (almost) done — now we need to connect it to a backend. The **Fetch API** comes to the rescue, but first we need to understand JSON.

## What is JSON?

**JSON** stands for **JavaScript Object Notation**. Think of it as a universal language computers use to send data to each other over the internet — data from servers is usually received in this format.

### What does JSON look like?

JSON looks almost identical to a JavaScript object, but with a few strict rules.

```json
{
  "id": 1,
  "name": "Alex Johnson",
  "email": "alex@example.com",
  "isPremiumMember": true,
  "scores": [98, 75, 88]
}
```

### JSON rules to remember

| Rule | JavaScript Object | JSON |
|---|---|---|
| Keys | Can be unquoted (`name: "Alex"`) | Must be double-quoted (`"name": "Alex"`) |
| Strings | Single or double quotes | Must use double quotes only |
| Trailing commas | Allowed | Not allowed |
| Functions | Allowed as values | Not allowed |

### Converting between JSON and JS

Since JSON is just text, you need to convert it to use it in JavaScript:

- **`JSON.parse()`** — converts a JSON string into a JavaScript object
- **`JSON.stringify(object)`** — converts a JavaScript object into a JSON string (so you can send it over the network)

```javascript
// A raw JSON string
const jsonString = '{"name": "Alex", "score": 98}';

// Convert it to a JS object so we can use it
const playerData = JSON.parse(jsonString);
console.log(playerData.name); // "Alex"

// Convert a JS object back into a JSON string
const updatedData = { name: "Alex", score: 100 };
console.log(JSON.stringify(updatedData)); // '{"name":"Alex","score":100}'
```

## What is an API?

An **API** (Application Programming Interface) is like a digital waiter at a restaurant. You (the browser) place an order (a request) — the waiter (the API) takes it to the kitchen (the server), grabs your food, and brings it back to your table.

The **Fetch API** is a built-in browser tool that lets you make requests to servers using JavaScript.

> [!NOTE]
> Try it first: paste `https://jsonplaceholder.typicode.com/todos/1` into your browser's address bar. That raw JSON is exactly what `fetch` will bring back into your code.

## Making your first GET request

A `GET` request is used to retrieve data from a server. Here's a basic fetch request using `async`/`await`:

```javascript
async function getJoke() {
  try {
    // 1. Fetch data from a public joke API
    const response = await fetch("https://v2.jokeapi.dev/joke/Programming?type=single");

    // 2. Check if the response was successful
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // 3. Convert the response into usable JSON data
    const data = await response.json();

    // 4. Do something with the data
    console.log("Here is your joke:", data.joke);
  } catch (error) {
    console.error("Failed to fetch joke:", error);
  }
}

getJoke();
```

### Breaking down the fetch line

```javascript
const response = await fetch("https://v2.jokeapi.dev/joke/Programming?type=single");
```

- **`fetch(...)`** — sends the request (places the order)
- **the URL** — where to send it (which restaurant)
- **`await`** — wait here until the answer comes back
- **`response`** — what came back (the package, not opened yet)

### Why two `await`s?

- `await fetch(...)` → the package **arrives** (`response`)
- `await response.json()` → you **open** the package (`data`)

Both take time, so both need `await`.

## What's actually inside a response?

`response` isn't the data itself — it's a whole object with extra information attached. The data has to be unlocked separately.

- **`response.status`** — a number telling you what happened
- **`response.ok`** — `true` or `false`, based on whether `status` is in the success range (200–299)
- **`response.json()`** — unpacks the actual body of the response into a JavaScript object you can use

Common status numbers:

| Status | Meaning |
|---|---|
| `200` | OK — it worked |
| `404` | Not found — wrong URL |

> [!NOTE]
> `response.ok` is just a shortcut for checking `status` yourself — always check one of these before trusting the data.

Here's roughly what `data` looks like once you log it from `getJoke()`:

```json
{
  "category": "Programming",
  "type": "single",
  "joke": "Why do programmers prefer dark mode? Because light attracts bugs.",
  "id": 231
}
```

That's why `data.joke` in the example works — it's just grabbing one key from this object.

## Showing the data on the page

`console.log` is only for you. To show the joke to the user, put it on the page:

```html
<button id="jokeBtn">Get a joke</button>
<p id="jokeText"></p>
```

```javascript
async function showJoke() {
  try {
    const response = await fetch("https://v2.jokeapi.dev/joke/Programming?type=single");

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    document.getElementById("jokeText").textContent = data.joke;
  } catch (error) {
    document.getElementById("jokeText").textContent = "Could not load a joke.";
  }
}

document.getElementById("jokeBtn").addEventListener("click", showJoke);
```

## Common mistakes

- Forgetting `await` before `fetch(...)` or `response.json()` — you get a "pending" object instead of your data.
- Logging `response` instead of `data` — you see a big object, not your joke.
- Not checking `response.ok` — a `404` looks like a success.
- Typos in the URL.

> [!NOTE]
> You'll learn how to *send* data to a server with a `POST` request during the Python/backend sessions — for now, `GET` is what lets your page pull in and display data.

## Try it yourself

1. Use the public API `https://jsonplaceholder.typicode.com/todos/1`. Write an async function called `fetchTodo()` that fetches this item and logs its `title` and `completed` status.
2. Try fetching an intentionally wrong URL (e.g. `.../todos/999999`). Check `response.ok` and throw an error if the request fails.
3. Log `response.status` for both a working and a broken URL, and compare the two numbers you get back.
