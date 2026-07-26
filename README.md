# Student Portfolio — React + Vite

Practical 1: Introduction to React and Component Architecture
(Advanced Web Development Frameworks, ITUE301)

## What this is

A single-page student portfolio built with independently structured,
reusable React components, composed together in `App.jsx`.

## Components

| Component     | Role                                                      |
|---------------|-----------------------------------------------------------|
| `Header.jsx`  | Site title, receives `name` and `themeColor` as props     |
| `NavBar.jsx`  | Highlights the active section (supplementary problem)     |
| `About.jsx`   | Short bio text                                             |
| `Skills.jsx`  | Receives `skillList` array as a prop, renders dynamically  |
| `Projects.jsx`| Hardcoded list of 3 projects (post-lab assignment)         |
| `Footer.jsx`  | Contact / copyright info                                   |

## Props used

- `name="Jane Doe"` and `themeColor="#2563eb"` → passed into `Header`
- `skillList={[...]}` → passed into `Skills` and rendered with `.map()`

## Run it locally

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

If port 5173 is busy:

```bash
npm run dev -- --port 5174
```

## Build for production

```bash
npm run build
npm run preview
```

## Notes

- No JSX or logic is duplicated across components — each owns a single
  responsibility.
- `node_modules` is excluded via `.gitignore`.
- To recreate this scaffold from scratch instead of using these files
  directly, you can run:
  ```bash
  npm create vite@latest student-portfolio -- --template react
  ```
