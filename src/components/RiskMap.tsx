import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { DISTRICT_COORDS } from '../constants';
import { KERALA_GEOJSON } from '../data/kerala_districts';

interface MapProps {
  riskLevels: Record<string, number>;
  selectedDistrict: string | null;
  onSelectDistrict: (name: string) => void;
}

const MapUpdater = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 7);
  }, [center, map]);
  return null;
};

export default function RiskMap({ riskLevels, selectedDistrict, onSelectDistrict }: MapProps) {
  const getRiskColor = (score: number) => {
    if (score > 70) return '#ef4444'; // red-500
    if (score > 40) return '#f59e0b'; // amber-500
    return '#22c55e'; // green-500
  };

  const districtStyle = (feature: any) => {
    const name = feature.properties.name;
    const score = riskLevels[name] || 0;
    const isSelected = selectedDistrict === name;
    return {
      fillColor: getRiskColor(score),
      weight: isSelected ? 3 : 1,
      opacity: 1,
      color: isSelected ? 'white' : '#27272a',
      fillOpacity: isSelected ? 0.8 : 0.6
    };
  };

  const keralaCenter: [number, number] = [10.8505, 76.2711];

  return (
    <div className="h-[500px] w-full rounded-2xl overflow-hidden border border-white/5 bg-zinc-950 shadow-2xl relative">
      <MapContainer 
        center={keralaCenter} 
        zoom={7} 
        style={{ height: '100%', width: '100%', background: '#09090b' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        <GeoJSON 
          data={KERALA_GEOJSON} 
          style={districtStyle}
          onEachFeature={(feature: any, layer: any) => {
            const name = feature.properties.name;
            layer.on({
              click: (e: any) => {
                  onSelectDistrict(name);
                  // Ensure map focuses correctly
                  const map = e.target._map;
                  map.setView(e.target.getBounds().getCenter(), 8);
              },
              mouseover: (e: any) => {
                  const layer = e.target;
                  layer.setStyle({
                    fillOpacity: 0.9,
                    weight: 2
                  });
              },
              mouseout: (e: any) => {
                  const layer = e.target;
                  layer.setStyle(districtStyle(feature));
              }
            });
            layer.bindTooltip(`
              <div class="p-2 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl">
                <p class="text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-1">${name}</p>
                <div class="flex items-baseline gap-2">
                  <span class="text-xl font-bold text-white">${riskLevels[name] || 0}</span>
                  <span class="text-[8px] uppercase text-zinc-600 font-bold">Severity Index</span>
                </div>
              </div>
            `, { sticky: true, className: 'custom-leaflet-tooltip' });
          }}
        />

        <MapUpdater center={keralaCenter} />
      </MapContainer>

      {/* Map Legend Floating Overlay */}
      <div className="absolute bottom-6 right-6 bg-zinc-900/80 backdrop-blur-md border border-white/10 p-4 rounded-2xl z-[1000] scale-90 origin-bottom-right">
        <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Risk Severity</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500" />
            <span className="text-[11px] font-bold text-zinc-300">High (&gt;70)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-[11px] font-bold text-zinc-300">Moderate (40-70)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-bold text-zinc-300">Low (&lt;40)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
