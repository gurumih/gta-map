import { useState } from 'react'
import MapContainer from './components/Map/MapContainer'
import CoordinateInput from './components/CoordinateInput/CoordinateInput'
import MarkerList from './components/MarkerList/MarkerList'
import { Marker } from './types/map.types'
import './App.css'

function App() {
  const [markers, setMarkers] = useState<Marker[]>(() => {
    const saved = localStorage.getItem('gta-markers')
    return saved ? JSON.parse(saved) : []
  })

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

  return (
    <div className="app-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <h1>GTA V Interactive Map</h1>
        </div>
        
        <CoordinateInput onAddMarker={addMarker} />
        
        <MarkerList 
          markers={markers} 
          onRemoveMarker={removeMarker}
          onClearAll={clearAllMarkers}
        />
      </div>
      
      <div className="map-wrapper">
        <MapContainer 
          markers={markers}
          onAddMarker={addMarker}
        />
      </div>
    </div>
  )
}

export default App
