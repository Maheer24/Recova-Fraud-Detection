import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppProvider } from "@toolpad/core/AppProvider";
import { ThemeProvider } from "./context/ThemeContext";
import "./index.css";

import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
   
      <AppProvider>
        <App />
      </AppProvider>
    </ThemeProvider>
    
   
  </StrictMode>
);
