import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// DEBUG: Global error handler to show errors on screen
window.addEventListener('error', (event) => {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = 'position:fixed; top:0; left:0; width:100%; background:red; color:white; padding:20px; z-index:9999;';
    errorDiv.textContent = `Global Error: ${event.message} at ${event.filename}:${event.lineno}`;
    document.body.appendChild(errorDiv);
});

try {
    const rootElement = document.getElementById("root");
    if (!rootElement) throw new Error("Root element not found");

    createRoot(rootElement).render(<App />);
} catch (error: any) {
    document.body.innerHTML = `<div style="color:red; padding:20px;"><h1>Startup Error</h1><pre>${error?.message || error}</pre></div>`;
}
