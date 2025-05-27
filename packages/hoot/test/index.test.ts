import { describe, it, expect } from "bun:test"
import * as Hoot from "../src/index.js"

describe("Hoot", () => {
  it("should export createElement function", () => {
    expect(Hoot.createElement).toBeDefined()
    expect(typeof Hoot.createElement).toBe("function")
  })

  it("should export render function", () => {
    expect(Hoot.render).toBeDefined()
    expect(typeof Hoot.render).toBe("function")
  })

  it("should export router functions", () => {
    expect(Hoot.createRouter).toBeDefined()
    expect(Hoot.createRoute).toBeDefined()
    expect(Hoot.RouterProvider).toBeDefined()
    expect(Hoot.useRouter).toBeDefined()
    expect(Hoot.useNavigate).toBeDefined()
    expect(Hoot.renderApp).toBeDefined()
  })
})
