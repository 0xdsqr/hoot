import { describe, it, expect } from "bun:test"
import { createElement } from "../src/create-element.js"
import type { Element } from "../src/types.js"

describe("Element type", () => {
  it("should allow creating valid element structures", () => {
    const element: Element = {
      type: "div",
      props: {
        id: "test",
        className: "container",
        children: [],
      },
    }

    expect(element.type).toBe("div")
    expect(element.props.id).toBe("test")
    expect(element.props.className).toBe("container")
    expect(Array.isArray(element.props.children)).toBe(true)
  })

  it("should work with createElement function", () => {
    const element = createElement("div", { id: "test" }, "Hello")

    expect(element.type).toBe("div")
    expect(typeof element.props).toBe("object")
    expect(Array.isArray(element.props.children)).toBe(true)
  })

  it("should support arbitrary props", () => {
    const customProp = "customValue"
    const element = createElement("div", { customProp })

    expect(element.props.customProp).toBe(customProp)
  })
})
