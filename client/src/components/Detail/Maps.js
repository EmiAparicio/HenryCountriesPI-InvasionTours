/* eslint-disable react-hooks/exhaustive-deps */
// Import packages
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

////////////////////////////////////////////////////////////////////
// Component: show Google Maps centered in selected country
export function Maps() {
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
  useEffect(() => {
    googleChecker();
  }, [country]);

  // Render
  return (
    <div>
      <div ref={mapContainer} style={{ width: 500, height: 500 }} />
    </div>
  );
}
