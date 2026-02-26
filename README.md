# Bad Practices Highlighter

A VS Code extension that highlights common bad coding practices in JavaScript and TypeScript files — fully configurable per rule.

## Rules

### `no-else` — Avoid else blocks

Prefer early returns and guard clauses over `else` branches to reduce nesting.

```ts
// Bad
function getLabel(isAdmin: boolean) {
  if (isAdmin) {
    return 'Admin';
  } else {
    return 'User';
  }
}

// Good
function getLabel(isAdmin: boolean) {
  if (isAdmin) return 'Admin';
  return 'User';
}
```

---

### `no-sequential-awaits` — Wrap independent awaits in Promise.all

Sequential `await` calls block each other unnecessarily when they are independent.

```ts
// Bad
const user = await fetchUser(id);
const posts = await fetchPosts(id);

// Good
const [user, posts] = await Promise.all([fetchUser(id), fetchPosts(id)]);
```

---

### `no-nested-array-methods` — No array methods inside array methods

Nesting `map`, `filter`, `reduce`, etc. inside each other hurts readability. Extract the inner logic to a named function.

```ts
// Bad
const result = items.map(group => group.values.filter(v => v.active));

// Good
const getActiveValues = (group: Group) => group.values.filter(v => v.active);
const result = items.map(getActiveValues);
```

---

### `no-console` — Remove console calls

`console.*` calls should not be left in production code. Use a proper logger instead.

```ts
// Bad
console.log('User loaded:', user);

// Good
logger.info('User loaded', { user });
```

---

### `no-magic-numbers` — Extract magic numbers to named constants

Raw numeric literals make code harder to understand and maintain.

```ts
// Bad
if (retries > 3) restart();
setTimeout(flush, 5000);

// Good
const MAX_RETRIES = 3;
const FLUSH_INTERVAL_MS = 5000;

if (retries > MAX_RETRIES) restart();
setTimeout(flush, FLUSH_INTERVAL_MS);
```

---

### `no-deep-nesting` — Avoid deeply nested code

Deeply nested blocks are hard to read and test. Flatten with early returns or extracted functions.

---

### `no-todo-comments` — Flag TODO / FIXME comments

Keeps leftover `TODO` and `FIXME` comments visible so they don't get forgotten.

---

### `no-chained-filters` — Avoid chaining multiple filters

Two consecutive `.filter()` calls can always be merged into one, avoiding a double pass over the array.

```ts
// Bad
const result = items.filter(x => x.active).filter(x => x.value > 10);

// Good
const result = items.filter(x => x.active && x.value > 10);
```

---

### `no-async-in-for` — Avoid await inside for loops

`await` inside a `for` loop serializes iterations. Use `Promise.all` with `map` instead.

```ts
// Bad
for (const id of ids) {
  await processItem(id);
}

// Good
await Promise.all(ids.map(id => processItem(id)));
```

---

## Configuration

Override severity for any rule in your VS Code settings (`settings.json`):

```json
"badPractices.rules": {
  "no-console": "error",
  "no-magic-numbers": "off",
  "no-else": "hint"
}
```

Available values: `"error"`, `"warning"`, `"hint"`, `"info"`, `"off"`.

Disable real-time linting (only lint on save):

```json
"badPractices.lintOnType": false
```

---

## Source

[github.com/amerele/avoid-bad-practices](https://github.com/amerele/avoid-bad-practices)
