import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { useEffect, useRef, useState } from "react";
import stores from "./stores";

const containerStyle = {
  width: "100%",
  height: "600px",
};

const WORLD_CENTER = { lat: 20, lng: 0 };
const WORLD_ZOOM = 2;

export default function StoreMap() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyAI9kPkskayYti5ttrZL_UfBlL3OkMEbvs",
  });

  const mapRef = useRef(null);
  const infoWindowRef = useRef(null);
  const markersRef = useRef([]);

  const [search, setSearch] = useState("");
  const [filteredStores, setFilteredStores] = useState(stores);

  /* 🔍 Search filter */
  useEffect(() => {
    const q = search.toLowerCase();
    setFilteredStores(
      stores.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.country.toLowerCase().includes(q)
      )
    );
  }, [search]);

  /* 🗺️ Initialize map + markers */
  const onLoad = (map) => {
    mapRef.current = map;
    infoWindowRef.current = new window.google.maps.InfoWindow();

    markersRef.current = filteredStores.map((store) =>
      createMarker(store, map)
    );

    new MarkerClusterer({
      map,
      markers: markersRef.current,
    });
  };

  /* 📍 Create marker */
  const createMarker = (store, map) => {
    const marker = new window.google.maps.Marker({
      position: { lat: store.lat, lng: store.lng },
      title: store.name,
    });

    marker.addListener("click", () => {
      focusStore(store, marker);
    });

    return marker;
  };

  /* 🎯 Focus on store */
  const focusStore = (store, marker = null) => {
    mapRef.current.panTo({ lat: store.lat, lng: store.lng });
    mapRef.current.setZoom(14);

    infoWindowRef.current.setContent(`
      <div style="min-width:220px">
        <h4>${store.name}</h4>
        <p>${store.address}</p>
        <small>${store.country}</small>
      </div>
    `);

    if (marker) {
      infoWindowRef.current.open(mapRef.current, marker);
    }
  };

  /* 🌍 Reset world view */
  const resetView = () => {
    mapRef.current.setZoom(WORLD_ZOOM);
    mapRef.current.panTo(WORLD_CENTER);
    infoWindowRef.current.close();
  };

  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <div style={{ display: "flex", gap: "16px" }}>
      {/* 📋 Sidebar */}
      <div style={{ width: "300px" }}>
        <input
          type="text"
          placeholder="Search store or country..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />

        <button onClick={resetView} style={{ marginBottom: "10px" }}>
          🌍 View All Stores
        </button>

        <div style={{ maxHeight: "500px", overflow: "auto" }}>
          {filteredStores.map((store) => (
            <div
              key={store.id}
              style={{
                padding: "8px",
                borderBottom: "1px solid #ddd",
                cursor: "pointer",
              }}
              onClick={() => focusStore(store)}
            >
              <strong>{store.name}</strong>
              <br />
              <small>{store.country}</small>
            </div>
          ))}
        </div>
      </div>

      {/* 🗺️ Map */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={WORLD_CENTER}
        zoom={WORLD_ZOOM}
        onLoad={onLoad}
      />
    </div>
  );
}
