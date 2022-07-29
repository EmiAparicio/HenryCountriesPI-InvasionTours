import { useEffect, useState } from "react";

import letrenderMain from "../styles/components/LetRender.module.css";

const letrender = letrenderMain; // letrenderMain invadedRender

export function LetRender() {
  // Await css renders
  const [render, setRender] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setRender(true);
    }, 1000);
  }, []);

  return (
    <div
      className={
        render ? `${letrender.letRenderHide}` : `${letrender.letRender}`
      }
    ></div>
  );
}
