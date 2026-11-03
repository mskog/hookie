# AGENTS.md

Instructions for AI coding assistants working on Hookie. `CLAUDE.md` is a pointer to this file, so edit this one.

## What Hookie is

A Chrome MV3 extension for custom context-menu actions: right-click a page, selection, link, image, video or audio, and Hookie either opens a URL (Redirect) or calls an endpoint in the background (Background, GET or POST, optional Bearer token). Built with Plasmo, React 19, TypeScript and Tailwind CSS v3.

## Commands

- **Node 24 LTS**, pinned in `.mise.toml` only. Never add `engines.node` to `package.json` (see Gotchas). npm only (`package-lock.json`).
- `npm install`: install dependencies
- `npm run dev`: Plasmo dev server with hot reload, output in `build/chrome-mv3-dev/`
- `npm run build`: production build in `build/chrome-mv3-prod/`
- `npm run package`: zip a distributable package
- `npx tsc --noEmit`: type check
- `npx prettier --write .`: format (imports are sorted by `@ianvs/prettier-plugin-sort-imports`)

Load the extension at `chrome://extensions/` → Developer mode → Load unpacked → the build directory.

## Verifying a change

There is no test suite. A change is done when:

1. `npx tsc --noEmit` and `npm run build` pass (CI runs `npm ci`, both of these, on PRs and `main`)
2. The build looks right: check `build/chrome-mv3-prod/manifest.json` when touching `package.json` or entry points, and the options bundle size (about 236k; a tiny bundle means React wasn't bundled)
3. Anything user-facing has been tried in Chrome with the unpacked build

## Architecture

- **`src/background.ts`**: service worker. Builds context menus from stored actions and handles clicks: works out the value to send from the click context, then opens a tab (Redirect) or calls `fetch` and shows a notification (Background).
- **`src/options.tsx`**: options page. Action list, add/edit, delete, import/export (JSON file of `Action[]`).
- **`src/components/ActionForm.tsx`**: the add/edit form and its validation.
- **`src/types.ts`**: `Action` interface and `ActionType` enum.

Data flow: the options page writes `actions` to `chrome.storage.sync` → `chrome.storage.onChanged` in the background rebuilds the menus → a click looks the action up by menu item id and runs it.

- Action ids come from `crypto.randomUUID()`.
- Menus are built on `runtime.onInstalled` and on storage changes only. Chrome keeps context menus between browser restarts, so they are not rebuilt each time the worker wakes.
- Listeners (`contextMenus.onClicked`, `storage.onChanged`, `runtime.onInstalled`) must be registered synchronously at the top level of the worker, or MV3 drops events that wake it.
- Plasmo generates `manifest.json` from the `manifest` field in `package.json`. Never edit a manifest by hand.
- Permissions: `contextMenus`, `storage`, `tabs`, `notifications`. Host permissions are `https://*/*` only, so Background actions can't call plain `http://` endpoints.

## Gotchas

- **All actions are one sync item.** `chrome.storage.sync` allows 8KB per item (100KB total), so saving fails at around 30 actions, and the failure isn't surfaced yet (#67).
- **No `engines.node` in `package.json`.** Parcel treats it as a Node target and stops bundling `node_modules`. The build reports success, but the options page dies with `Cannot find module 'react/jsx-runtime'`. Symptom: `"react/jsx-runtime":"react/jsx-runtime"` self-mappings and a tiny options bundle.
- **tsconfig `extends` must be a relative file path** (`./node_modules/plasmo/templates/tsconfig.base.json`). A package specifier makes Parcel fail, and Plasmo reports it only as a misleading `Failed to resolve '../../src/options.tsx'`.
- **tsconfig overrides for TypeScript 6/7**: `moduleResolution: "bundler"` (Plasmo's base uses the removed `node`/`node10`), no `baseUrl` (removed; `paths` are relative to the tsconfig), `types: ["chrome"]` (`@types/*` are no longer picked up automatically) and `noUncheckedSideEffectImports: false` (for `import "~style.css"`). All of these work on TS 5.9 too.
- **Plasmo's base tsconfig sets `strict: false`.** Don't assume strict null checks catch anything.
- **`@types/chrome` ≥0.1**: `storage.sync.get` yields `unknown` values (cast `result.actions as Action[]`), and `ContextType` is an enum, so string contexts are typed `` `${chrome.contextMenus.ContextType}` ``.
- **React and react-dom must share a major.** Dependabot has bumped only one of them before.
- **Plasmo's last release is 0.90.5 (2025-05).** The ~77 `npm audit` findings come from its parcel/sharp/svelte toolchain. They are build-time only and can't be fixed downstream.
- **npm 11 blocks install scripts.** The build works without approving them because sharp/swc/lmdb/@parcel/watcher ship prebuilt binaries.
- **`npm ci` fails on Node 20 / npm 10** (the lockfile looks out of sync). If `node -v` shows 20, the shell isn't picking up mise.
- **Tailwind 4 is not a drop-in bump.** The PostCSS plugin moved to `@tailwindcss/postcss`, and the config moves into CSS.

## Code standards

- TypeScript only. No `any`: use real types, or `unknown` with a type guard.
- `interface` for object shapes, `type` for unions and intersections.
- Components are functional, with a props interface. `useState` for local state, `useEffect` for storage sync.
- Default exports for page components, named exports for utilities. Components go in `src/components/`.

### No comments

Code with good names and types documents itself. Don't write comments that say what the code does, section dividers, or TODOs (open a GitHub issue instead). A comment is acceptable only to explain _why_ something unusual is done: a Chrome API quirk or a browser/framework workaround, with a link to the docs or issue.

### Rule of three

Refactor duplication only when it appears three or more times. Duplication is cheaper than the wrong abstraction, and two instances aren't enough to show the real pattern. This applies to components, hooks, utilities and repeated Tailwind class sets alike.

## Keeping this file current

When a task teaches something the next session would otherwise have to rediscover (a gotcha, a command, a convention), add it to the matching section above, in a line or two. Fix anything here that turned out to be wrong. Don't add a dated changelog. Git history already has one.
