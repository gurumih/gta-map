import { Marker } from '../../types/map.types';
import './MarkerList.css';

interface MarkerListProps {
  markers: Marker[];
  onRemoveMarker: (id: string) => void;
  onClearAll: () => void;
  onLocateMarker: (marker: Marker) => void;
}

export default function MarkerList({ markers, onRemoveMarker, onClearAll, onLocateMarker }: MarkerListProps) {
  return (
    <div className="marker-list">
      <div className="marker-list-header">
        <h2>Markers ({markers.length})</h2>
        {markers.length > 0 && (
          <button 
            className="btn-clear-all" 
            onClick={onClearAll}
            title="Clear all markers"
          >
            Clear All
          </button>
        )}
      </div>
      
      {markers.length === 0 ? (
        <div className="empty-state">
          <p>No markers yet</p>
          <p className="hint">Double-click the map or use the buttons above</p>
        </div>
      ) : (
        <div className="marker-items">
          {markers.map((marker) => (
            <div key={marker.id} className="marker-item">
              <div className="marker-info">
                <div className="marker-title">{marker.title}</div>
              </div>
              <div className="marker-actions">
                <button
                  className="btn-locate"
                  onClick={() => onLocateMarker(marker)}
                  title="Locate on map"
                >
                  📍
                </button>
                <button
                  className="btn-remove"
                  onClick={() => onRemoveMarker(marker.id)}
                  title="Remove marker"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
