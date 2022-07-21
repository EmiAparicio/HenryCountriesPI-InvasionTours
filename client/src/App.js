import { Route, Routes } from "react-router-dom";

import { LandingPage } from "./components/LandingPage/LandingPage";
import { Home } from "./components/Home/Home";
import { Detail } from "./components/Detail/Detail";
import { NavBar } from "./components/NavBar/NavBar";
import { Activities } from "./components/Activities/Activities";

import "./App.css";

////////////////////////////////////////////////////////////////////////////////

export function App() {
  return (
    <>
      <Routes>
        <Route exact path="/" element={<LandingPage />} />
        <Route exact path="*" element={<NavBar />}>
          <Route exact path="home" element={<Home />} />
          <Route exact path="country/:countryId" element={<Detail />} />
          <Route exact path="activities" element={<Activities />} />
        </Route>
      </Routes>
    </>
  );
}
