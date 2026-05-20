---
title: JS Compiler Theory
description: How JavaScript compilation works, from lexing and parsing to LHS/RHS lookups and ReferenceError vs TypeError.
date: 2026-05-19
tags: [JavaScript, Engine, compiler, Intepreter]
published: true
slug: js-compiler-theory
---

# Compiler Theory

A Lot of JavaScript developer don't this or doesn't pay much attention to the fact that, Even though *JavaScript* falls under the general category of "dynamic" or "interpreted" languages, it is in fact a compiled language. *It is in fact a compiled language*.

It is *not* compiled well in advance, like many traditionally compiled languages, nor are the results off compilation portable among various distributed systems. But, the JavaScript engine performs many of the same steps in more sophisticated ways than we may commonly be aware.

In traditional compiled-language process, a chunk of source code, your program, will undergo typically three steps before it is executed, roughly called "compilation":

- *Tokenizing/Lexing*: Breaking uo a string of characters into meaningful chunks, called tokens.

- *Parsing*: Taking a stream(array) of tokens and turning it into a tree of nested elements, which collectively represent the grammatical structure of the program.This tree is called an "AST" (*abstract syntax tree*).

- *Code Generation*: The process of taking an AST and turning it into executable code. This part varies greatly depending on the language, the platform it's targeting, and so on.


> [!INFO]
> The JavaScript engine is vastly more complex than just those steps, are most other languages compilers. For instance, In the prcess of parsing and code-generation, there are certain steps to optimize the performance fo the execution.

For JavaScript, the compilation that occurs happens, in many cases, mere microseconds(or less) before the code executeion. To ensure the fastest performance, _JS engines_ use all kinds of tricks (like JITs, which lazy compile and even hot recompile, etc).

## Compiler Speak

At the time of code execution, `JavaScript Engine` asks Scope to look up to see the declaration of variables before using performing any kind of operations, There are two types of look-up Engine performs which can affect the outcome of the look-up. 

- **Left Hand Side(LHS)**: LHS look-up means _"Who's the target of the assignment"_. In this type of look-up, Scope look for `if there is exist this variable in the scope or not`. LHS search for the variable accessibility.

- **Right Hand Side(RHS)**: RHS look-up means _"Who's the source of the assignment (RHS)"_. RHS search if the value of the look-up variable is accessible in the current scope or not.

### Example

```js
function foo(a) {
  var b = a;
  return a + b;
}

var c = foo(2);
```

In the above code block:

1. There are 3 different LHS look-up. (`a foo's parameter`, `c`, `b`)
2. Also, There are 4 different RHS look-up. (`foo call`, `assigning a to b`, `a in return`, `b in return`);

## Errors

- If an RHS look-up fails to ever find a variable, anywhere in the nested scopes, this results in a `ReferenceError` begin thrown by the engine.
- In contrast, if the engine is performing an LHS look-up, and it arrives at the top floor without finding, if the program is running in "Strict mode", then the global scope will create a new variable of the name in global scope, and hand it back to Engine.
- "Strict Mode" disallows the automatics/implicit global variable creation. In that case, look-up and engine would throw a `RefrenenceError` similarly to the RHS case.
- If a variable is found for an RHS look-up, but you try to do something with its value that is impossible, such as trying to executes functions a nonfunction value, or referenece a property on a null or undefined value, then Engine throws a different kind of error, called a TypeError.

> [!INFO]
> `ReferenceError` is scope resolution-failure related, whereas `TypeError` implies that scope resolution was successfull, but that there was an illegal/impossible action attempted against the result.
