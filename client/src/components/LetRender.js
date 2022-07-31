import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAlienMode } from "../redux/actions";

// CSS
import letrenderMain from "../styles/components/LetRender.module.css";
import invadedLetrender from "../styles/components/LetRenderI.module.css";

export function LetRender() {
  // Alien
  const dispatch = useDispatch();
  const alienMode = useSelector((state) => state.alienMode);
  const storedMode =
    localStorage.getItem("alienMode") === "true" ? true : false;
  dispatch(setAlienMode(storedMode));

  let letrender = useMemo(() => {
    return alienMode ? invadedLetrender : letrenderMain;
  }, [alienMode]);

  // Await css renders
  const [render, setRender] = useState(false);

  useEffect(() => {
    let interval = setInterval(() => {
      setRender(true);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      className={
        render ? `${letrender.letRenderHide}` : `${letrender.letRender}`
      }
    ></div>
  );
}
