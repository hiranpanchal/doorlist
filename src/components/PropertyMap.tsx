"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type Property = {
  id: string;
  title: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  propertyType: string;
  city: string;
  postcode: string;
  latitude: number | null;
  longitude: number | null;
};

function createPriceIcon(price: number, selected: boolean) {
  return L.divIcon({
    className: "",
    html: `<div style="
      background: ${selected ? "var(--color-accent, #3b7dd8)" : "var(--color-ink, #0e3a5c)"};
      color: white;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 700;
      white-space: nowrap;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      border: 2px solid ${selected ? "white" : "transparent"};
      transform: ${selected ? "scale(1.15)" : "scale(1)"};
      transition: all 0.15s;
      font-family: var(--font-hanken), sans-serif;
    ">£${price.toLocaleString()}</div>`,
    iconSize: [0, 0],
    iconAnchor: [40, 20],
  });
}

export default function PropertyMap({
  properties,
}: {
  properties: Property[];
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const mappable = properties.filter((p) => p.latitude && p.longitude);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: "topright" }).addTo(map);
    L.control.attribution({ position: "bottomright", prefix: false }).addTo(map)
      .addAttribution('&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>');

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  // Update markers when properties change
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current.clear();

    if (mappable.length === 0) return;

    // Add new markers
    const bounds = L.latLngBounds([]);

    mappable.forEach((p) => {
      const marker = L.marker([p.latitude!, p.longitude!], {
        icon: createPriceIcon(p.price, p.id === selectedId),
      }).addTo(map);

      marker.on("click", () => {
        setSelectedId(p.id);
        window.open(`/properties/${p.id}`, "_blank");
      });

      marker.bindTooltip(
        `<div style="font-family:var(--font-hanken),sans-serif;padding:4px 0;">
          <strong style="font-size:14px;display:block;margin-bottom:2px;">${p.title}</strong>
          <span style="color:#666;font-size:12px;">${p.bedrooms} bed · ${p.bathrooms} bath · ${p.city}</span>
        </div>`,
        { direction: "top", offset: [0, -10] }
      );

      markersRef.current.set(p.id, marker);
      bounds.extend([p.latitude!, p.longitude!]);
    });

    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
  }, [mappable, selectedId]);

  if (mappable.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-border p-12 text-center">
        <p className="text-lg font-medium text-ink mb-2">No map data available</p>
        <p className="text-sm text-muted">Properties need coordinates to appear on the map.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        ref={mapRef}
        className="w-full rounded-2xl border border-border overflow-hidden"
        style={{ height: "calc(100vh - 340px)", minHeight: 500 }}
      />
      {/* Property cards below map */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {mappable.map((p) => (
          <a
            key={p.id}
            href={`/properties/${p.id}`}
            className={`flex-shrink-0 w-64 bg-white rounded-xl border p-4 transition-all hover:shadow-md ${
              selectedId === p.id ? "border-accent shadow-md" : "border-border"
            }`}
            onMouseEnter={() => {
              setSelectedId(p.id);
              const marker = markersRef.current.get(p.id);
              if (marker) marker.setIcon(createPriceIcon(p.price, true));
            }}
            onMouseLeave={() => {
              setSelectedId(null);
              const marker = markersRef.current.get(p.id);
              if (marker) marker.setIcon(createPriceIcon(p.price, false));
            }}
          >
            <p
              className="font-bold text-ink text-sm truncate mb-1"
              style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
            >
              {p.title}
            </p>
            <p className="text-xs text-muted">{p.city}, {p.postcode}</p>
            <p className="text-base font-bold text-ink mt-2">
              £{p.price.toLocaleString()}<span className="text-xs text-muted font-normal"> /mo</span>
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
