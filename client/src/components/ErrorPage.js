/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function ErrorPage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/home", { replace: true });
  }, []);

  return <></>;
}
