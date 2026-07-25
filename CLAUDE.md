# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A collection of custom scripts for [Boop](https://github.com/IvanMathy/Boop), a macOS scratchpad that runs small text
transformations on the clipboard buffer. Currently one script: `bin/library-sort.js`, which sorts lines
alphabetically while ignoring a leading "The" in the sort key.

Three tracked files (`LICENSE`, `README.md`, `bin/library-sort.js`). No build system, no `package.json`, no
dependencies, no CI.

## The constraints that matter

Boop scripts are not Node modules, and the usual JavaScript reflexes will break them:

- **No module system.** Boop reads the raw file and calls a top-level `function main(state)`. Adding
  `module.exports`, `export`, or `require` breaks the script at runtime inside Boop. Anything that needs to load a
  script — a test harness, for instance — has to `readFileSync` + `eval` it and capture `main`, not `import` it.
- **The `/** … **/` header is required metadata, not a comment.** `api`, `name`, `description`, and `author` are
  mandatory; `icon`, `tags`, and `bias` are optional. Boop parses this block to register the script, so it cannot be
  reformatted or moved freely.
- **`description` is the only text a user ever sees.** It appears in Boop's script picker. Behavior a user needs to
  know about — including anything destructive — has to be stated there, not just in the README or a code comment.
- **Scripts run in JavaScriptCore, not Node.** No `require`, no `process`, no filesystem. `state` is the entire API
  surface: `state.text` reads and writes the buffer, and `state.postError` / `state.postInfo` show messages.

## Development Commands

There is no build, test, or lint tooling. The only check available is a syntax check:

```bash
node --check bin/library-sort.js
```

Verifying behavior means either running the script in Boop, or writing a throwaway harness that `eval`s the file
against a stubbed `state` object (`{ text, postError }`) — `main` is a pure function of that object, so this works
well and is the cheapest way to check a change.

## Installation

Boop has no default scripts directory. The user points Boop at a folder via **Boop → Preferences → Scripts**, and
this repo (or a symlink to it) goes there. Nothing in the repo encodes a path, so `bin/` is a naming choice rather
than a requirement — these are not executables on `$PATH`.

## Conventions

- One script per file, named for what it does.
- Scripts must not throw on empty input: check `state.text.trim()` first and call `state.postError` with an
  explanation, leaving `state.text` untouched.
- Leave the buffer unmodified on any error path. A Boop script that half-transforms text destroys the user's
  clipboard with no undo.
