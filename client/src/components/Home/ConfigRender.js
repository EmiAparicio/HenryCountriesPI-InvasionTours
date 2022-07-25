/* eslint-disable react-hooks/exhaustive-deps */
////////////////////////////////////////////////////////////////////////////////
// Imports
////////////////////////////////////////////////////////////////////////////////
// Packages
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

// Application files
import { setStoredPage } from "../../redux/actions";

////////////////////////////////////////////////////////////////////////////////
// Code
////////////////////////////////////////////////////////////////////////////////
// Component: filter/order
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
  const dispatch = useDispatch();

  const configRef = useRef(); // Used later to set default option as active

  // Filter/Order instructions from store state
  const orderConfig = useSelector((state) => state.orderConfig);
  const filterConfig = useSelector((state) => state.filterConfig);

  //////////////////////////////////////////////////////////////////////////////
  // Set default options when needed
  useEffect(() => {
    // When Component is filter
    if (configType === "filter")
      if (!filterConfig[name].length)
        // If "name" filter is empty, set default value for it
        configRef.current.value = "";

    // When Component is order
    if (configType === "order") {
      // Sets default order value when another order is set:
      // i.e. "alphabet" -> "Sin orden" if "population" order is set
      if (!orderConfig.length || orderConfig[0] !== name)
        configRef.current.value = "";
    }
  }, [filterConfig, orderConfig]);

  //////////////////////////////////////////////////////////////////////////////
  // CONFIG (filter/order) selection handler
  function handleConfig(e) {
    const configValue = e.target.value;

    // When Component is filter
    if (configType === "filter") {
      // Modify specific "name" filter in store state
      dispatch(setConfigOptions({ name, [name]: configValue }));

      // Reset page after filter
      dispatch(setStoredPage(1));
    }
    // When Component is order
    if (configType === "order")
      dispatch(setConfigOptions(configValue === "" ? [] : [name, configValue]));
  }

  //////////////////////////////////////////////////////////////////////////////
  // CLEAR single config handler
  function handleSingleClear() {
    // When Component is filter
    if (configType === "filter")
      dispatch(setConfigOptions({ name, [name]: "" }));

    // When Component is order
    if (configType === "order") dispatch(setConfigOptions([]));

    // Sets config value to default
    configRef.current.value = "";

    // Reset page after filter
    dispatch(setStoredPage(1));
  }

  //////////////////////////////////////////////////////////////////////////////
  // Render
  //////////////////////////////////////////////////////////////////////////////
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
