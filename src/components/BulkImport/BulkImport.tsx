import { useState } from 'react';
import { Marker } from '../../types/map.types';
import './BulkImport.css';

interface BulkImportProps {
  onImportMarkers: (markers: Marker[]) => void;
}

const MARKER_COLORS = [
  { value: '#4d90fe', label: 'Blue' },
  { value: '#ff3b30', label: 'Red' },
  { value: '#34c759', label: 'Green' },
  { value: '#ff9500', label: 'Orange' },
  { value: '#af52de', label: 'Purple' },
  { value: '#ffcc00', label: 'Yellow' },
  { value: '#ff2d55', label: 'Pink' },
  { value: '#5ac8fa', label: 'Cyan' },
];

export default function BulkImport({ onImportMarkers }: BulkImportProps) {
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [previewCount, setPreviewCount] = useState(0);
  const [color, setColor] = useState(MARKER_COLORS[0].value);

  const parseLuaCoordinates = (input: string, baseTitle: string): Marker[] => {
    const markers: Marker[] = [];
    
    // Match patterns like: {-218.78, -1703.47, 33.59, 218.73}
    // This regex captures numbers (including negative and decimals) within curly braces
    const luaTablePattern = /\{([^}]+)\}/g;
    
    // Match vector3 patterns like: vector3(-218.78, -1703.47, 33.59)
    const vector3Pattern = /vector3\s*\(([^)]+)\)/gi;
    
    // Try Lua table format first
    let match;
    let index = 1;
    while ((match = luaTablePattern.exec(input)) !== null) {
      const numbers = match[1]
        .split(',')
        .map(s => parseFloat(s.trim()))
        .filter(n => !isNaN(n));
      
      // We need at least x and y coordinates
      if (numbers.length >= 2) {
        const [x, y] = numbers;
        const marker: Marker = {
          id: `${Date.now()}_${markers.length}`,
          x: Math.round(x * 100) / 100,
          y: Math.round(y * 100) / 100,
          title: markers.length > 0 ? `${baseTitle} #${index}` : baseTitle,
          color: color,
          createdAt: Date.now() + markers.length, // Ensure unique timestamps
        };
        markers.push(marker);
        index++;
      }
    }
    
    // Try vector3 format if no Lua tables found
    if (markers.length === 0) {
      let index = 1;
      while ((match = vector3Pattern.exec(input)) !== null) {
        const numbers = match[1]
          .split(',')
          .map(s => parseFloat(s.trim()))
          .filter(n => !isNaN(n));
        
        if (numbers.length >= 2) {
          const [x, y] = numbers;
          const marker: Marker = {
            id: `${Date.now()}_${markers.length}`,
            x: Math.round(x * 100) / 100,
            y: Math.round(y * 100) / 100,
            title: markers.length > 0 ? `${baseTitle} #${index}` : baseTitle,
            color: color,
            createdAt: Date.now() + markers.length,
          };
          markers.push(marker);
          index++;
        }
      }
    }
    
    return markers;
  };

  const handlePreview = () => {
    setError('');
    
    if (!title.trim()) {
      setError('Please enter a title for the markers');
      return;
    }
    
    try {
      const markers = parseLuaCoordinates(text, title.trim());
      if (markers.length === 0) {
        setError('No valid coordinates found. Make sure they are in format: {x, y, z, heading}');
      } else {
        setPreviewCount(markers.length);
        setError('');
      }
    } catch {
      setError('Error parsing coordinates. Please check the format.');
      setPreviewCount(0);
    }
  };

  const handleImport = () => {
    setError('');
    
    if (!title.trim()) {
      setError('Please enter a title for the markers');
      return;
    }
    
    try {
      const markers = parseLuaCoordinates(text, title.trim());
      
      if (markers.length === 0) {
        setError('No valid coordinates found. Make sure they are in format: {x, y, z, heading}');
        return;
      }
      
      onImportMarkers(markers);
      setText('');
      setTitle('');
      setPreviewCount(0);
      setColor(MARKER_COLORS[0].value);
    } catch {
      setError('Error importing coordinates. Please check the format.');
    }
  };

  const handleClear = () => {
    setText('');
    setTitle('');
    setError('');
    setPreviewCount(0);
    setColor(MARKER_COLORS[0].value);
  };

  return (
    <div className="bulk-import">
      <div className="bulk-import-content">
          <div className="form-group">
            <label htmlFor="bulk-title">Title *</label>
            <input
              id="bulk-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Drug Spots, Gang Territories"
              className="bulk-title-input"
            />
          </div>
          
          <textarea
            className="bulk-import-textarea"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setError('');
              setPreviewCount(0);
            }}
            placeholder="Paste Lua coordinates: {x, y, z, h},..."
            rows={6}
          />
          
          {error && (
            <div className="import-error">
              ⚠️ {error}
            </div>
          )}
          
          {previewCount > 0 && (
            <div className="import-preview">
              ✓ Found {previewCount} valid coordinate{previewCount !== 1 ? 's' : ''}
            </div>
          )}
          
          <div className="form-group">
            <label>Color</label>
            <div className="color-selector">
              {MARKER_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  className={`color-option ${color === c.value ? 'active' : ''}`}
                  style={{ backgroundColor: c.value }}
                  onClick={() => setColor(c.value)}
                  title={c.label}
                />
              ))}
            </div>
          </div>
          
          <div className="bulk-import-actions">
            <button 
              className="btn-secondary"
              onClick={handlePreview}
              disabled={!text.trim()}
            >
              Preview
            </button>
            <button 
              className="btn-primary"
              onClick={handleImport}
              disabled={!text.trim()}
            >
              Import All
            </button>
            <button 
              className="btn-clear"
              onClick={handleClear}
              disabled={!text.trim()}
            >
              Clear
            </button>
          </div>
        </div>
    </div>
  );
}
