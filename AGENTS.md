# AGENTS.md - AI Development Assistant Guidelines

This file contains context and instructions for AI coding assistants to help with development tasks in this Chrome extension project.

## 🚨 MANDATORY REQUIREMENTS - READ THIS FIRST 🚨

### ⚠️ ABSOLUTE REQUIREMENTS ⚠️

- **CODE QUALITY IS NON-NEGOTIABLE**: Every change must maintain high code quality standards
- **TESTING**: All new functionality should be testable and verifiable
- **TYPE SAFETY**: TypeScript types must be complete and accurate
- **NO EXCEPTIONS**: There are zero exceptions to these code quality requirements

## Common Development Commands

### Development Server
- `npm install` or `pnpm install` - Install dependencies
- `npm run dev` or `pnpm dev` - Start Plasmo development server with hot reload
- `npm run build` or `pnpm build` - Create production build in `build/chrome-mv3-prod/`
- `npm run package` or `pnpm package` - Create distributable extension package

### Loading Extension
1. Navigate to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select `build/chrome-mv3-dev/` for development or `build/chrome-mv3-prod/` for production

### Code Quality
- **TypeScript**: Run `tsc --noEmit` to check types without emitting files
- **Prettier**: `npx prettier --write .` to format code
- **Import Sorting**: Uses `@ianvs/prettier-plugin-sort-imports` automatically

## Project Overview

**Hookie** is a Chrome MV3 extension for creating custom context menu actions. Built with Plasmo framework, React, TypeScript, and Tailwind CSS.

### Key Features
- Custom context menu actions for page, selection, link, image, video, audio
- Redirect or background (API call) action types
- GET/POST HTTP methods
- Import/export functionality for action configurations
- Chrome sync storage for cross-device action persistence

## Architecture Overview

### Core Files
- **`src/background.ts`**: Service worker handling context menu creation, click events, and notifications
- **`src/options.tsx`**: Options page UI for managing actions (list, add, edit, delete, import/export)
- **`src/content.tsx`**: Content script (currently minimal, matches plasmo.com only)
- **`src/types.ts`**: TypeScript interfaces and enums (`Action`, `ActionType`)
- **`src/components/ActionForm.tsx`**: Form component for creating/editing actions

### Key Patterns
- **Chrome Storage Sync**: All actions stored in `chrome.storage.sync` for cross-device sync
- **UUID Identifiers**: Actions use `uuid` library for unique IDs
- **Context Menu API**: Dynamic context menu creation based on stored actions
- **React State Management**: Local state with `useState`, Chrome storage sync with `useEffect`
- **Plasmo Framework**: Provides manifest generation, hot reload, and extension build tooling

### Data Flow
1. User configures actions in options page (`options.tsx`)
2. Actions saved to `chrome.storage.sync`
3. Background script (`background.ts`) listens for storage changes and rebuilds context menus
4. User right-clicks in browser, triggering context menu item
5. Background script executes action (redirect or API call)
6. Notifications shown for background actions

## TypeScript Standards

### Type Safety
- **All files must use TypeScript** - No plain JavaScript files
- **No `any` types** - Use proper types or `unknown` with type guards
- **Interfaces over types** - Prefer `interface` for object shapes, `type` for unions/intersections
- **Explicit return types** - All functions should have explicit return type annotations

### Examples
- See `src/types.ts` for interface patterns
- See `src/background.ts` for Chrome API typing patterns
- See `src/options.tsx` for React TypeScript patterns

## Development Patterns

### Chrome Extension APIs
- **Manifest V3**: Uses service worker instead of background page
- **Permissions**: `contextMenus`, `storage`, `tabs`, `notifications`
- **Host Permissions**: `https://*/*` for API calls
- **Storage Sync**: Max 100KB total, 8KB per item, 512 items max

### React & Tailwind
- **TailwindCSS v3**: Utility-first styling with `tailwind.config.js`
- **Mobile-first**: Use responsive classes (`sm:`, `md:`, `lg:`)
- **Component Pattern**: Functional components with TypeScript props interfaces
- **State Management**: `useState` for local state, `useEffect` for Chrome storage sync

### Plasmo Framework
- **Config**: Uses `PlasmoCSConfig` for content script configuration
- **Build**: Automatically generates manifest.json from package.json manifest field
- **Hot Reload**: Development server watches for changes and rebuilds
- **Environment**: `process.env.PLASMO_PUBLIC_*` for public env vars

### Code Standards
- **Prettier**: Auto-formats on save with import sorting plugin
- **File Organization**: Components in `src/components/`, utilities in root `src/`
- **Named Exports**: Prefer default exports for page components, named exports for utilities

### 🚫 NO COMMENTS - TypeScript Is Self-Documenting

**CRITICAL**: This project follows a STRICT no-comment philosophy. Comments should be **EXTREMELY RARE**.

**TypeScript code with proper naming and types is self-documenting. If you think you need a comment, you probably need better naming or types instead.**

#### When Comments Are FORBIDDEN:
- ❌ **NEVER** add comments that explain what the code does - the code itself should make this obvious
- ❌ **NEVER** add comments like `// Loop through actions` or `// Save to storage` - these are obvious from the code
- ❌ **NEVER** add section dividers like `// Handlers`, `// State`, `// Effects` - code structure should make sections obvious
- ❌ **NEVER** add comments to appease linters or fill empty space
- ❌ **NEVER** add TODO comments - use GitHub issues instead

#### When Comments Are BARELY Acceptable (Use Sparingly):
- ✅ Complex Chrome API quirks that aren't obvious from documentation (with link to Chrome docs)
- ✅ Non-obvious algorithmic decisions with performance implications
- ✅ Workarounds for browser/framework bugs (with link to issue)
- ✅ Explaining "why" something unusual is done (never "what")

#### The Test:
**Before adding ANY comment, ask yourself:**
1. Can I rename variables/functions to make this obvious? (YES = no comment needed)
2. Can I add TypeScript types to clarify intent? (YES = no comment needed)
3. Is this explaining "what" the code does? (YES = delete the comment)
4. Would a TypeScript developer understand this without the comment? (YES = delete the comment)

**If in doubt, DON'T add the comment. Code should speak for itself.**

### 🔁 Rule of Three - Refactoring Duplications

**MANDATORY PRINCIPLE**: Only refactor code duplication when it appears **3 or more times**.

#### The Rule
- **1st instance**: Write the code
- **2nd instance**: Copy/paste with modifications (duplication is acceptable)
- **3rd instance**: NOW refactor - extract to shared component/utility/hook

#### Why This Matters
- **Premature abstraction is expensive**: Early refactoring often creates wrong abstractions
- **Two instances aren't enough data**: You don't yet know the true pattern
- **Three instances reveal the pattern**: Now you understand what should be abstracted
- **Keeps code simple**: Avoid over-engineering and unnecessary indirection

#### Examples

**DO NOT Refactor** (only 2 instances):
```tsx
// Two similar form fields - this is OK
<input type="text" value={name} onChange={e => setName(e.target.value)} />
<input type="text" value={url} onChange={e => setUrl(e.target.value)} />
```

**DO Refactor** (3+ instances):
```tsx
// Three identical form fields - TIME TO REFACTOR!
<input type="text" value={name} onChange={e => setName(e.target.value)} className="..." />
<input type="text" value={url} onChange={e => setUrl(e.target.value)} className="..." />
<input type="text" value={param} onChange={e => setParam(e.target.value)} className="..." />

// Refactor to:
<TextField value={name} onChange={setName} />
<TextField value={url} onChange={setUrl} />
<TextField value={param} onChange={setParam} />
```

#### Application
- **Components**: 3+ identical JSX blocks → extract to component
- **Hooks**: 3+ components with same state logic → extract to custom hook
- **Utilities**: 3+ files with same logic → extract to utility function
- **Styles**: 3+ components with same Tailwind classes → extract to component or use @apply

**Remember**: Duplication is cheaper than the wrong abstraction. Wait for the third instance.

## 📚 KNOWLEDGE MANAGEMENT - MANDATORY 📚

### EVERY Task Must Update CLAUDE.md

**REQUIRED**: Before marking any task as complete, you MUST update the CLAUDE.md file with useful information learned during the task.

#### What to Document:
- **New patterns discovered** - Component patterns, Chrome API usage, architectural decisions
- **File locations** - Where specific functionality lives, especially if non-obvious
- **Gotchas and pitfalls** - Chrome API quirks, Plasmo framework issues, browser inconsistencies
- **Commands that worked** - Especially if different from documented or if new
- **TypeScript patterns** - Type definitions, generic patterns, utility types
- **Chrome API quirks** - Behavior of context menus, storage, notifications, tabs API
- **Plasmo patterns** - Build configuration, manifest generation, content script config
- **React patterns** - Hooks usage, state management, component composition
- **Performance notes** - Storage limits, API rate limits, rendering optimizations

#### How to Update:
1. **Identify the right section** - Add to existing relevant sections (Architecture, Development Patterns, etc.)
2. **Keep it concise** - Bullet points, clear and actionable
3. **Be specific** - Include file paths, function names, examples
4. **Update existing info** - If you found something outdated, fix it
5. **Don't create sprawl** - Fit new info into existing structure when possible
6. **Check file size after editing** - Run `wc -c CLAUDE.md` to check character count

#### 📏 File Size Management - MANDATORY

**CRITICAL**: After editing CLAUDE.md, you MUST check the file size:

```bash
wc -c CLAUDE.md
```

**If file exceeds 40,000 characters**, you MUST compact it by following these steps IN ORDER:

1. **Promote valuable learnings to main sections** - Before deleting old Recent Learnings entries:
   - Extract reusable patterns and add to Development Patterns section
   - Move Chrome API gotchas to Architecture Overview or create new "Chrome Extension Patterns" section if needed
   - Add discovered commands to Common Development Commands
   - Promote architecture insights to Architecture Overview
   - Keep the original learning entry condensed or remove it after promotion

2. **Condense older learnings** - For entries older than 3-6 months:
   - Extract the single most valuable insight into a 1-3 bullet point summary
   - Remove narrative context, full code examples, and step-by-step details
   - Keep the essence: what pattern to use, what to avoid, why it matters

3. **Remove outdated learnings** - Delete entirely when:
   - Pattern already documented in main sections
   - Information duplicates Chrome/Plasmo documentation
   - Context is no longer relevant (deprecated APIs, old versions)
   - Learning is too specific to one-time scenarios

4. **Simplify verbose sections** - Convert paragraphs to bullet points, remove redundant examples

5. **Deduplicate** - Remove content that appears in multiple sections

**What makes a learning worth promoting to main sections:**
- ✅ Reusable pattern that applies to future work (Chrome API usage, storage patterns)
- ✅ Critical gotcha that could break things (MV3 migration issues, storage limits)
- ✅ Non-obvious convention specific to this codebase (action structure, context handling)
- ✅ Command or workflow that should be standard practice (build process, debugging)
- ❌ One-time fix or feature-specific implementation details
- ❌ Temporary workarounds that should eventually be removed
- ❌ Common Chrome API patterns documented elsewhere

**Priority for keeping content**:
- Type safety requirements (NEVER remove or condense)
- Core architecture patterns
- Critical gotchas and Chrome API warnings
- Recent Learnings from last 3 months (full detail)
- Promoted patterns in main sections (distilled form)
- Rule of Three and code standards

**Priority for removal/condensing**:
- Recent Learnings older than 6 months (promote or condense first)
- Redundant examples and verbose explanations
- Content that duplicates Chrome/Plasmo documentation
- Detailed narrative context from old learnings (keep the pattern, remove the story)

**Goal**: Keep file focused, actionable, and under 40,000 characters. Graduate valuable learnings from time-indexed (Recent Learnings) to topic-indexed (main sections) for better discoverability.

#### Examples of Good Updates:
- "Context menu actions stored in `chrome.storage.sync` with 100KB total limit across all data"
- "Background service worker must use `chrome.contextMenus.removeAll()` before recreating menus to avoid duplicates"
- "Plasmo auto-generates manifest.json from package.json `manifest` field - never edit manifest.json directly"
- "Action IDs use `uuid` library for collision-free identifiers across devices"

#### Warning:
Failing to update CLAUDE.md means the next AI assistant session will lack your insights. Document generously to build institutional knowledge.

---

## 📖 RECENT LEARNINGS 📖

**PURPOSE**: This section captures institutional knowledge from completed tasks. Future AI assistant sessions rely on these insights.

**INSTRUCTIONS FOR UPDATING**:
1. Add new entries BELOW this header section, in reverse chronological order (newest first)
2. Use the template format shown below
3. Include: Date, Context, Implementation Details, Key Learnings, Benefits
4. Be specific: include file paths, patterns, gotchas, and code examples
5. Keep it actionable: future assistants should be able to apply your learnings immediately

**WHEN TO ADD AN ENTRY**:
- Discovered a non-obvious pattern or convention
- Learned about file organization or architecture decisions
- Found a gotcha or pitfall that cost time to figure out
- Implemented a reusable pattern that should be followed
- Learned something about tooling, commands, or configuration

---

### 🆕 ADD NEW LEARNINGS BELOW THIS LINE (newest first) 🆕

### Initial Project Structure - Plasmo Extension Setup

**Date**: 2025-11-23

**Context**: Initial Hookie Chrome extension structure using Plasmo framework v0.88.0 with TypeScript, React 18, and Tailwind CSS v3.

**Architecture Details**:
- **Plasmo Framework**: Handles manifest generation, hot reload, and build process
- **Entry Points**: `background.ts` (service worker), `options.tsx` (options page), `content.tsx` (content script)
- **Storage**: Uses `chrome.storage.sync` for cross-device action persistence
- **Context Menus**: Dynamic creation based on stored actions, rebuilt on storage changes
- **Action Types**: Redirect (opens new tab) or Background (API call with notification)

**Key Learnings**:
1. **Plasmo manifest generation**: Package.json `manifest` field auto-generates manifest.json - never edit manifest.json directly
2. **MV3 service worker**: Background script is a service worker, not a persistent background page
3. **Storage sync limits**: 100KB total, 8KB per item, 512 items max - must stay within limits
4. **Context menu rebuilding**: Must call `chrome.contextMenus.removeAll()` before recreating to avoid duplicates
5. **UUID for action IDs**: Using `uuid` library ensures collision-free identifiers across devices
6. **Storage change listener**: Background script listens to `chrome.storage.onChanged` to rebuild menus when actions updated
7. **Notification pattern**: Background actions show silent notifications with custom icon from `url:~assets/icon.png`

**Files Structure**:
- `src/background.ts` - Context menu setup and click handling
- `src/options.tsx` - Options page with action list and form
- `src/types.ts` - TypeScript interfaces (`Action`, `ActionType`)
- `src/components/ActionForm.tsx` - Action creation/editing form
- `package.json` - Dependencies and manifest permissions

**Benefits**: Clean separation of concerns with Plasmo conventions, type-safe Chrome API usage, automatic manifest generation, and hot reload development experience.
