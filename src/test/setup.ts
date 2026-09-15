import "@testing-library/jest-dom";

class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Radix UI uses ResizeObserver for layout measurements.
// JSDOM doesn't provide it by default.
Object.defineProperty(globalThis, "ResizeObserver", {
  writable: true,
  value: MockResizeObserver,
});

Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
  writable: true,
  value: () => {
    const noop = () => {};
    return {
      // State
      fillStyle: "",
      strokeStyle: "",
      lineWidth: 1,
      font: "",
      textAlign: "left",
      // Drawing
      fillRect: noop,
      strokeRect: noop,
      clearRect: noop,
      beginPath: noop,
      closePath: noop,
      moveTo: noop,
      lineTo: noop,
      stroke: noop,
      fill: noop,
      arc: noop,
      rect: noop,
      setLineDash: noop,
      // Text
      fillText: noop,
      measureText: () => ({ width: 0 }),
      // Transforms
      save: noop,
      restore: noop,
      translate: noop,
      scale: noop,
      rotate: noop,
    } as unknown as CanvasRenderingContext2D;
  },
});

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});
