import { useState } from 'react';
import { Marker } from '../../types/map.types';
import './CoordinateInput.css';

interface CoordinateInputProps {
  onAddMarker: (marker: Marker) => void;
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

export default function CoordinateInput({ onAddMarker }: CoordinateInputProps) {
  const [x, setX] = useState('');
  const [y, setY] = useState('');
  const [title, setTitle] = useState('');
  const [color, setColor] = useState(MARKER_COLORS[0].value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const xNum = parseFloat(x);
    const yNum = parseFloat(y);
    
    if (isNaN(xNum) || isNaN(yNum)) {
      alert('Please enter valid coordinates');
      return;
    }
    
    if (!title.trim()) {
      alert('Please enter a title for the marker');
      return;
    }
    
    const marker: Marker = {
      id: Date.now().toString(),
      x: xNum,
      y: yNum,
      title: title.trim(),
      color: color,
      createdAt: Date.now(),
    };
    
    onAddMarker(marker);
    
    // Clear form
    setX('');
    setY('');
    setTitle('');
    setColor(MARKER_COLORS[0].value);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pastedText = e.clipboardData.getData('text');
    
    // Try to parse common coordinate formats:
    // "x, y" or "x y" or "vector3(x, y, z)"
    const patterns = [
      /(-?\d+\.?\d*)[,\s]+(-?\d+\.?\d*)/,  // "x, y" or "x y"
      /vector3\((-?\d+\.?\d*)[,\s]+(-?\d+\.?\d*)/i,  // "vector3(x, y, z)"
    ];
    
    for (const pattern of patterns) {
      const match = pastedText.match(pattern);
      if (match) {
        e.preventDefault();
        setX(match[1]);
        setY(match[2]);
        return;
      }
    }
  };

  return (
    <div className="coordinate-input">
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="coord-x">X</label>
            <input
              id="coord-x"
              type="text"
              value={x}
              onChange={(e) => setX(e.target.value)}
              onPaste={handlePaste}
              placeholder="-1000.00"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="coord-y">Y</label>
            <input
              id="coord-y"
              type="text"
              value={y}
              onChange={(e) => setY(e.target.value)}
              placeholder="500.00"
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="marker-title">Title *</label>
          <input
            id="marker-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Bank Heist, Drug Lab, Meeting Point"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="marker-color">Color</label>
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
        
        <button type="submit" className="btn-primary">
          Add Marker
        </button>
      </form>
    </div>
  );
}
