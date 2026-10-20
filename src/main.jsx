
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Import our main component
import App from "./App.jsx";

// Import our CSS design
import "./App.css";

// Display React inside the HTML element with id="root"
createRoot(document.getElementById("root")).render(
    <StrictMode>
        <App />
    </StrictMode>
);
