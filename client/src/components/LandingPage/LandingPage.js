import { Link } from "react-router-dom";
import { useEffect } from "react";

////////////////////////////////////////////////////////////////////////////////

export function LandingPage() {
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
