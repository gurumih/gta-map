export interface Marker {
  id: string;
  x: number;
  y: number;
  title?: string;
  description?: string;
  color?: string;
  createdAt: number;
}

export interface GtaCoords {
  x: number;
  y: number;
}

export interface PixelCoords {
  x: number;
  y: number;
}

export interface MapBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}
