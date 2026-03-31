import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { DISTRICT_COORDS } from '../constants';

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

  const keralaCenter: [number, number] = [10.8505, 76.2711];

  return (
    <div className="h-[500px] w-full rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl">
      <MapContainer 
        center={keralaCenter} 
        zoom={7} 
        style={{ height: '100%', width: '100%', background: '#18181b' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        {Object.entries(DISTRICT_COORDS).map(([name, coords]) => {
          const score = riskLevels[name] || 0;
          const isSelected = selectedDistrict === name;
          
          return (
            <CircleMarker
              key={name}
              center={coords}
              pathOptions={{ 
                fillColor: getRiskColor(score), 
                color: isSelected ? '#fff' : getRiskColor(score),
                weight: isSelected ? 3 : 1,
                fillOpacity: 0.6 
              }}
              radius={10 + (score / 10)}
              eventHandlers={{
                click: () => onSelectDistrict(name)
              }}
            >
              <Popup className="custom-popup">
                <div className="p-2">
                  <h3 className="font-bold text-zinc-900">{name}</h3>
                  <p className="text-sm text-zinc-700">Risk Score: <span className="font-mono font-bold">{score}</span></p>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
        <MapUpdater center={keralaCenter} />
      </MapContainer>
    </div>
  );
}
