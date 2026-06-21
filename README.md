# Sagabound

Sagabound is a dark Norse mythology discovery web app built from scratch with Svelte 5, TypeScript, Vite, Vitest, svelte-check, plain CSS, and GitHub Actions.

The app lets users explore gods, realms, creatures, artifacts, myths, and saga fragments through a compact cinematic interface. The homepage is designed to be screenshot-ready immediately after opening: the first viewport includes the top navigation, the user name `Iustin Mitu`, a compact introduction, four visible god cards, and discovery statistics.

## What the application simulates

Sagabound simulates a small production-like mythology archive. It is not intended to be a full backend product, but it contains realistic frontend structure, typed data, reusable UI components, unit-tested logic, image metadata, and strict validation rules.

The project is useful for Repo Guardian-style testing because it has multiple failure surfaces:

- TypeScript contracts for mythology entries.
- Unit-tested recommendation and sorting logic.
- A validation script that checks required data fields and homepage-critical entries.
- Svelte components that can fail during type checking or production builds.
- Remote image metadata and fallback behavior.
- A multi-job GitHub Actions workflow.

## Main features

- Dark Nordic visual system with frost blue, rune gold, ash gray, iron gray, and deep black.
- Compact top navigation with Discover, Realms, Saga Library, and Recommendations.
- `Iustin Mitu` displayed in the top-right user chip.
- Four prominent god discovery cards: Odin, Thor, Loki, and Freyja.
- Realm cards for Asgard, Midgard, Jotunheim, and Helheim.
- Explorer Profile with completion progress and discovered counters.
- Filterable mythology library by realm, category, and discovery status.
- Saga fragments and myth entries displayed as compact cards.
- Recommendation panel based on rating, completion, and discovered tags.
- Exploration activity feed.
- Image credits section with replaceable source metadata.

## Technology stack

- Svelte 5
- TypeScript
- Vite
- Vitest
- svelte-check
- ESLint
- Plain CSS
- GitHub Actions

## Folder structure

```text
sagabound/
  .github/workflows/ci.yml
  scripts/validate-data.mjs
  src/
    components/
      EntryList.svelte
      ImageCard.svelte
      RealmCard.svelte
      SectionHeader.svelte
    data/
      mythology.json
      mythology.ts
      types.ts
    lib/
      mythologyLogic.ts
    tests/
      mythologyLogic.test.ts
    App.svelte
    main.ts
    styles.css
  index.html
  package.json
  tsconfig.json
  vite.config.ts
```

## Install dependencies

```bash
npm ci
```

If the lockfile needs to be regenerated during development, run:

```bash
npm install
```

The repository includes an `.npmrc` file pointing to the public npm registry.

## Run locally

```bash
npm run dev
```

Then open the local Vite URL shown in the terminal.

## Run tests

```bash
npm run test
```

## Run type checks

```bash
npm run typecheck
```

## Validate mythology data

```bash
npm run validate:data
```

The validation script checks that every god, realm, myth, creature, artifact, and saga fragment has required fields such as `id`, title or name, category, type, description, image metadata, and valid image credits. It also checks that the homepage-critical entries exist:

- Odin
- Thor
- Loki
- Freyja
- Asgard
- Midgard
- Jotunheim
- Helheim

## Run the full local CI command

```bash
npm run ci
```

This runs:

```bash
npm run lint
npm run typecheck
npm run test
npm run validate:data
npm run build
```

## GitHub Actions CI

The workflow runs on `push` and `pull_request`.

It contains four jobs:

1. `quality` runs dependency installation, linting, and Svelte/TypeScript checks.
2. `test` runs unit tests.
3. `data-integrity` validates the mythology data contracts.
4. `build` waits for the previous jobs and then runs the production build.

This structure is intentionally strict enough to catch realistic frontend issues while still remaining readable for a small project.

## Image sources and replacement strategy

Images are referenced through Wikimedia Commons file pages or Wikimedia Commons `Special:FilePath` URLs. The current set uses public-domain and CC BY-SA file-page metadata. Credits are stored in `src/data/mythology.json` under `imageCredits`. Each entry references an image credit through `image.creditId`.

The UI uses graceful image fallbacks. If a remote image fails, the card still renders a styled fallback block with the entry category and title.

To replace images later:

1. Update the entry image URL in `src/data/mythology.json`.
2. Add or update the matching object in `imageCredits`.
3. Run `npm run validate:data`.
4. Run `npm run ci`.

## Why this project is useful for Repo Guardian testing

Sagabound has enough real structure to produce meaningful failures for a CI-monitoring product:

- It has typed frontend code.
- It has logic with deterministic unit tests.
- It has a production build.
- It has data contracts enforced outside the TypeScript compiler.
- It has multiple CI jobs with clear names.
- It has dependencies and a lockfile.
- It has UI assumptions that can be broken by bad data changes.

## Future failure scenarios for Repo Guardian testing

The following failures can be introduced intentionally later:

- Break recommendation logic.
- Break average rating calculation.
- Break mythology entry type contracts.
- Break god or realm data contracts.
- Remove required image credits.
- Remove a required homepage entry.
- Introduce a failing unit test.
- Introduce a TypeScript type error.
- Introduce a Svelte component import error.
- Introduce a lint error.
- Break the production build.
- Break image fallback behavior.
- Change the data model in a way that violates the validation script.
- Change mythology data in a way that breaks UI assumptions.
- Remove a required field from a god, realm, myth, creature, or artifact.
- Change recommendation thresholds incorrectly.

## Available scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run typecheck
npm run test
npm run validate:data
npm run ci
```
