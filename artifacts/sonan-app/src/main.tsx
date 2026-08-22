import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Initialize theme from the saved preference; ?theme=light/dark is useful for QA and store previews.
const previewTheme = new URLSearchParams(window.location.search).get("theme");
const theme = previewTheme === "light" || previewTheme === "dark"
  ? previewTheme
  : (localStorage.getItem("theme") || "dark");
const root = document.documentElement;

if (theme === "dark") {
  root.classList.add("dark");
  root.style.colorScheme = "dark";
} else {
  root.classList.remove("dark");
  root.style.colorScheme = "light";
}

// Initialize language from localStorage
const language = localStorage.getItem("language") || "ar";
if (language === "ar") {
  root.setAttribute("dir", "rtl");
  root.lang = "ar";
} else {
  root.setAttribute("dir", "ltr");
  root.lang = "en";
}

// Initialize font size
const fontSize = localStorage.getItem("fontSize") || "16";
root.style.fontSize = `${fontSize}px`;

// Render app
createRoot(document.getElementById("root")!).render(<App />);

// Register Service Worker for PWA
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js", { scope: "/" })
      .then((registration) => {
        console.log("✓ Service Worker registered:", registration);
      })
      .catch((error) => {
        console.log("Service Worker registration skipped:", error);
      });
  });
}

// Handle app visibility changes
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    console.log("App is now visible");
  }
});
