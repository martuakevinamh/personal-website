"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  value: string; // e.g. "50% 50%" or "center center"
  onChange: (value: string) => void;
  zoom: number;
  onZoomChange: (value: number) => void;
  imageUrl?: string;
};

export default function ImagePositionPicker({ value, onChange, zoom, onZoomChange, imageUrl }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [aspectRatio, setAspectRatio] = useState(16/9); // Default standard

  // Initialize position from value prop
  useEffect(() => {
    if (!value) return;
    
    // Parse values like "left top", "50% 50%", "center center"
    let x = 50;
    let y = 50;

    const parts = value.split(" ");
    if (parts.length >= 2) {
      // Helper to parse part
      const parsePart = (p: string) => {
        if (p.includes("%")) return parseFloat(p);
        if (p === "left") return 0;
        if (p === "right") return 100;
        if (p === "top") return 0;
        if (p === "bottom") return 100;
        if (p === "center") return 50;
        return 50;
      };

      x = parsePart(parts[0]);
      y = parsePart(parts[1]);
    }

    setPosition({ x, y });
  }, [value]); 

  const updatePosition = (clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    
    // Calculate click position relative to container
    let x = ((clientX - rect.left) / rect.width) * 100;
    let y = ((clientY - rect.top) / rect.height) * 100;

    // Clamp between 0 and 100
    x = Math.max(0, Math.min(100, x));
    y = Math.max(0, Math.min(100, y));

    setPosition({ x, y });
    onChange(`${x.toFixed(0)}% ${y.toFixed(0)}%`);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updatePosition(e.clientX, e.clientY);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        updatePosition(e.clientX, e.clientY);
      }
    };
  
    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging]); 

  if (!imageUrl) {
    return <div className="text-xs text-zinc-500 italic">Add image to set focus & zoom</div>;
  }

  return (
    <div className="space-y-3">
      <div 
        ref={containerRef}
        className="relative w-full bg-zinc-800 rounded-lg overflow-hidden cursor-move group select-none transition-all duration-300 ease-in-out"
        style={{ aspectRatio: aspectRatio }}
        onMouseDown={handleMouseDown}
      >
        {/* The Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={imageUrl} 
          alt="Position preview"
          className="w-full h-full object-cover pointer-events-none transition-transform duration-75"
          style={{ 
            objectPosition: `${position.x}% ${position.y}%`,
            transform: `scale(${zoom})`,
            transformOrigin: `${position.x}% ${position.y}%`
          }}
        />

        {/* Focus Point Indicator */}
        <div 
          className="absolute w-4 h-4 bg-white/50 border-2 border-violet-500 rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-75"
          style={{ 
            left: `${position.x}%`, 
            top: `${position.y}%` 
          }}
        >
            <div className="absolute top-1/2 left-1/2 w-0.5 h-full bg-violet-500 -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute top-1/2 left-1/2 h-0.5 w-full bg-violet-500 -translate-x-1/2 -translate-y-1/2" />
        </div>
        
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <p className="text-xs text-white bg-black/50 px-2 py-1 rounded">Click & Drag to set focus</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-xs text-zinc-400">
        <div>
          Pos: <span className="text-white font-mono">{position.x.toFixed(0)}% {position.y.toFixed(0)}%</span>
        </div>
        
        {/* Aspect Ratio Toggles */}
        <div className="flex bg-zinc-800 rounded-lg p-1 gap-1">
          <button
            type="button"
            onClick={() => setAspectRatio(16/9)}
            className={`px-2 py-1 rounded ${Math.abs(aspectRatio - 16/9) < 0.1 ? "bg-zinc-600 text-white" : "hover:bg-zinc-700"}`}
            title="Mobile / Standard Preview"
          >
            📱 Mobile
          </button>
          <button
            type="button"
            onClick={() => setAspectRatio(2.6)} // Approx Desktop Card ratio (500px / 192px)
            className={`px-2 py-1 rounded ${Math.abs(aspectRatio - 2.6) < 0.1 ? "bg-zinc-600 text-white" : "hover:bg-zinc-700"}`}
            title="Desktop / Wide Preview"
          >
            💻 Desktop
          </button>
        </div>

        <div>
           Zoom: <span className="text-white font-mono">{zoom.toFixed(1)}x</span>
        </div>
      </div>

      {/* Zoom Slider */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-zinc-500">🔍</span>
        <input 
          type="range" 
          min="1" 
          max="3" 
          step="0.1" 
          value={zoom}
          onChange={(e) => onZoomChange(parseFloat(e.target.value))}
          className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-violet-500"
        />
      </div>
    </div>
  );
}
