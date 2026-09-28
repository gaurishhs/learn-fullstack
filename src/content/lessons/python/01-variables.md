---
course: python
slug: variables
title: Variables
description: "A variable is a named place to keep information. When your program needs that information later, it can look it up by name."
---

## Save a value

Variables give values a name so you can reuse them later. Use `const` when the name will keep pointing to the same value, and `let` when you plan to assign it a new value.

Change the student name in the editor and press **Run**. The output will update with your greeting

## Choose a name

Choose names that explain what a value represents. Here, `student` holds a name and `greeting` holds the message built from it.

Python variables use a similar idea. Run this example in your browser with Pyodide and see the output in a terminal-style panel:

```python live
student = "Alex"
greeting = f"Hello, {student}!"

print(greeting)
```

## Try it yourself

Change the student's name and the greeting. Then try making a second variable for a favorite color.
