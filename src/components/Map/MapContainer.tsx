import { MapContainer as LeafletMap, TileLayer, useMapEvents, Marker as LeafletMarker, Popup, ZoomControl, useMap } from 'react-leaflet';
import L, { CRS } from 'leaflet';
import { useEffect } from 'react';
import { Marker } from '../../types/map.types';
import { gtaToLeaflet, leafletToGta } from '../../utils/coordinateTransform';
import 'leaflet/dist/leaflet.css';
import './MapContainer.css';

// Create colored marker icons
const createColoredIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"><div style="width: 8px; height: 8px; background: white; border-radius: 50%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(45deg);"></div></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  });
};

interface MapContainerProps {
  markers: Marker[];
  onAddMarker: (marker: Marker) => void;
  onRemoveMarker: (id: string) => void;
  focusedMarker: Marker | null;
}

function MapClickHandler({ onAddMarker }: { onAddMarker: (marker: Marker) => void }) {
  useMapEvents({
    dblclick: (e) => {
      const { lat, lng } = e.latlng;
      const gtaCoords = leafletToGta(lat, lng);
      
      const title = prompt('Enter marker title:');
      if (!title || title.trim() === '') {
        return; // Cancel if no title provided
      }
      
      const newMarker: Marker = {
        id: Date.now().toString(),
        x: gtaCoords.x,
        y: gtaCoords.y,
        title: title.trim(),
        color: '#4d90fe',
        createdAt: Date.now(),
      };
      
      onAddMarker(newMarker);
    },
  });
  
  return null;
}

function MapFocusHandler({ focusedMarker }: { focusedMarker: Marker | null }) {
  const map = useMap();
  
  useEffect(() => {
    if (focusedMarker) {
      const [lat, lng] = gtaToLeaflet(focusedMarker.x, focusedMarker.y);
      map.setView([lat, lng], Math.max(map.getZoom(), 3), {
        animate: true,
        duration: 0.5
      });
    }
  }, [focusedMarker, map]);
  
  return null;
}

export default function MapContainer({ markers, onAddMarker, onRemoveMarker, focusedMarker }: MapContainerProps) {
  const handleCopyCoords = (x: number, y: number, event: React.MouseEvent<HTMLButtonElement>) => {
    const coords = `${x.toFixed(2)}, ${y.toFixed(2)}`;
    navigator.clipboard.writeText(coords).then(() => {
      const btn = event.currentTarget;
      const originalText = btn.innerHTML;
      btn.innerHTML = 'Copied!';
      btn.style.opacity = '0.7';
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.opacity = '';
      }, 1200);
    });
  };
  // Custom CRS matching gtamap.xyz configuration
  const CUSTOM_CRS = L.extend({}, CRS.Simple, {
    projection: L.Projection.LonLat,
    scale: function (zoom: number) {
      return Math.pow(2, zoom);
    },
    zoom: function (scale: number) {
      return Math.log(scale) / 0.6931471805599453;
    },
    distance: function (latlng1: L.LatLng, latlng2: L.LatLng) {
      const dx = latlng2.lng - latlng1.lng;
      const dy = latlng2.lat - latlng1.lat;
      return Math.sqrt(dx * dx + dy * dy);
    },
    transformation: new L.Transformation(0.02072, 117.3, -0.0205, 172.8),
    infinite: true,
  });

  return (
    <LeafletMap
      center={[0, 0]}
      zoom={2}
      minZoom={0}
      maxZoom={5}
      crs={CUSTOM_CRS}
      className="leaflet-map"
      preferCanvas={true}
      zoomControl={false}
    >
      <ZoomControl position="topright" />
      
      <TileLayer
        url={`${import.meta.env.BASE_URL}tiles/styleAtlas/{z}/{x}/{y}.jpg`}
        attribution=''
        minZoom={0}
        maxZoom={5}
        maxNativeZoom={5}
        noWrap={true}
        tms={false}
      />
      
      <MapClickHandler onAddMarker={onAddMarker} />
      <MapFocusHandler focusedMarker={focusedMarker} />
      
      {markers.map((marker) => {
        const [lat, lng] = gtaToLeaflet(marker.x, marker.y);
        const icon = createColoredIcon(marker.color || '#4d90fe');
        return (
          <LeafletMarker key={marker.id} position={[lat, lng]} icon={icon}>
            <Popup>
              <div className="marker-popup">
                <div className="popup-title">
                  {marker.title}
                </div>
                <div className="popup-coords">
                  {marker.x.toFixed(2)}, {marker.y.toFixed(2)}
                </div>
                <div className="popup-actions">
                  <button 
                    className="popup-btn popup-btn-copy"
                    onClick={(e) => handleCopyCoords(marker.x, marker.y, e)}
                    title="Copy coordinates"
                  >
                    Copy
                  </button>
                  <button 
                    className="popup-btn popup-btn-remove"
                    onClick={() => onRemoveMarker(marker.id)}
                    title="Remove marker"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </Popup>
          </LeafletMarker>
        );
      })}
    </LeafletMap>
  );
}
