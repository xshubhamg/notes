---
title: Prototypal Inheritance
description: An introduction to JavaScript prototypal inheritance, explaining how objects inherit properties via the prototype chain, the behavior of the for...in loop, and how 'this' operates with prototypes.
date: 2026-07-08
tags: [JavaScript, OOP, Prototypes]
published: true
slug: prototypal-inheritance
---

# `Prototypal inheritance`

In JavaScript, objects have a special hidden property `Prototype`, that is either `null` or references
another object. That object is called "a prototype".

When we read a property from `object`, and it's missing, JavaScript automatically takes it from the
prototype. In programming, this is called **prototypal inheritance**.

There are many ways to set `prototype` of an object, one of them is to use special name `__proto__`,
like this:

```js
let animal = {
  eats: true
};

let dog = {
  barks: true
};

dog.__proto__ = animal; // sets dog.[[Prototype]] = animal
```

Now if we read a property from `dog`, and it's missing, JavaScript will automatically take it from
`animal`. Here we can say that "`animal`" is the prototype of "`dog`" or prototypically inherits
from "`animal`".

So if `animal` has a lot of useful methods and properties, then they become automatically available
in `dog`.

We can actually chain the prototype like a descendant tree but only with a single origin at each node.
The limitations are:
- The references can't go in circles. JavaScript will throw an error if we try to assign `__proto__`
in a circle.
- The value of `__proto__` can be either an object or `null`. Other values are ignored.

## `for...in` loop

The `for...in` loop iterates over inherited properties too.

```js
let animal = {
  eats: true
};

let dog = {
  barks: true,
  __proto__: animal
};

// Object.keys only return own keys
console.log(Object.keys(dog)); // barks

// for...in loops over both own and inherited keys
for(let prop in dog) console.log(prop); // barks, then eats
```

If that's not what you want, and like to exclude inherited properties, there is built-in method `obj.hasOwnProperty(key)`
it returns `true` If `obj` has it own property named `key`.

```js
let animal = {
  eats: true
};

let dog = {
  barks: true,
  __proto__: animal
};

for(let prop in dog) {
  let isOwn = dog.hasOwnProperty(prop);

  if (isOwn) {
    alert(`Our: ${prop}`); // Our: barks
  } else {
    alert(`Inherited: ${prop}`); // Inherited: eats
  }
}
```

Here we have the following inheritance chain: `dog` inherits from `animal`, that inherits from `Object.Prototype`
as `animal` is a literal object `{...}`, and then null above all.

There's one funny thing. Where is the method `dog.hasOwnProperty` coming from? We did not define it.
Looking at the chain we can see that the method is provided by `Object.prototype.hasOwnProperty`. In other
words, it's inherited.

> [!QUESTION] Why does `hasOwnProperty` not appear in the `for..in` loop like `eats`?
> The answer is simple: `hasOwnProperty` is not enumerable. Just like all other properties of `Object.prototype`
> it has `enumerable: false` flag. And `for..in` only lists enumerable properties. That’s why it and
the rest of the Object.prototype properties are not listed.

> [!ATTENTION] Almost all other key/value-getting methods ignore inherited properties
> Almost all other key/value-getting methods, such as Object.keys, Object.values and so on ignore inherited properties.
> They only operate on the object itself. Properties from the prototype are not taken into account.

## The value of `this`

An interesting question may arise in the example above: *what's the value of `this` when an object has
an other prototypal inheritance?* 

The answer is simple: `this` is not affected by prototypes at all. **No matter where the method is
found: In a method call, `this` is always the object before the dot**.

That is actually a super-important thing, because we may have a big object with many methods, and have 
objects that inherit from it. And when the inheriting objects run the inherited methods, they will modify 
only their own states, not the state of the big object.

If we had other objects, like bird, snake, etc., inheriting from animal, they would also gain access 
to methods of animal. But this in each method call would be the corresponding object, evaluated at 
the call-time (before dot), not animal. So when we write data into this, it is stored into these objects.

As a result, methods are shared, but the object state is not.
