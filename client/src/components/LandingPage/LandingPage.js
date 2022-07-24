/* eslint-disable react-hooks/exhaustive-deps */
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import {
  setNameSelection,
  setOrderOptions,
  setFilterOptions,
  setStoredPage,
} from "../../redux/actions";

////////////////////////////////////////////////////////////////////////////////

export function LandingPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setOrderOptions([]));
    dispatch(
      setFilterOptions({
        continent: "",
        activity: "",
      })
    );
    dispatch(setNameSelection());
    dispatch(setStoredPage(1));
  }, []);

  const handleKeyboard = (e) => {
    e.preventDefault();
    if (e.repeat) return;

    // Handle both, `ctrl` and `meta`.
    if (e.metaKey || e.ctrlKey) console.log(e.key);
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyboard);

    return () => document.removeEventListener("keydown", handleKeyboard);
  });

  return (
    <div>
      <Link to="/home">Home</Link>
    </div>
  );
}
