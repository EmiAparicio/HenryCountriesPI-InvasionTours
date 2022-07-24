import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setClearSearch,
  setFilterOptions,
  setOrderOptions,
  setStoredPage,
} from "../../redux/actions";

export function ClearButton({ clear, disabled, text }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleClick() {
    if (clear !== "order")
      dispatch(setFilterOptions({ continent: "", activity: "" }));
    if (clear !== "filter") dispatch(setOrderOptions([]));
    if (clear === "all") {
      dispatch(setClearSearch(true));
    }

    dispatch(setStoredPage(1));
    navigate(`/home?page=1`);
  }

  return (
    <button disabled={disabled} onClick={handleClick}>
      {text}
    </button>
  );
}
