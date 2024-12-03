
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

export default function Mapping({
  showLocation,
  toLocation,
  cloneWarehouseData,
}) {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null); // Ref for the map container div
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
        // toast.error(`Location not found: ${address}`);
        return null;
      }
    } catch (error) {
      console.error(`Error fetching location data for ${address}:`, error);
      return null;
    }
  };

  useEffect(() => {
    const initializeMap = async () => {
      const fromCoordinates = showLocation
        ? await fetchCoordinates(showLocation)
        : null;
      const toCoordinates = toLocation
        ? await fetchCoordinates(toLocation)
        : null;
      const { location = null, deliveryZones = [] } = cloneWarehouseData || {};

      // Ensure the map container is available
      if (!mapContainerRef.current) {
        console.error("Map container is not ready yet.");
        return;
      }

      // Initialize the map if not already initialized
      if (!mapRef.current) {
        const initialCoordinates = fromCoordinates || {
          lat: 21.028511, // Default to Hanoi's coordinates
          lon: 105.804817,
        };
        mapRef.current = L.map(mapContainerRef.current).setView(
          [initialCoordinates.lat, initialCoordinates.lon],
          13
        );
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(mapRef.current);
      }

      // Clear existing routing control if any
      if (routingControlRef.current) {
        routingControlRef.current.getPlan().setWaypoints([]);
        mapRef.current.removeControl(routingControlRef.current);
        routingControlRef.current = null;
      }

      // Case 1: Only showLocation is provided
      if (fromCoordinates && !toCoordinates && !cloneWarehouseData) {
        L.marker([fromCoordinates.lat, fromCoordinates.lon], {
          icon: customIcon,
        })
          .addTo(mapRef.current)
          .bindPopup(`<b>${showLocation}</b>`)
          .openPopup();
        return;
      }

      // Case 2: Both showLocation and toLocation are provided
      if (fromCoordinates && toCoordinates && !cloneWarehouseData) {
        routingControlRef.current = L.Routing.control({
          waypoints: [
            L.latLng(fromCoordinates.lat, fromCoordinates.lon),
            L.latLng(toCoordinates.lat, toCoordinates.lon),
          ],
          routeWhileDragging: true,
          show: false, // Hide the direction table
          addWaypoints: false,
          createMarker: (i, waypoint) =>
            L.marker(waypoint.latLng, { icon: customIcon }),
        }).addTo(mapRef.current);
        const routingContainer = document.querySelector(
          ".leaflet-routing-container"
        );
        if (routingContainer) {
          routingContainer.style.display = "none";
        }
        return;
      }

      // Case 3: cloneWarehouseData is provided
      if (cloneWarehouseData) {
        const warehouseCoordinates = location
          ? await fetchCoordinates(location)
          : null;

        if (warehouseCoordinates) {
          L.marker([warehouseCoordinates.lat, warehouseCoordinates.lon], {
            icon: customIcon,
          })
            .addTo(mapRef.current)
            .bindPopup(`<b>Warehouse: ${cloneWarehouseData.name}</b>`)
            .openPopup();
        }

        deliveryZones.forEach(async (zone) => {
          const zoneCoordinates = await fetchCoordinates(zone.name);
          if (zoneCoordinates) {
            L.circle([zoneCoordinates.lat, zoneCoordinates.lon], {
              color: "blue",
              fillColor: "lightblue",
              fillOpacity: 0.5,
              radius: 2000, // Adjust the radius as needed
            })
              .addTo(mapRef.current)
              .bindPopup(`<b>${zone.name}</b>`);
          }
        });

        // Add direction from warehouse to the first delivery zone
        if (warehouseCoordinates && deliveryZones.length > 0) {
          const firstZoneCoordinates = await fetchCoordinates(
            deliveryZones[0].name
          );
          if (firstZoneCoordinates) {
            routingControlRef.current = L.Routing.control({
              waypoints: [
                L.latLng(warehouseCoordinates.lat, warehouseCoordinates.lon),
                L.latLng(firstZoneCoordinates.lat, firstZoneCoordinates.lon),
              ],
              routeWhileDragging: true,
              show: false, // Hide the direction table
              addWaypoints: false,
              createMarker: (i, waypoint) =>
                L.marker(waypoint.latLng, { icon: customIcon }),
            }).addTo(mapRef.current);
          }
        }
      }
    };

    initializeMap();

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
  }, [showLocation, toLocation, cloneWarehouseData]);

  return <div ref={mapContainerRef} id="map" className="h-full w-full"></div>;
}
