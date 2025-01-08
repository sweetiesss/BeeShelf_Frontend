import axios from "axios";
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import fromIcon from "../../assets/img/fromIcon.svg";
import toLocation from "../../assets/img/toLocation.svg";
import nearestStoreLocation from "../../assets/img/nearestStoreLocation.svg";
import { toast } from "react-toastify";
import { t } from "i18next";
const blueIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41], // Default size
  iconAnchor: [12, 41], // Anchor point of the icon
  popupAnchor: [1, -34], // Anchor point for popups
  shadowSize: [41, 41], // Shadow size
});
const greenIcon = L.icon({
  iconUrl: nearestStoreLocation,
  shadowUrl: markerShadow,
  iconSize: [25, 41], // Default size
  iconAnchor: [12, 41], // Anchor point of the icon
  popupAnchor: [1, -34], // Anchor point for popups
  shadowSize: [41, 41], // Shadow size
});
const whiteIcon = L.icon({
  iconUrl: fromIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41], // Default size
  iconAnchor: [12, 41], // Anchor point of the icon
  popupAnchor: [1, -34], // Anchor point for popups
  shadowSize: [41, 41], // Shadow size
});
const redIcon = L.icon({
  iconUrl: toLocation,
  shadowUrl: markerShadow,
  iconSize: [25, 41], 
  iconAnchor: [12, 41],
  popupAnchor: [1, -34], 
  shadowSize: [41, 41], 
});

export default function MappingOrder({
  showLocation,
  toLocation,
  defaultLocation,
  setDistance,
  setLatLng,
  data,
  data2,
}) {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const routingControlRef = useRef(null);
  const lastCoordinatesRef = useRef(null);
  const fetchCoordinates = async (address, defaultAddress) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}`
      );
      if (response.data && response.data.length > 0) {
        const { lat, lon } = response.data[0];

        return { lat, lon };
      } else if (defaultAddress) {
        const response2 = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            defaultAddress
          )}`
        );
        if (response2.data && response2.data.length > 0) {
          const { lat, lon } = response2.data[0];
          return { lat, lon };
        }
      }
      console.error("Location not found: ${address}");
      return null;
    } catch (error) {
      console.error("Error fetching location data for ${address}:, error");
      return null;
    }
  };

  useEffect(() => {
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
  }, []);
  useEffect(() => {
    const initializeMap = async () => {
      const fromCoordinates = showLocation?.location
        ? await fetchCoordinates(showLocation?.location, defaultLocation)
        : null;

      if (fromCoordinates) {
      
        if (
          !lastCoordinatesRef.current ||
          lastCoordinatesRef.current.lat !== fromCoordinates.lat ||
          lastCoordinatesRef.current.lon !== fromCoordinates.lon
        ) {
          lastCoordinatesRef.current = fromCoordinates; 
          setLatLng(fromCoordinates); 
        }
      }

      const toCoordinates = toLocation?.location
        ? await fetchCoordinates(toLocation?.location, "")
        : null;
      if (!mapContainerRef.current) {
        console.error("Map container is not ready yet.");
        return;
      }
      if (!mapRef.current) {
        const initialCoordinates = fromCoordinates ||
          toCoordinates || {
            lat: 21.028511, 
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
      if (routingControlRef.current) {
        routingControlRef.current.getPlan().setWaypoints([]);
        mapRef.current.removeControl(routingControlRef.current);
        routingControlRef.current = null;
      }
      if (data) {
        data.forEach((item) => {
          if (item.latitude && item.longitude) {
            L.marker([item.latitude, item.longitude], { icon: blueIcon })
              .addTo(mapRef.current)
              .bindPopup(
                `<b>${item.name}</b><br>${item.location || "No address"}`
              );
          }
        });
      }
      if (data2) {
        data2.forEach((item) => {
          if (item.latitude && item.longitude) {
            L.marker([item.latitude, item.longitude], { icon: redIcon })
              .addTo(mapRef.current)
              .bindPopup(
                `<b>${item.name}</b><br>${item.location || "No address"}`
              );
          }
        });
      }

      if (fromCoordinates && !toCoordinates) {
        L.marker([fromCoordinates.lat, fromCoordinates.lon], {
          icon: whiteIcon,
        })
          .addTo(mapRef.current)
          .bindPopup(
            `<b style="text-align:center">${showLocation?.name}</b><br>${showLocation?.location}`
          )
          .openPopup();
        return;
      }
      if (fromCoordinates && toCoordinates) {
        routingControlRef.current = L.Routing.control({
          waypoints: [
            L.latLng(fromCoordinates.lat, fromCoordinates.lon),
            L.latLng(toCoordinates.lat, toCoordinates.lon),
          ],
          routeWhileDragging: true,
          show: false, // Hide the direction table
          addWaypoints: false,
          lineOptions: {
            styles: [{ color: "blue", weight: 5 }], // Set the line color to blue and adjust thickness
          },
          createMarker: (i, waypoint) => {
            if (i === 0) {
              return L.marker(waypoint.latLng, {
                icon: whiteIcon,
              }).bindPopup(
                `
                <b>From Location:</b><br>
                ${showLocation?.name || "Unknown"}<br>
                ${showLocation?.location || "No Address"}
              `
              );
            }
            if (i === 1) {
              return L.marker(waypoint.latLng, {
                icon: greenIcon,
              }).bindPopup(
                `
                 <b>To Location:</b><br>
                ${toLocation?.name}<br>
              `
              );
            }
            return L.marker(waypoint.latLng, { icon: blueIcon });
          },
        })
          .on("routesfound", function (e) {
            const routes = e.routes;
            const distance = routes[0].summary.totalDistance / 1000; // Convert to kilometers
            setDistance(distance);

            const duration = routes[0].summary.totalTime / 60; // Convert to minutes

            L.popup()
              .setLatLng([toCoordinates.lat, toCoordinates.lon])
              .setContent(
                `
                <b>To Location:</b><br>
                ${toLocation?.name}<br>
                <b>Route Information:</b><br>
                Distance: ${distance.toFixed(2)} km<br>
                Duration: ${duration.toFixed(0)} minutes
              `
              )
              .openOn(mapRef.current);
          })
          .addTo(mapRef.current);

        const routingContainer = document.querySelector(
          ".leaflet-routing-container"
        );
        if (routingContainer) {
          routingContainer.style.display = "none";
        }
        return;
      }
    };
    initializeMap();
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
  }, [showLocation, toLocation, setLatLng]);

  return <div ref={mapContainerRef} id="map" className="h-full w-full"></div>;
}
