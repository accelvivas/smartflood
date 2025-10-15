import { useEffect, useRef } from 'react';
import L from 'leaflet';

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface Sensor {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: "online" | "offline";
  waterLevel: number;
  riskLevel: "low" | "medium" | "high";
}

interface LeafletMapProps {
  sensors: Sensor[];
  onSensorSelect: (sensor: Sensor) => void;
  selectedSensor: Sensor | null;
}

export function LeafletMap({ sensors, onSensorSelect, selectedSensor }: LeafletMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize map centered on Philippines (Lipa, Batangas area)
    const map = L.map(mapContainerRef.current).setView([13.9411, 121.1634], 13);
    mapRef.current = map;

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    // Add markers for each sensor
    sensors.forEach((sensor) => {
      const riskColors = {
        high: '#e53935',
        medium: '#ffc107',
        low: '#8bc34a'
      };

      const pulseAnimation = sensor.riskLevel === 'high' && sensor.status === 'online' 
        ? `@keyframes marker-pulse-${sensor.id} {
            0%, 100% { box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); }
            50% { box-shadow: 0 4px 20px rgba(229, 57, 53, 0.8), 0 0 0 8px rgba(229, 57, 53, 0.2); }
          }` 
        : '';

      const iconHtml = `
        <style>${pulseAnimation}</style>
        <div style="
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: ${riskColors[sensor.riskLevel]};
          border: 3px solid ${sensor.status === 'offline' ? '#999' : '#fff'};
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.2s;
          ${sensor.riskLevel === 'high' && sensor.status === 'online' ? `animation: marker-pulse-${sensor.id} 2s infinite;` : ''}
          opacity: ${sensor.status === 'offline' ? '0.5' : '1'};
        ">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-sensor-marker',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
      });

      const marker = L.marker([sensor.lat, sensor.lng], { icon: customIcon })
        .addTo(mapRef.current!)
        .bindPopup(`
          <div style="font-family: system-ui, sans-serif; min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #1e4a7a;">
              ${sensor.name}
            </h3>
            <div style="font-size: 12px; color: #546e7a; line-height: 1.6;">
              <p style="margin: 4px 0;">
                <strong>Status:</strong> 
                <span style="color: ${sensor.status === 'online' ? '#8bc34a' : '#999'};">
                  ${sensor.status}
                </span>
              </p>
              <p style="margin: 4px 0;">
                <strong>Water Level:</strong> ${sensor.waterLevel.toFixed(1)}m
              </p>
              <p style="margin: 4px 0;">
                <strong>Risk:</strong> 
                <span style="color: ${riskColors[sensor.riskLevel]}; text-transform: uppercase; font-weight: 600;">
                  ${sensor.riskLevel}
                </span>
              </p>
            </div>
            <button 
              onclick="window.selectSensorFromMap('${sensor.id}')"
              style="
                margin-top: 8px;
                width: 100%;
                padding: 6px 12px;
                background: linear-gradient(135deg, #1e4a7a, #00bcd4);
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                font-weight: 500;
              "
            >
              View Details
            </button>
          </div>
        `)
        .on('click', () => {
          onSensorSelect(sensor);
        });

      markersRef.current[sensor.id] = marker;
    });

    // Global function for popup button
    (window as any).selectSensorFromMap = (sensorId: string) => {
      const sensor = sensors.find(s => s.id === sensorId);
      if (sensor) {
        onSensorSelect(sensor);
      }
    };
  }, [sensors, onSensorSelect]);

  // Highlight selected sensor
  useEffect(() => {
    if (!selectedSensor || !mapRef.current) return;

    const marker = markersRef.current[selectedSensor.id];
    if (marker) {
      mapRef.current.setView([selectedSensor.lat, selectedSensor.lng], 15, {
        animate: true,
        duration: 0.5
      });
      marker.openPopup();
    }
  }, [selectedSensor]);

  return (
    <>
      <style>{`
        .custom-sensor-marker {
          background: transparent !important;
          border: none !important;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        .leaflet-popup-tip {
          background: white;
        }
        .leaflet-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }
      `}</style>
      <div 
        ref={mapContainerRef} 
        style={{ 
          width: '100%', 
          height: '100%',
          borderRadius: '0.5rem',
          overflow: 'hidden',
          position: 'relative',
          zIndex: 0
        }} 
      />
    </>
  );
}
