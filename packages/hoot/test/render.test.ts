import { describe, expect, it, mock, spyOn } from "bun:test"
import { render } from "../src/render.js"
import { createElement } from "../src/create-element.js"

const mockAppendChild = mock(() => {})
const mockCreateTextNode = mock(() => ({ appendChild: mockAppendChild }))
const mockCreateElement = mock(() => ({ appendChild: mockAppendChild }))

globalThis.document = {
  createTextNode: mockCreateTextNode,
  createElement: mockCreateElement,
} as unknown as Document

describe("render", () => {
  it("should create a text node for TEXT_ELEMENT types", () => {
    const container = { appendChild: mockAppendChild } as unknown as HTMLElement
    const element = {
      type: "TEXT_ELEMENT",
      props: {
        nodeValue: "Hello",
        children: [],
      },
    }

    render(element, container)

    expect(mockCreateTextNode).toHaveBeenCalledWith("Hello")
    expect(mockAppendChild).toHaveBeenCalled()
  })

  it("should create a DOM element for non-TEXT_ELEMENT types", () => {
    const container = { appendChild: mockAppendChild } as unknown as HTMLElement
    const element = {
      type: "div",
      props: {
        id: "test",
        children: [],
      },
    }

    render(element, container)

    expect(mockCreateElement).toHaveBeenCalledWith("div")
    expect(mockAppendChild).toHaveBeenCalled()
  })

  it("should set properties on the DOM element", () => {
    const domElement = { appendChild: mockAppendChild }
    mockCreateElement.mockImplementationOnce(() => domElement)

    const container = { appendChild: mockAppendChild } as unknown as HTMLElement
    const element = {
      type: "div",
      props: {
        id: "test",
        className: "container",
        children: [],
      },
    }

    render(element, container)

    expect(domElement).toHaveProperty("id", "test")
    expect(domElement).toHaveProperty("className", "container")
  })

  it("should recursively render children", () => {
    const parentDomElement = { appendChild: mockAppendChild }
    const childDomElement = { appendChild: mockAppendChild }

    mockCreateElement.mockImplementationOnce(() => parentDomElement)
    mockCreateElement.mockImplementationOnce(() => childDomElement)

    const container = { appendChild: mockAppendChild } as unknown as HTMLElement
    const childElement = createElement("span", { id: "child" })
    const parentElement = createElement("div", { id: "parent" }, childElement)

    render(parentElement, container)

    expect(mockCreateElement).toHaveBeenCalledWith("div")
    expect(mockCreateElement).toHaveBeenCalledWith("span")
    expect(mockAppendChild).toHaveBeenCalled()
  })
})
