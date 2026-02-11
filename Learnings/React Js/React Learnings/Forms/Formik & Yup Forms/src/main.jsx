import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import { Registration } from "../src/Page/Registration";
import { CleanRegistration } from './Page/CleanRegistration';

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <Registration /> */}
    <CleanRegistration/>
  </StrictMode>,
);
