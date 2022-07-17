import { Route, Routes } from "react-router-dom";

import { LandingPage } from "./components/LandingPage/LandingPage";
import { Home } from "./components/Home/Home";

import "./App.css";

////////////////////////////////////////////////////////////////////////////////

export function App() {
  return (
    <>
      <Routes>
        <Route exact path="/" element={<LandingPage />} />
        <Route exact path="/home" element={<Home />} />
      </Routes>
    </>
  );
}
