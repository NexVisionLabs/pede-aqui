import { Router } from "./Router";
import { HashRouter } from "react-router-dom";

export function App() {
  return (
      <HashRouter>
          <Router />
      </HashRouter>
  );
}