import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import './index.css'
import { App } from "./App.jsx";
// import Profile  from "./components/profile.jsx";
// import { Practices } from "./practices.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    {/* <Practices /> */}
    {/* <Profile /> */}
  </StrictMode>
);
