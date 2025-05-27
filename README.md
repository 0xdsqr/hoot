<div align="center">
<img src="./.github/assets/hoot.svg" alt="Hoot react alternative" width="350"/>

<p align="center">
  <a href="https://github.com/0xdsqr/hoot/actions/workflows/test.yml"><img src="https://img.shields.io/github/actions/workflow/status/0xdsqr/hoot/test.yml?style=for-the-badge&logo=github&label=tests" alt="Tests Status"></a>
  <a href="#"><img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"></a>
  <a href="#"><img src="https://img.shields.io/badge/coverage-99.65%25-brightgreen?style=for-the-badge&logo=codecov&logoColor=white" alt="Code Coverage"></a>
</p>
</div>

[Hoot](https://github.com/0xdsqr/hoot) is a lightweight React-inspired framework built from the ground up to understand how modern UI libraries work under the hood. It's free and open source, implementing core React concepts with a clean, minimal API that's great for educational purposes and building simple applications.

Hoot currently provides a solid foundation with the following features:

## Features

- [x] 🎨 **Create Element** - Build virtual DOM elements with a familiar API
- [x] 🚀 **Render** - Efficiently render elements to the DOM
- [x] 🧭 **Router** - Client-side routing with navigation hooks

## Coming Soon

- [ ] ⚡ **useEffect** - Handle side effects and lifecycle events
- [ ] 🔄 **useState** - Manage component state with hooks
- [ ] 📌 **useRef** - Create mutable references to DOM elements
- [ ] 🧠 **useMemo** - Memoize expensive computations
- [ ] 🔗 **useCallback** - Memoize callback functions for performance

## Installation

> [!IMPORTANT]  
> Hoot is and most likely will always be in beta - it started as a project to learn for [dsqr.dev](https://dsqr.dev).

You can install hoot with most common package managers:

| Package Manager | Command |
|-----------------|---------|
| **npm** | `npm install @dsqr/hoot@latest` |
| **pnpm** | `pnpm add @dsqr/hoot@latest` |
| **bun** | `bun add @dsqr/hoot@latest` |
| **yarn** | `yarn add @dsqr/hoot@latest` |

## Usage

Here's a basic example to get you started with Hoot:

<sub>📄 main.js</sub>

```javascript
import * as hoot from "@dsqr/hoot"
import { router } from "./router.js"

function App() {
  return hoot.createElement(
    "div",
    { style: "padding: 20px; font-family: Arial, sans-serif;" },
    hoot.createElement("h1", {}, "Welcome to Hoot! 🦉"),
    hoot.createElement("p", {}, "A lightweight React alternative"),
    hoot.RouterProvider({ router }),
  )
}

const container = document.getElementById("app")
if (!container) {
  throw new Error("Could not find #app element")
}

hoot.renderApp(App, container)
```

<sub>📄 router.js</sub>

```javascript
import * as hoot from "@dsqr/hoot"
import { routes } from "./routes/index.js"

export const router = hoot.createRouter({
  routes,
  notFound: () =>
    hoot.createElement(
      "div",
      {},
      hoot.createElement("h1", {}, "404 - Page Not Found"),
    ),
})
```

<sub>📄 routes/index.js</sub>

```javascript
import * as hoot from "@dsqr/hoot"
import { HomePage } from "./home.js"
import { AboutPage } from "./about.js"

export const routes = [
  hoot.createRoute("/", HomePage),
  hoot.createRoute("/about", AboutPage),
]
```

<sub>📄 routes/home.js</sub>

```javascript
import * as hoot from "@dsqr/hoot"

export function HomePage() {
  const navigate = hoot.useNavigate()

  return hoot.createElement(
    "div",
    {},
    hoot.createElement("h1", {}, "Home Page"),
    hoot.createElement("p", {}, "Hello world from Hoot!"),
    hoot.createElement(
      "button",
      { onclick: () => navigate("/about") },
      "Go to About",
    ),
  )
}
```

<sub>📄 routes/about.js</sub>

```javascript
import * as hoot from "@dsqr/hoot"

export function AboutPage() {
  const navigate = hoot.useNavigate()

  return hoot.createElement(
    "div",
    {},
    hoot.createElement("h1", {}, "About Us"),
    hoot.createElement("p", {}, "Learn more about this project!"),
    hoot.createElement(
      "button",
      { onclick: () => navigate("/") },
      "Back to Home",
    ),
  )
}
```

## API

<details><summary><strong>Creating Elements</strong></summary>

The `createElement` function is the foundation of Hoot. It creates virtual DOM elements that can be rendered to the page.

**Basic element creation**

```javascript
import * as hoot from "@dsqr/hoot"

function MyComponent() {
  return hoot.createElement("div", {}, "Hello World!")
}
```

**Element with properties**

```javascript
function StyledComponent() {
  return hoot.createElement(
    "div",
    {
      style: "color: blue; padding: 10px;",
      className: "my-class",
    },
    "Styled content",
  )
}
```

**Nested elements**

```javascript
function NestedComponent() {
  return hoot.createElement(
    "div",
    {},
    hoot.createElement("h1", {}, "Title"),
    hoot.createElement("p", {}, "Paragraph content"),
    hoot.createElement(
      "button",
      { onclick: () => alert("Clicked!") },
      "Click me",
    ),
  )
}
```

</details>

<details><summary><strong>Rendering</strong></summary>

Hoot provides two main rendering functions: `render` for simple elements and `renderApp` for full applications with routing.

**Simple rendering**

```javascript
import * as hoot from "@dsqr/hoot"

const element = hoot.createElement("h1", {}, "Hello Hoot!")
const container = document.getElementById("app")

hoot.render(element, container)
```

**Application rendering**

```javascript
import * as hoot from "@dsqr/hoot"
import { router } from "./router.js"

function App() {
  return hoot.createElement(
    "div",
    { style: "padding: 20px;" },
    hoot.RouterProvider({ router }),
  )
}

const container = document.getElementById("app")
hoot.renderApp(App, container)
```

</details>

<details><summary><strong>Routing</strong></summary>

Hoot includes a built-in router for single-page applications with navigation hooks.

**Setting up routes**

```javascript
import * as hoot from "@dsqr/hoot"
import { HomePage } from "./routes/home.js"
import { AboutPage } from "./routes/about.js"

export const router = hoot.createRouter({
  routes: [
    hoot.createRoute("/", HomePage),
    hoot.createRoute("/about", AboutPage),
    hoot.createRoute("/users/:id", UserPage),
  ],
  notFound: () => hoot.createElement("div", {}, "404 - Not Found"),
})
```

**Navigation between routes**

```javascript
function Navigation() {
  const navigate = hoot.useNavigate()

  return hoot.createElement(
    "nav",
    {},
    hoot.createElement("button", { onclick: () => navigate("/") }, "Home"),
    hoot.createElement(
      "button",
      { onclick: () => navigate("/about") },
      "About",
    ),
  )
}
```

**Accessing router in components**

```javascript
function RouterInfo() {
  const router = hoot.useRouter()

  return hoot.createElement(
    "div",
    {},
    `Current path: ${window.location.pathname}`,
  )
}
```

</details>

<details><summary><strong>Event Handling</strong></summary>

Handle user interactions by attaching event listeners to elements.

**Click events**

```javascript
function ClickableButton() {
  const handleClick = () => {
    console.log("Button clicked!")
  }

  return hoot.createElement("button", { onclick: handleClick }, "Click me")
}
```

**Form handling**

```javascript
function SimpleForm() {
  const handleSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    console.log("Form data:", Object.fromEntries(formData))
  }

  return hoot.createElement(
    "form",
    { onsubmit: handleSubmit },
    hoot.createElement("input", {
      type: "text",
      name: "username",
      placeholder: "Enter username",
    }),
    hoot.createElement("button", { type: "submit" }, "Submit"),
  )
}
```

</details>

---

<details><summary><strong>What it is not</strong></summary>

- **It is not a full React replacement** - Hoot focuses on core functionality like elements, rendering, and routing. It doesn't include the full React ecosystem of hooks, context, or advanced patterns. It's designed for learning and lightweight applications.

- **It is not about complex state management** - Hoot doesn't include built-in state management solutions like Redux or Zustand. For simple state needs, you'll rely on basic JavaScript patterns until hooks are implemented.

- **It is not about server-side rendering** - Hoot is designed for client-side applications. There's no built-in SSR, static generation, or server components support.

- **It is not production-ready** - This is a learning project and experimental implementation. For production applications, consider using established frameworks like React, Vue, or Svelte.

</details>

---

Want to see Hoot in action? Check out [dsqr.dev](https://dsqr.dev) where it's being used in real projects.

## Contributing

If you run into any issues or have ideas, please feel free to [file an issue](https://github.com/0xdsqr/hoot/issues). I built Hoot primarily for my own projects and learning, but I'm happy to consider pull requests if they align with the project's goals.

That said, I can't promise I'll accept every PR since this was designed with my specific needs in mind. But don't let that stop you from suggesting improvements or reporting bugs - I really appreciate the feedback!
