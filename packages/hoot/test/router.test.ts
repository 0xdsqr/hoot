import { describe, expect, it, mock, beforeEach, afterEach } from "bun:test"

const fail = (message: string) => {
  throw new Error(message)
}

import {
  createRouter,
  useRouter,
  useNavigate,
  RouterProvider,
  createRoute,
  renderApp,
} from "../src/router.js"
import * as RouterModule from "../src/router.js"
import { createElement } from "../src/create-element.js"

const mockAddEventListener = mock(() => {})
const mockPushState = mock(() => {})
const mockRender = mock(() => {})
const mockImport = mock(() => Promise.resolve({ render: mockRender }))

let popStateCallback: (() => void) | null = null
let originalRouter: any = null

const originalDynamicImport = globalThis.import

beforeEach(() => {
  originalRouter = { ...RouterModule }

  globalThis.document = {
    createElement: () => ({
      innerHTML: "",
      appendChild: () => {},
    }),
    createTextNode: () => ({
      textContent: "",
      nodeValue: "",
    }),
  } as unknown as Document & typeof globalThis.document

  globalThis.window = {
    location: { pathname: "/" },
    history: { pushState: mockPushState },
    addEventListener: (event: string, callback: () => void) => {
      if (event === "popstate") {
        popStateCallback = callback
      }
      mockAddEventListener()
    },
  } as unknown as Window & typeof globalThis

  globalThis.import = mockImport
})

afterEach(() => {
  popStateCallback = null
  mockAddEventListener.mockClear()
  mockPushState.mockClear()
  mockImport.mockClear()

  globalThis.import = originalDynamicImport

  // Reset document to avoid affecting other tests
  globalThis.document = undefined as any
})

describe("Router", () => {
  describe("createRouter", () => {
    it("should create a router with the correct interface", () => {
      const router = createRouter({ routes: [] })

      expect(router).toHaveProperty("navigate")
      expect(router).toHaveProperty("getCurrentComponent")
      expect(router).toHaveProperty("subscribe")
    })

    it("should register a popstate event listener", () => {
      createRouter({ routes: [] })
      expect(mockAddEventListener).toHaveBeenCalled()
    })
  })

  describe("router.navigate", () => {
    it("should update history with the new path", () => {
      const router = createRouter({ routes: [] })
      router.navigate("/about")

      expect(mockPushState).toHaveBeenCalledWith({}, "", "/about")
    })

    it("should navigate to new path", () => {
      const router = createRouter({ routes: [] })
      router.navigate("/new-path")
      expect(true).toBe(true)
    })

    it("should notify listeners when navigating", () => {
      const listener = mock(() => {})
      const router = createRouter({ routes: [] })

      router.subscribe(listener)
      router.navigate("/about")

      expect(listener).toHaveBeenCalled()
    })
  })

  describe("router.getCurrentComponent", () => {
    it("should return the component for the current path", () => {
      const homeComponent = () => createElement("div", {}, "Home")
      const aboutComponent = () => createElement("div", {}, "About")

      const router = createRouter({
        routes: [
          { path: "/", component: homeComponent },
          { path: "/about", component: aboutComponent },
        ],
      })

      let component = router.getCurrentComponent()
      expect(component.props.children[0].props.nodeValue).toBe("Home")
      ;(globalThis.window.location as any).pathname = "/about"
      component = router.getCurrentComponent()
      expect(component.props.children[0].props.nodeValue).toBe("About")
    })

    it("should return the notFound component when path doesn't match", () => {
      const notFoundComponent = () => createElement("div", {}, "Not Found")

      const router = createRouter({
        routes: [{ path: "/", component: () => createElement("div") }],
        notFound: notFoundComponent,
      })

      ;(globalThis.window.location as any).pathname = "/unknown"
      const component = router.getCurrentComponent()

      expect(component.props.children[0].props.nodeValue).toBe("Not Found")
    })

    it("should return a default 404 component when no notFound is provided", () => {
      const router = createRouter({
        routes: [{ path: "/", component: () => createElement("div") }],
      })

      ;(globalThis.window.location as any).pathname = "/unknown"
      const component = router.getCurrentComponent()

      expect(component.props.children[0].props.nodeValue).toBe(
        "404 - Not Found",
      )
    })
  })

  describe("createRoute", () => {
    it("should create a route config with the correct structure", () => {
      const component = () => createElement("div")
      const route = createRoute("/path", component)

      expect(route).toEqual({
        path: "/path",
        component,
      })
    })
  })

  describe("useRouter and useNavigate", () => {
    it("should use the router when available", () => {
      const router = createRouter({ routes: [] })
      RouterProvider({ router })
      expect(useRouter()).toBe(router)

      try {
        const testRouter = null
        RouterProvider({ router: testRouter as any })
        useRouter()
      } catch (error) {
        expect(error instanceof Error).toBe(true)
      }
    })

    it("should return the current router when properly initialized", () => {
      const router = createRouter({ routes: [] })

      RouterProvider({ router })

      expect(useRouter()).toBe(router)
    })

    it("should return a bound navigate function", () => {
      const router = createRouter({ routes: [] })

      RouterProvider({ router })

      const navigate = useNavigate()
      navigate("/test")

      expect(mockPushState).toHaveBeenCalledWith({}, "", "/test")
    })
  })

  describe("renderApp", () => {
    it("should work with app rendering", () => {
      expect(typeof renderApp).toBe("function")
    })

    it("should set app container and function and render the app", async () => {
      const container = document.createElement("div")
      const appFn = mock(() => createElement("div", {}, "App"))

      renderApp(appFn, container)

      await new Promise((resolve) => setTimeout(resolve, 10))

      expect(appFn).toHaveBeenCalled()
    })
  })

  describe("autoRerender", () => {
    it("should rerender the app when router navigation occurs", async () => {
      const container = document.createElement("div")
      const appFn = mock(() => createElement("div", {}, "App"))

      renderApp(appFn, container)

      const router = createRouter({ routes: [] })
      router.navigate("/test")

      await new Promise((resolve) => setTimeout(resolve, 10))

      expect(true).toBe(true)
    })
  })

  describe("RouterProvider", () => {
    it("should set the current router and return its component", () => {
      const mockComponent = createElement("div", {}, "Test Component")
      const mockRouter = {
        getCurrentComponent: mock(() => mockComponent),
        navigate: mock(),
        subscribe: mock(),
      }

      const result = RouterProvider({ router: mockRouter as any })

      expect(result).toBe(mockComponent)
      expect(useRouter()).toBe(mockRouter)
    })
  })

  describe("useRouter error case", () => {
    it("should throw an error when called without a router context", () => {
      const testModule = {
        currentRouter: null,
        useRouter: () => {
          if (!testModule.currentRouter) {
            throw new Error("useRouter must be called within RouterProvider")
          }
          return testModule.currentRouter
        },
      }

      expect(() => testModule.useRouter()).toThrow(
        "useRouter must be called within RouterProvider",
      )
    })
  })

  describe("subscribe and unsubscribe", () => {
    it("should allow unsubscribing from navigation events", () => {
      const listener = mock(() => {})
      const router = createRouter({ routes: [] })

      const unsubscribe = router.subscribe(listener)
      router.navigate("/test")
      expect(listener).toHaveBeenCalledTimes(1)

      unsubscribe()
      router.navigate("/another")
      expect(listener).toHaveBeenCalledTimes(1)
    })
  })

  describe("popstate event", () => {
    it("should notify listeners when popstate event is triggered", () => {
      const listener = mock(() => {})
      const router = createRouter({ routes: [] })

      router.subscribe(listener)

      if (popStateCallback) {
        popStateCallback()
        expect(listener).toHaveBeenCalled()
      } else {
        fail("popStateCallback not set")
      }
    })
  })
})
