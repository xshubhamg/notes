---
title: Vite Env
description: Env management in a vite application
date: 2026-05-15
tags: [react, vite, env]
published: true
slug: vite-env
---

## Files created in project root

- `.env`, `.env.local` & `src/vite.env.d.ts`

## `env` variables

`Vite` exposes `env` variables on the special `import.meta.env` object. Some built-in variables are available in all cases :

- `import.meta.env.MODE`: {string}
- `import.meta.env.BASE_URL`: {string}
- `import.meta.env.PROD`: {boolean}
- `import.meta.env.DEV`: {boolean}
- `import.meta.env.SSR`: {boolean}

## `.env` Files

`Vite` uses `dotenv` to load additional environment variables from the following files in your environment directory:

```bash
.env                  # loaded in all cases
.env.local            # loaded in all cases, ignored by git
.env.[mode]           # only loaded in specific mode
.env.[mode].local     # only loaded in specific mode, ignored by git
```

Loaded `env` variables are also exposed to your client source code via `import.meta.env` as strings. To prevent accidentally leaking `env` variables to the client, only variables prefixed with `VITE_` are exposed to your `Vite-processed` code.

```js
VITE_SOME_KEY = 123;
DB_PASSWRD = foobar;
```

Only `VITE_SOME_KEY` will be exposed as `import.meta.env.VITE_SOME_KEY` to your client source code, but `DB_PASSWORD` will not.

## `Intellisence` for `TypeScript`

By default, `Vite` provides type definitions for `import.meta.env` in `vite/client.d.ts`. While you can define more custom `env` variables in `.env.[mode]` files, you may want to get Typescript Intellisense for user-defined `env` variables that are prefixed with `VITE_`.

To achieve this, you can create an `env.d.ts` in `src` directory,

```ts
<refrence types="vite/client" />;

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```
