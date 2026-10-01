---
course: javascript
slug: js-core
title: JavaScript Core Basics
description: "Your first JavaScript file: syntax, variables, if/else and loops."
---

Welcome to JavaScript! 🎉

HTML builds the page, CSS styles it, and **JavaScript makes it do things**: react to clicks, check what you typed, load new data without refreshing.

Today we cover the basics: storing values, making decisions, and repeating code.

## Where does JavaScript live?

In an HTML file, using a `<script>` tag. You can write code inside it, or (better) keep it in its own file.

```html
<body>
  <h1>My first JS page</h1>

  <script src="script.js"></script>
</body>
```

Then in `script.js`:

```javascript
console.log("Hello, world!");
```

Open the page in your browser, press **F12** (or right click → Inspect), and click the **Console** tab. You should see `Hello, world!` there.

> [!NOTE]
> `console.log()` prints things to the console so you can see what your code is doing. When something isn't working, `console.log` the variable and check its value.

## Syntax: the rules of the language

```javascript
// This is a comment. JavaScript ignores it.

console.log("Hi");   // Each instruction usually ends with a semicolon
console.log("Bye");
```

- **Comments** (`//`) are notes to yourself. Use them!
- **Semicolons** `;` mark the end of an instruction. Write them, it's a good habit.
- **Case matters.** `name`, `Name` and `NAME` are three different things.
- **Code runs top to bottom**, one line at a time.
- **Text goes in quotes.** `"Hello"` is text, `Hello` is JavaScript looking for something called Hello.

## Variables

A **variable** is a labeled box. You put a value inside and use the label to get it back later.

```javascript
let age = 20;
console.log(age); // 20
```

This means: make a box called `age` and put `20` in it.

### `let` and `const`

```javascript
let score = 0;          // can change later
score = 10;             // ✅ fine

const birthYear = 2005; // can never change
birthYear = 2006;       // ❌ Error!
```

| Keyword | Use it when |
|---|---|
| `const` | The value won't change (use this **by default**) |
| `let` | The value will change |

> [!NOTE]
> You might see `var` in old tutorials. For modern JavaScript, use `let` and `const`.

Name variables in **camelCase** (`firstName`, `totalScore`), with no spaces, not starting with a number, and with names that explain themselves (`price`, not `x`).

## Data types

Not everything is the same kind of thing. JavaScript has different **types**:

```javascript
const name = "Alex";       // String: text, always in quotes
const age = 20;            // Number: whole or decimal
const isStudent = true;    // Boolean: only true or false
let nothingYet;            // undefined: a box with nothing put in it
```

> [!NOTE]
> `"5"` (in quotes) is **text**. `5` is a **number**. `"5" + "5"` gives `"55"`, while `5 + 5` gives `10`.

### Gluing text together

```javascript
const name = "Alex";
const age = 20;

console.log("Hi, I'm " + name + " and I'm " + age);  // old way
console.log(`Hi, I'm ${name} and I'm ${age}`);       // nicer way
```

Backticks let you put variables straight into text with `${ }`.

## Operators

### Math

```javascript
console.log(10 + 3); // 13
console.log(10 - 3); // 7
console.log(10 * 3); // 30
console.log(10 / 3); // 3.333...
console.log(10 % 3); // 1  (remainder after dividing)
```

Updating a variable:

```javascript
let score = 0;

score = score + 5;  // 5
score += 5;         // 10 (shortcut for the line above)
score++;            // 11 (add 1)
```

### Comparing

Comparisons give you `true` or `false`.

```javascript
console.log(5 > 3);    // true
console.log(5 >= 5);   // true
console.log(5 === 5);  // true  (is it equal?)
console.log(5 !== 3);  // true  (is it NOT equal?)
```

> [!NOTE]
> `=` **stores** a value in a variable. `===` **checks** if two things are equal. They do different jobs. Also, use `===` (three equals), not `==`.

### Combining conditions

| Operator | Meaning | Example |
|---|---|---|
| `&&` | AND: both must be true | `age > 18 && hasTicket` |
| `\|\|` | OR: at least one is true | `isWeekend \|\| isHoliday` |
| `!` | NOT: flips true/false | `!isRaining` |

## If / else: making decisions

Code normally runs every line. `if` lets it **choose**.

```javascript
const age = 16;

if (age >= 18) {
  console.log("You can vote!");
} else {
  console.log("Not yet, hang in there.");
}
```

For more than two options, add `else if`:

```javascript
const score = 72;

if (score >= 90) {
  console.log("Grade A");
} else if (score >= 75) {
  console.log("Grade B");
} else {
  console.log("Keep practicing!");
}
```

JavaScript checks from the top and **stops at the first one that's true**. So order matters!

## Loops: repeating code

What if you had to print "Hello" 100 times? You wouldn't write 100 lines. A loop repeats code for you.

### The `for` loop

```javascript
for (let i = 1; i <= 5; i++) {
  console.log("Round " + i);
}
```

This prints `Round 1` up to `Round 5`. The three parts inside the brackets:

| Part | What it does | In our example |
|---|---|---|
| Start | Where to begin | `let i = 1` |
| Condition | Keep going while this is true | `i <= 5` |
| Step | What to do after each round | `i++` (add 1) |

### The `while` loop

Use `while` when you don't know how many rounds you need, just when to stop.

```javascript
let energy = 3;

while (energy > 0) {
  console.log("Energy: " + energy);
  energy--;
}
```

> [!NOTE]
> If the condition never becomes false, the loop runs forever and freezes your browser tab. Here, `energy--` is what makes it stop. Always make sure something inside the loop changes.

## Functions

You'll see functions everywhere from here on. A **function** is a block of code with a name that you can run whenever you want, like a saved recipe.

```javascript
function sayHello(name) {
  console.log(`Hello, ${name}!`);
}

sayHello("Alex");   // Hello, Alex!
sayHello("Sam");    // Hello, Sam!
```

- `function sayHello` **creates** the recipe (nothing runs yet)
- `(name)` is what you hand to it, called a **parameter**
- `sayHello("Alex")` **runs** it

Functions can also **give something back** with `return`:

```javascript
function add(a, b) {
  return a + b;
}

const total = add(2, 3);
console.log(total); // 5
```

## Putting it all together

A function, a loop and an if/else working together:

```javascript
function checkNumber(n) {
  if (n % 2 === 0) {
    return `${n} is even`;
  } else {
    return `${n} is odd`;
  }
}

for (let i = 1; i <= 5; i++) {
  console.log(checkNumber(i));
}
```

## Common mistakes

- Using `=` when you meant `===`.
- Forgetting quotes around text (`Hello` vs `"Hello"`).
- Trying to change a `const`.
- Mixing up upper and lower case (`myName` vs `myname`).
- A loop that never stops.
- Forgetting a closing `}` or `)`. Every opener needs a closer!

## Try it yourself

1. Create a variable `favoriteFood` and print `"My favorite food is ..."` using backticks.
2. Make a variable `temperature`. Print `"Take a jacket"` if it's below 20, otherwise `"T-shirt weather"`.
3. Use a `for` loop to print the numbers 1 to 10.
4. Use a `for` loop to print only the **even** numbers from 1 to 20. (Hint: `i % 2 === 0`)
5. Write a function `isAdult(age)` that returns `true` if age is 18 or more, and `false` otherwise.
