import { describe, expect, it } from "bun:test"
import { createElement } from "../src/create-element.js"

describe("createElement", () => {
  it("should create an element with the correct type", () => {
    const element = createElement("div")
    expect(element.type).toBe("div")
  })

  it("should set props correctly", () => {
    const element = createElement("div", { id: "test", class: "container" })
    expect(element.props.id).toBe("test")
    expect(element.props.class).toBe("container")
  })

  it("should handle children", () => {
    const child = createElement("span")
    const element = createElement("div", {}, child)
    expect(element.props.children.length).toBe(1)
    expect(element.props.children[0]).toBe(child)
  })

  it("should create text elements for string children", () => {
    const element = createElement("div", {}, "Hello")
    expect(element.props.children.length).toBe(1)
    expect(element.props.children[0].type).toBe("TEXT_ELEMENT")
    expect(element.props.children[0].props.nodeValue).toBe("Hello")
  })

  it("should handle multiple children", () => {
    const element = createElement("div", {}, "Hello", createElement("span"))
    expect(element.props.children.length).toBe(2)
    expect(element.props.children[0].type).toBe("TEXT_ELEMENT")
    expect(element.props.children[1].type).toBe("span")
  })

  it("should handle arrays of children", () => {
    const element = createElement("div", {}, [
      createElement("span"),
      createElement("p"),
      createElement("a"),
    ])
    expect(element.props.children.length).toBe(3)
    expect(element.props.children[0].type).toBe("span")
    expect(element.props.children[1].type).toBe("p")
    expect(element.props.children[2].type).toBe("a")
  })
})
