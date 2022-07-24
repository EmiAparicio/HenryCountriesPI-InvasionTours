/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setStoredPage } from "../../redux/actions";

export function ConfigRender({
  name,
  label,
  configType,
  disabled,
  defaultValue,
  defaultOption,
  options,
  setConfigOptions,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const configRef = useRef();

  const orderConfig = useSelector((state) => state.orderConfig);
  const filterConfig = useSelector((state) => state.filterConfig);

  useEffect(() => {
    if (configType === "order") {
      if (!orderConfig.length || orderConfig[0] !== name)
        configRef.current.value = "";
    } else if (!filterConfig[name].length) configRef.current.value = "";
  }, [filterConfig, orderConfig]);

  function handleConfig(e) {
    const configValue = e.target.value;

    if (configType === "filter") {
      dispatch(setConfigOptions({ name, [name]: configValue }));
      dispatch(setStoredPage(1));
      navigate(`/home?page=1`);
    } else
      dispatch(setConfigOptions(configValue === "" ? [] : [name, configValue]));
  }

  function handleSingleClear() {
    dispatch(setStoredPage(1));
    navigate(`/home?page=1`);

    configType === "filter"
      ? dispatch(setConfigOptions({ name, [name]: "" }))
      : dispatch(setConfigOptions([]));

    configRef.current.value = "";
  }

  return (
    <div>
      <label htmlFor={name} onClick={handleSingleClear}>
        {label}
      </label>
      <select
        ref={configRef}
        name={name}
        disabled={disabled}
        defaultValue={defaultValue}
        onChange={handleConfig}
      >
        <option value="">{defaultOption}</option>
        {options}
      </select>
    </div>
  );
}
