import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./Map.module.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvent,
} from "react-leaflet";
import { useCities } from "../contexts/CitiesContext";
import { useEffect, useState } from "react";

function Map() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [currentView, setCurrentView] = useState([51, 17]);

  const mapLat = parseFloat(searchParams.get("lat"));
  const mapLng = parseFloat(searchParams.get("lng"));

  const { cities } = useCities();

  useEffect(() => {
    if (mapLat && mapLng) setCurrentView([mapLat, mapLng]);
  }, [mapLat, mapLng]);

  return (
    <div className={styles.mapContainer}>
      <MapContainer
        className={styles.map}
        center={currentView}
        zoom={6}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              <span>{city.emoji}</span> <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}
        <ChangePositionToDisplayMarker position={currentView} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

function ChangePositionToDisplayMarker({ position }) {
  const map = useMap();
  map.flyTo(position, 6);
  return null;
}

function DetectClick() {
  const navigate = useNavigate();

  useMapEvent({
    click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  });
}

export default Map;
