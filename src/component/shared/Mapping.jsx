import axios from "axios";
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";

// Fix default marker icon issue
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { toast } from "react-toastify";

// Define the custom icon globally
const customIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41], // Default size
  iconAnchor: [12, 41], // Anchor point of the icon
  popupAnchor: [1, -34], // Anchor point for popups
  shadowSize: [41, 41], // Shadow size
});

export default function Mapping({ showLocation, toLocation }) {
  const mapRef = useRef(null);
  const routingControlRef = useRef(null);

  const fetchCoordinates = async (address) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}`
      );
      if (response.data && response.data.length > 0) {
        const { lat, lon } = response.data[0];
        return { lat, lon };
      } else {
        console.error(`Location not found: ${address}`);
        toast.error(`Location not found: ${address}`)
        return null;
      }
    } catch (error) {
      console.error(`Error fetching location data for ${address}:`, error);
      return null;
    }
  };

  useEffect(() => {
    const initializeRoute = async () => {
      const fromCoordinates = await fetchCoordinates(showLocation);
      const toCoordinates = await fetchCoordinates(toLocation);

      if (!fromCoordinates || !toCoordinates) {
        console.error("Invalid locations for routing");
        return;
      }

      // Initialize the map if not already initialized
      if (!mapRef.current) {
        mapRef.current = L.map("map").setView(
          [fromCoordinates.lat, fromCoordinates.lon],
          13
        );
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(mapRef.current);
      }

      // Remove the existing routing control if it exists
      if (routingControlRef.current) {
        routingControlRef.current.getPlan().setWaypoints([]);
        mapRef.current.removeControl(routingControlRef.current);
        routingControlRef.current = null;
      }

      // Add a new routing control
      routingControlRef.current = L.Routing.control({
        waypoints: [
          L.latLng(fromCoordinates.lat, fromCoordinates.lon),
          L.latLng(toCoordinates.lat, toCoordinates.lon),
        ],
        routeWhileDragging: true,
        show: false, // Hides the direction description
        addWaypoints: false, // Disables adding new waypoints
        createMarker: (i, waypoint) =>
          L.marker(waypoint.latLng, { icon: customIcon }),
      }).addTo(mapRef.current);
      const routingContainer = document.querySelector(
        ".leaflet-routing-container"
      );
      if (routingContainer) {
        routingContainer.style.display = "none";
      }
    };
    initializeRoute();

    // Cleanup function to safely remove the map and routing control
    return () => {
      if (routingControlRef.current) {
        routingControlRef.current.getPlan().setWaypoints([]);
        mapRef.current.removeControl(routingControlRef.current);
        routingControlRef.current = null;
      }
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [showLocation, toLocation]);

  return <div id="map" className="h-[90%] w-full"></div>;
}
