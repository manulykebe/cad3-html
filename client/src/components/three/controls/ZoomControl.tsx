import React from 'react';

interface ZoomControlProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  min?: number;
  max?: number;
}

export const ZoomControl: React.FC<ZoomControlProps> = ({
  zoom,
  onZoomChange,
  min = 0.1,
  max = 10,
}) => {
  return (
    <div className="absolute bottom-4 left-4 bg-white/80 p-2 rounded-lg shadow-md">
      <input
        type="range"
        min={min * 100}
        max={max * 100}
        value={zoom * 100}
        onChange={(e) => onZoomChange(Number(e.target.value) / 100)}
        className="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
      <div className="text-xs text-center mt-1">
        Zoom: {(zoom * 100).toFixed(0)}%
      </div>
    </div>
  );
};