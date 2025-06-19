import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Frame } from "./screens/Frame/Frame";

// Полифилы для старых браузеров
if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = function(callback) {
    return setTimeout(callback, 1000 / 60);
  };
}

if (!window.cancelAnimationFrame) {
  window.cancelAnimationFrame = function(id) {
    clearTimeout(id);
  };
}

// Полифил для Element.matches
if (!Element.prototype.matches) {
  Element.prototype.matches = (Element.prototype as any).msMatchesSelector || 
                              (Element.prototype as any).webkitMatchesSelector;
}

// Полифил для Element.closest
if (!Element.prototype.closest) {
  Element.prototype.closest = function(s: string) {
    let el = this;
    do {
      if (el.matches(s)) return el;
      el = el.parentElement || null;
    } while (el !== null);
    return null;
  };
}

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <Frame />
  </StrictMode>,
);