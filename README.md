# HNG15 Todo List Webapp

A modern, production-ready todo list application built with **Next.js 16**, **TypeScript**, **Tailwind CSS**, and **Zustand**. Created for the HNG15 program.

## Features

- ✅ **Add, edit, complete, and delete todos** — with inline delete confirmation
- 📝 **Titles & descriptions** for every todo
- 📅 **Due date & time** with relative labels (*Today*, *Tomorrow*, *In 3 days*) and overdue highlighting
- 🏷️ **Tags** — press `Enter` in the tags field to add, click a tag chip to remove
- ⚡ **Priority levels** — None, Low, Medium, High, Urgent (color-coded badges)
- 🔍 **Search** across titles, descriptions, and tags (press `Enter` to apply)
- 🗂️ **Filters & sorting** — status (All / Active / Completed), sort by manual / due date / priority / created date, ascending or descending, plus a tag filter
- 📊 **Stats bar** — total, active, and completed counts
- 🌗 **Light / dark / system theme** — persisted, with smooth toggle
- 💾 **Local persistence** — todos and theme survive page reloads (localStorage via Zustand persist)
- 🧱 **Skeleton loading states** and friendly empty / no-results states
- ♿ **Accessible** — labelled icon buttons, focus rings, keyboard-friendly forms

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| Language | TypeScript (strict) |
| UI | React 19, Tailwind CSS 3.4 + CSS design tokens |
| State | [Zustand](https://github.com/pmndrs/zustand) 5 with `persist` middleware |
| Icons | lucide-react |
| Utilities | clsx, tailwindcss-animate |

## Getting Started

### Prerequisites

- **Node.js** 18.18+ (tested on Node 24)
- **npm** 9+ (tested on npm 11)

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout: fonts, ThemeProvider, TodoProvider
│   ├── page.tsx            # Entry page → <TodoApp />
│   └── globals.css         # Design tokens (light/dark), component classes
├── components/
│   ├── todo/               # App-level components
│   │   ├── todo-app.tsx    # Shell: header, search, filters, stats, list, modal
│   │   ├── todo-form.tsx   # Add / edit modal (title, description, due date, priority, tags)
│   │   ├── todo-list.tsx   # Filtered list + empty / no-results states
│   │   ├── todo-item.tsx   # Card: checkbox, badges, edit / delete with confirm
│   │   ├── filter-bar.tsx  # Status, sort, order, tag filters
│   │   ├── search-bar.tsx  # Search input
│   │   ├── stats-bar.tsx   # All / Active / Completed counts
│   │   ├── empty-state.tsx # First-run empty state
│   │   └── skeleton.tsx    # Loading skeletons
│   └── ui/                 # Primitives: button, input, select, checkbox,
│                           # badge, label, textarea, theme-toggle
└── lib/
    ├── store.tsx           # Zustand store: todos, filters, CRUD, persistence
    ├── theme.tsx           # Theme context: light/dark/system + persistence
    ├── types.ts            # Todo, FilterState, priority maps
    └── utils.ts            # cn(), date formatters, overdue helpers
```

## How It Works

- **State** lives in a single Zustand store (`hng15-todo-store` in localStorage) with actions for add / update / delete / toggle and a memoized `getFilteredTodos()` that applies status, search, tag filters, and sorting.
- **Hydration safety** — `TodoProvider` gates rendering until the first client mount, so server-rendered HTML never mismatches persisted todos.
- **Theming** — colors are defined once as CSS variables in `globals.css` and mapped to Tailwind utilities in `tailwind.config.js`; the theme toggle switches the `dark` class and persists the choice (`hng15-theme`).

## Known Notes

- `npm run lint` is not yet configured: `next lint` was removed in Next.js 16 and this project has no ESLint config (`eslint-config-next` is currently pinned to 15.x).
- The Next.js build prints a harmless warning that `package-lock.json` was ignored for the Turbopack root because it sits under a user home directory; set `turbopack.root` in `next.config.mjs` to silence it.

## License

Private — HNG15 assessment project.
