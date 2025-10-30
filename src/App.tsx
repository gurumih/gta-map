import { useState } from 'react'
import MapContainer from './components/Map/MapContainer'
import CoordinateInput from './components/CoordinateInput/CoordinateInput'
import BulkImport from './components/BulkImport/BulkImport'
import MarkerList from './components/MarkerList/MarkerList'
import { Marker } from './types/map.types'
import './App.css'

function App() {
  const [markers, setMarkers] = useState<Marker[]>(() => {
    const saved = localStorage.getItem('gta-markers')
    return saved ? JSON.parse(saved) : []
  })
  const [showAddMarker, setShowAddMarker] = useState(false)
  const [showBulkImport, setShowBulkImport] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [focusedMarker, setFocusedMarker] = useState<Marker | null>(null)

  const addMarker = (marker: Marker) => {
    const newMarkers = [...markers, marker]
    setMarkers(newMarkers)
    localStorage.setItem('gta-markers', JSON.stringify(newMarkers))
  }

  const removeMarker = (id: string) => {
    const newMarkers = markers.filter(m => m.id !== id)
    setMarkers(newMarkers)
    localStorage.setItem('gta-markers', JSON.stringify(newMarkers))
  }

  const clearAllMarkers = () => {
    setMarkers([])
    localStorage.removeItem('gta-markers')
  }

  const importMarkers = (newMarkers: Marker[]) => {
    const updatedMarkers = [...markers, ...newMarkers]
    setMarkers(updatedMarkers)
    localStorage.setItem('gta-markers', JSON.stringify(updatedMarkers))
  }

  const locateMarker = (marker: Marker) => {
    setFocusedMarker(marker)
    // Reset after a moment so subsequent clicks on the same marker still work
    setTimeout(() => setFocusedMarker(null), 100)
  }

  return (
    <div className="app-container">
      <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <h1>GTA Map</h1>
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? '→' : '←'}
          </button>
        </div>
        
        <div className="action-buttons">
          <button className="btn-action" onClick={() => setShowAddMarker(true)}>
            Add Marker
          </button>
          <button className="btn-action" onClick={() => setShowBulkImport(true)}>
            Bulk Import
          </button>
        </div>
        
        <MarkerList 
          markers={markers} 
          onRemoveMarker={removeMarker}
          onClearAll={clearAllMarkers}
          onLocateMarker={locateMarker}
        />
      </div>
      
      {showAddMarker && (
        <div className="modal-overlay" onClick={() => setShowAddMarker(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Marker</h2>
              <button className="modal-close" onClick={() => setShowAddMarker(false)}>×</button>
            </div>
            <CoordinateInput 
              onAddMarker={(marker) => {
                addMarker(marker);
                setShowAddMarker(false);
              }} 
            />
          </div>
        </div>
      )}
      
      {showBulkImport && (
        <div className="modal-overlay" onClick={() => setShowBulkImport(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Bulk Import Coordinates</h2>
              <button className="modal-close" onClick={() => setShowBulkImport(false)}>×</button>
            </div>
            <BulkImport 
              onImportMarkers={(markers) => {
                importMarkers(markers);
                setShowBulkImport(false);
              }} 
            />
          </div>
        </div>
      )}
      
      <div className="map-wrapper">
        {sidebarCollapsed && (
          <button 
            className="sidebar-expand-btn"
            onClick={() => setSidebarCollapsed(false)}
            title="Expand sidebar"
          >
            →
          </button>
        )}
        <MapContainer 
          markers={markers}
          onAddMarker={addMarker}
          onRemoveMarker={removeMarker}
          focusedMarker={focusedMarker}
        />
      </div>
    </div>
  )
}

export default App
