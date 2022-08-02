/* eslint-disable react-hooks/exhaustive-deps */
// Import packages
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAlienMode } from "../../redux/actions";

// CSS
import detailMain from "../../styles/components/Detail/Detail.module.css";
import invadedDetail from "../../styles/components/Detail/DetailI.module.css";

import mapIcon from "../../styles/images/googlemaps.png";

////////////////////////////////////////////////////////////////////
// Component: show Google Maps centered in selected country
export function Maps() {
  //////////////////////////////////////////////////////////////////////////////
  // Alien
  const dispatch = useDispatch();
  const alienMode = useSelector((state) => state.alienMode);
  const storedMode =
    localStorage.getItem("alienMode") === "true" ? true : false;
  dispatch(setAlienMode(storedMode));

  let mapStyle = useMemo(() => {
    return alienMode ? invadedDetail : detailMain;
  }, [alienMode]);
  //////////////////////////////////////////////////////////////////////////////

  const mapContainer = useRef();
  const country = useSelector((state) => state.countryDetail);

  // Check if google maps api responded
  function googleChecker() {
    if (!window.google?.maps) {
      setTimeout(googleChecker, 500);
    } else {
      renderMap();
    }
  }

  // Create map instance if provided coutry detail
  function renderMap() {
    if (country.latlng) {
      const countryPosition = {
        lat: country.latlng[0],
        lng: country.latlng[1],
      };

      const map = new window.google.maps.Map(mapContainer.current, {
        zoom: 7,
        center: countryPosition,
      });

      new window.google.maps.Marker({
        position: countryPosition,
        map: map,
      });
    }
  }

  // Check/instance google map when country details arrive
  const [gmap, setGmap] = useState({ gmap: true, toggle: false });
  useEffect(() => {
    googleChecker();
    if (window.google) setGmap((prev) => ({ ...prev, gmap: true }));
  }, [country]);

  // Render
  return (
    <>
      <button
        onClick={() => {
          setGmap({ gmap: false, toggle: true });
        }}
        className={gmap.gmap ? `${mapStyle.button}` : `${mapStyle.buttonHide}`}
      >
        <img src={mapIcon} alt="GMapsButton" className={`${mapStyle.icon}`} />
      </button>

      <div
        ref={mapContainer}
        className={gmap.toggle ? `${mapStyle.map}` : `${mapStyle.mapHide}`}
      />
    </>
  );
}
