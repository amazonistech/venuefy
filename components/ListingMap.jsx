"use client";

import { useEffect, useRef, useState } from "react";

export default function ListingMap({ items }) {
  const node = useRef(null);
  const map = useRef(null);
  const layer = useRef(null);
  const [leaflet, setLeaflet] = useState(null);
  const [failed, setFailed] = useState(false);
  const hasPins = items.some((item) => item.coordinates);

  useEffect(() => {
    if (!hasPins) return;
    let active = true;
    import("leaflet").then(({ default: L }) => {
      if (!active || !node.current) return;
      map.current = L.map(node.current, { scrollWheelZoom: false }).setView([22.8, 79.5], 5);
      layer.current = L.layerGroup().addTo(map.current);
      L.tileLayer(process.env.NEXT_PUBLIC_MAP_TILE_URL || "https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        referrerPolicy: "strict-origin-when-cross-origin",
      }).addTo(map.current);
      setLeaflet(L);
    }).catch(() => { if (active) setFailed(true); });
    return () => {
      active = false;
      map.current?.remove();
      map.current = null;
    };
  }, [hasPins]);

  useEffect(() => {
    if (!map.current || !leaflet) return;
    layer.current.clearLayers();
    const points = items.filter((item) => item.coordinates);
    for (const item of points) {
      const icon = leaflet.divIcon({ className: "map-price", html: "", iconSize: [80, 30] });
      const marker = leaflet.marker(item.coordinates, { icon, title: item.name }).addTo(layer.current);
      marker.getElement().textContent = item.price;
      const popup = document.createElement(item.href ? "a" : "strong");
      popup.textContent = item.name;
      if (item.href) popup.href = item.href;
      marker.bindPopup(popup);
    }
    if (points.length) map.current.fitBounds(points.map((item) => item.coordinates), { padding: [34, 34], maxZoom: 14 });
  }, [items, leaflet]);

  if (!hasPins || failed) return <div className="map-empty"><i className="bi bi-geo-alt" aria-hidden="true" /><p>{failed ? "The map could not load." : "Map pins appear when a listing has a published location."}</p></div>;
  return <div ref={node} className="catalog-map" aria-label="Map of published locations" />;
}
