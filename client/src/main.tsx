import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Error boundary for better mobile debugging
const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("Root element not found");
} else {
  try {
    createRoot(rootElement).render(<App />);
  } catch (error) {
    console.error("App render error:", error);
    rootElement.innerHTML = `<div style="padding: 20px; color: red;">Error loading app: ${error}</div>`;
  }
}
