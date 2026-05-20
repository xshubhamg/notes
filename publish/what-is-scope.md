---
title: What is Scope?
description: An introduction to JavaScript scope, explaining how Engine, Compiler, and Scope collaborate to resolve variables across nested scopes.
date: 2026-05-19
tags: [JavaScript, JIT, Scope]
published: true
slug: what-is-scope
---

# What is Scope?

The ability to store values invariables, and later retrieve or modify those values is what gives a program *state*. Without such a concept, a program could perform some tasks, but they would be extremely limited and uninteresting.

This inclusion of variables into computer programs raise some very important questions such as: *where do those variables live?*, *how does program find them when it needs them?*

The concept which answer these question is known as **Scope**, Scope is a set of rules which deals with storing variables and finding those variables at a later time.

## Understanding Scope

To understand scope we need to think of the process in terms of a conversation between _Engine_, _Compiler_ & _Scope_ itself.

- _Engine_ is responsible for start-to-finish compilation and execution of our javascript program.

- _Compiler_ handles all the works of parsing and code-generation.

- _Scope_ collects and maintains a look-up list of all the declared variables, and enforces a strict set of rules as to how these are accessible to currently executing code.

## Compiler talk

Let's take an example of the variable assignment `var a = 2;` to demonstrate the processes performed by both the compiler at compile time and the egine at the execution time.

- The first thing Compiler will do with this program is perform lexing to break it down into tokens, which it will then parse into a tree.

- At the code-generation step, compiler asks Scope to see if a variable `a` already exists for that particular scope collections. If so, Compiler ignores declaration and moves on. Otherwise, compiler asks scope to declare a new variable called `a` for that scope collection.

- Compiler then produces code for Engine to later execute, to handle the `a=2` assignment. The code Engine runs will first ask Scope if there is a variable called `a` accessible in the current scope collection. If so, Engine use that variable. If not, Engine looks elsewhere.

## Nested scope

There's usually more than one scope that we have consider. Just as a block or function is nested inside another block or function scopes are nested inside other scopes. So, if a variable cannot be found in the immediate scope, Engime consults the next outercontaining scope, continuing until is found or until outermost scope has been reached..

The simple rules for traversing nested scope: _Engine starts at the currently executing scope, looks for the variable there, then if not found, keeps going up one level, and so on. If ther outermost global scope is reached, the search stops, whether it finds the variable or not._
