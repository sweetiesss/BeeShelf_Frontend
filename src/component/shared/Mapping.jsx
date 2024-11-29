import axios from "axios";
import { useEffect, useRef, useState } from "react";

export default function Mapping({ showLocation, height }) {
  const [locationMapping, setLocationMapping] = useState(null);
  const mapRef = useRef(null);
  const mapInstance = useRef(null); // To store the MapQuest map instance
  const markerRef = useRef(null);
  useEffect(() => {
    if (showLocation) {
      getMap();
    }
  }, [showLocation]);

  const getMap = async () => {
    const API_KEY = process.env.REACT_APP_MAP_API_KEY;
    const address = showLocation;

    try {
      const response = await axios.get(
        `https://www.mapquestapi.com/geocoding/v1/address?key=${API_KEY}&location=${address}`
      );
      const location = response.data.results[0].locations[0].latLng;
      console.log(`Latitude: ${location.lat}, Longitude: ${location.lng}`);
      setLocationMapping({ lat: location.lat, lng: location.lng });
    } catch (error) {
      console.error("Error fetching geocoding data:", error);
    }
  };

  useEffect(() => {
    if (locationMapping) {
      initializeOrUpdateMap();
    }
  }, [locationMapping]);

  // const initializeOrUpdateMap = () => {
  //   console.log("location", locationMapping);

  //   if (window.L && mapRef.current) {
  //     window.L.mapquest.key = process.env.REACT_APP_MAP_API_KEY;

  //     if (!mapInstance.current) {
  //       // Initialize the map if not already initialized
  //       mapInstance.current = window.L.mapquest.map(mapRef.current, {
  //         center: [locationMapping.lat, locationMapping.lng],
  //         layers: window.L.mapquest.tileLayer("map"),
  //         zoom: 12,
  //       });
  //       mapInstance.current.addControl(window.L.mapquest.control());
  //     } else {
  //       // Update the existing map instance
  //       mapInstance.current.setView(
  //         [locationMapping.lat, locationMapping.lng],
  //         12 // Optional: Set zoom level
  //       );
  //     }
  //   }
  // };

  const initializeOrUpdateMap = () => {
    if (window.L && mapRef.current) {
      window.L.mapquest.key = process.env.REACT_APP_MAP_API_KEY;

      if (!mapInstance.current) {
        // Initialize the map if not already initialized
        mapInstance.current = window.L.mapquest.map(mapRef.current, {
          center: [locationMapping.lat, locationMapping.lng],
          layers: window.L.mapquest.tileLayer("map"),
          zoom: 12,
        });
        mapInstance.current.addControl(window.L.mapquest.control());
      } else {
        // Update the existing map instance
        mapInstance.current.setView(
          [locationMapping.lat, locationMapping.lng],
          12 // Optional: Set zoom level
        );
      }

      // Add or update the marker using Leaflet's L.marker
      if (markerRef.current) {
        // If marker exists, update its position
        markerRef.current.setLatLng([locationMapping.lat, locationMapping.lng]);
      } else {
        // Add a new marker
        markerRef.current = window.L.marker(
          [locationMapping.lat, locationMapping.lng],
          {
            icon: window.L.mapquest.icons.marker({
              primaryColor: "#1C76BC",
              secondaryColor: "#FFFFFF",
              shadow: true,
              size: "md",
            }),
          }
        ).addTo(mapInstance.current);
      }
    }
  };
  return (
    <div id="map" ref={mapRef} style={{ width: "100%", height: height }}></div>
  );
}
