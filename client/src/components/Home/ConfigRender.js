/* eslint-disable react-hooks/exhaustive-deps */
////////////////////////////////////////////////////////////////////////////////
// Imports
////////////////////////////////////////////////////////////////////////////////
// Packages
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// Application files
import { setStoredPage } from "../../redux/actions";

// CSS
import configMain from "../../styles/components/Home/ConfigRender.module.css";

const config = configMain; // configMain invadedConfig

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

  const [cssLabel, setCssLabel] = useState(false); // Clean label CSS
  useEffect(() => {
    // When Component is filter
    if (configType === "filter")
      if (!filterConfig[name].length) {
        // If "name" filter is empty, set default value for it
        configRef.current.value = "";
        setCssLabel(true);
      } else setCssLabel(false);

    // When Component is order
    if (configType === "order") {
      // Sets default order value when another order is set:
      // i.e. "alphabet" -> "Sin orden" if "population" order is set
      if (!orderConfig.length || orderConfig[0] !== name) {
        configRef.current.value = "";
        setCssLabel(true);
      } else setCssLabel(false);
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
    <div className={`${config.container}`}>
      <label
        htmlFor={name}
        onClick={handleSingleClear}
        className={cssLabel ? `${config.label}` : `${config.labelClean}`}
      >
        {label}
      </label>
      <select
        ref={configRef}
        name={name}
        disabled={disabled}
        defaultValue={defaultValue}
        onChange={handleConfig}
        className={`${config.select}`}
      >
        <option value="" className={`${config.option}`}>
          {defaultOption}
        </option>
        {options}
      </select>
    </div>
  );
}
