---
course: javascript
slug: objects
title: Understanding Objects
description: "Learn how JavaScript objects store data as key-value pairs, and how to access, modify, and add methods to them."
---

Objects are a common way to store data, but unlike arrays, they don't use numbered indexes — they use **keys** and **values**.

```javascript
{ name: "Sallu bhai" }
```

Here, `name` is the key, and `"Sallu bhai"` is the value.

## Creating an Object

```javascript
const student = {
  name: "Sallu",
  status: "unmarried",
  favAnimal: "blackbuck",
  courses: ["driving", "acting"]
};
```

## Accessing Object Properties

To access an object's data, we use **dot notation** (`.`).

```javascript
console.log(student.status);    // "unmarried"
console.log(student.courses[0]); // "driving"
```

## Adding and Modifying Properties

Objects are mutable — you can add new keys or change existing ones.

```javascript
const car = { brand: "Mahindra", model: "XUV" };

// Modify an existing property
car.model = "Thar";

// Add a new property
car.year = 2022;

console.log(car); // { brand: "Mahindra", model: "Thar", year: 2022 }
```

## Nested Objects

Objects can contain other objects. This is useful when you want to group related information together.

```javascript
const student = {
  name: "Alex",
  age: 20,
  address: {
    city: "Noida",
    pincode: 201301
  }
};

console.log(student.name);            // "Alex"
console.log(student.address.city);    // "Noida"
console.log(student.address.pincode); // 201301
```

## Methods in Objects

Objects can also hold functions. When a function belongs to an object, we call it a **method**.

```javascript
const user = {
  username: "coder123",
  greet: function () {
    console.log(`Hello, welcome back ${this.username}!`);
  }
};

user.greet(); // "Hello, welcome back coder123!"
```

> [!NOTE]
> `this` inside a method refers to the object the method belongs to — here, `this.username` means `user.username`.

## Try it yourself

1. **Profile Builder:** Create an object named `smartphone` with keys for `brand`, `model`, `storage`, and `price`. Print a sentence using these values (e.g., "I have a 128GB iPhone.").
2. **Property Mutation:** Update `smartphone`'s `price` to a lower value, and add a new boolean property called `is5G`.
3. **Object Method:** Create an object named `calculator` with properties `num1` and `num2`, and a method called `add` that returns their sum using `this`.
