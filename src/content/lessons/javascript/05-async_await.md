---
course: javascript
slug: async-await
title: Asynchronous JS, Async & Await
description: "Learn what asynchronous code means, and how to use async and await to work with tasks that take time, like fetching data."
---

So far, everything you've written has been **synchronous** — JavaScript runs your code line by line, top to bottom, waiting for each line to finish before moving to the next.

Imagine ordering food at a fast-food counter. In a **synchronous** world, the cashier takes your order, then stands frozen at the register until your burger is cooked — everyone behind you waits forever.

In an **asynchronous** world, the cashier takes your order, gives you an order number, and immediately takes the next customer's order while the kitchen prepares your food in the background. When it's ready, they call your number.

JavaScript works the same way — it can start a long task (like fetching data from an API) and keep running the rest of your code without freezing the page.

## `async` and `await`

### The `async` keyword

Placing `async` in front of a function means the function will always return a **Promise**.

```javascript
async function getGreeting() {
  return "Hello, Students!";
}

getGreeting().then((msg) => console.log(msg)); // "Hello, Students!"
```

### The `await` keyword

`await` pauses execution inside an `async` function until a Promise finishes — without freezing the rest of your code.

```javascript
async function fetchUserData() {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return { username: "ojasvi" };
}

async function displayUser() {
  console.log("Fetching user data..."); // prints immediately

  const user = await fetchUserData(); // waits ~2 seconds here

  console.log("User received:", user.username);
}

displayUser();

console.log("This logs immediately, because async JS doesn't block!");
```

> [!NOTE]
> `fetchUserData` uses `setTimeout` just to simulate a real API call taking time — a real fetch request would replace that.

## Handling errors with `try...catch`

Asynchronous tasks can fail (bad network, server down). Handle errors with `try...catch`.

```javascript
async function getWeatherData() {
  try {
    const response = await fetch("https://api.weather.com/invalid-endpoint");
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Oops! Something went wrong:", error);
  }
}

getWeatherData();
```

## Try it yourself

1. Given a function `checkInventory()` that returns a Promise, write an `async` function called `orderItem()` that uses `await` to wait for it and logs `"Item ordered successfully!"`.
2. Wrap `orderItem()`'s logic in a `try...catch` so that if the inventory check fails, it logs `"Out of stock!"` instead of crashing.
