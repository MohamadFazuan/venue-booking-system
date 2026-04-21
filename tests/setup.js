import "@testing-library/jest-dom";
import { vi } from "vitest";

// Suppress console.error noise from React in test output
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === "string" &&
      (args[0].includes("Warning:") || args[0].includes("ReactDOM.render"))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});
afterAll(() => { console.error = originalError; });

// Mock window.scrollTo (not implemented in jsdom)
Object.defineProperty(window, "scrollTo", { value: vi.fn(), writable: true });

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
