import { GtaCoords, MapBounds } from '../types/map.types';

// GTA V Los Santos map bounds (standard coordinates)
export const GTA_BOUNDS: MapBounds = {
  minX: -4000,
  maxX: 4000,
  minY: -4000,
  maxY: 8000,
};

/**
 * Convert GTA coordinates to Leaflet lat/lng
 * Using the same transformation as gtamap.xyz
 */
export function gtaToLeaflet(gtaX: number, gtaY: number): [number, number] {
  // Return directly as [lat, lng] = [y, x]
  // The CUSTOM_CRS transformation will handle the conversion
  return [gtaY, gtaX];
}

/**
 * Convert Leaflet lat/lng to GTA coordinates
 */
export function leafletToGta(lat: number, lng: number): GtaCoords {
  // Direct mapping - the CRS transformation handles the conversion
  return {
    x: Math.round(lng * 100) / 100,
    y: Math.round(lat * 100) / 100,
  };
}

/**
 * Format coordinates for display
 */
export function formatCoords(x: number, y: number): string {
  return `X: ${x.toFixed(2)}, Y: ${y.toFixed(2)}`;
}
