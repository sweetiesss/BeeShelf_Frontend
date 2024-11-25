import axios from "axios";
import { useEffect, useRef, useState } from "react";

export default function Mapping({ showLocation }) {
  const [locationMapping, setLocationMapping] = useState();
  const mapRef = useRef(null);

  useEffect(() => {
    try {
      getMap();
      // Load MapQuest scripts dynamically
    } catch (e) {
      console.log(e);
    }
  }, []);
  useEffect(() => {
    try {
        initializeMap();
      // Load MapQuest scripts dynamically
    } catch (e) {
      console.log(e);
    }
  }, [locationMapping]);

  const getMap = async () => {
    const API_KEY = process.env.REACT_APP_MAP_API_KEY;
    const address = showLocation;

    await axios
      .get(
        `https://www.mapquestapi.com/geocoding/v1/address?key=${API_KEY}&location=${address}`
      )
      .then((response) => {
        const location = response.data.results[0].locations[0].latLng;
        console.log(`Latitude: ${location.lat}, Longitude: ${location.lng}`);
        setLocationMapping({ lat: location.lat, lng: location.lng });
      })
      .catch((error) => {
        console.error("Error fetching geocoding data:", error);
      });
  };

  const initializeMap = () => {
    if (window.L && mapRef.current) {
      window.L.mapquest.key = process.env.REACT_APP_MAP_API_KEY;
      const map = window.L.mapquest.map(mapRef.current, {
        center: [locationMapping.lat, locationMapping.lng], // Latitude/Longitude
        // center: [24.84914751862788, 66.97978857106827], // Latitude/Longitude
        layers: window.L.mapquest.tileLayer("map"),
        zoom: 12,
      });

      map.addControl(window.L.mapquest.control());
    }
  };

  return (
    <div
      id="map"
      ref={mapRef}
      style={{ width: "100%", height: "400px", marginTop: "20px" }}
    ></div>
  );
}
