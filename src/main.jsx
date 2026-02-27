import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ParticlesBackground from "./components/ParticlesBackground";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ParticlesBackground />
    <App />
  </React.StrictMode>
);
