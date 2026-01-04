"use client";

import { Input } from "../ui/Input";

interface Props {
  min: number;
  max: number;
  valueMin: number;
  valueMax: number;
  onChange: (min: number, max: number) => void;
}

export function PriceRange({ min, max, valueMin, valueMax, onChange }: Props) {
  function handleMinChange(v: number) {
    if (v <= valueMax) {
      onChange(v, valueMax);
    }
  }

  function handleMaxChange(v: number) {
    if (v >= valueMin) {
      onChange(valueMin, v);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {/* טקסט */}
      <div className="flex justify-between text-sm text-text-muted">
        <span>₪{valueMin}</span>
        <span>₪{valueMax}</span>
      </div>

      {/* Slider */}
      <div className="relative h-5">
        {/* Track */}
        <div className="absolute top-1/2 -translate-y-1/2 h-1 w-full rounded bg-border" />

        {/* Active range */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-1 rounded bg-primary"
          style={{
            left: `${((valueMin - min) / (max - min)) * 100}%`,
            right: `${100 - ((valueMax - min) / (max - min)) * 100}%`,
          }}
        />

        <input
          type="range"
          min={min}
          max={max}
          value={valueMin}
          onChange={(e) => handleMinChange(Number(e.target.value))}
          className="absolute w-full appearance-none bg-transparent"
        />

        <input
          type="range"
          min={min}
          max={max}
          value={valueMax}
          onChange={(e) => handleMaxChange(Number(e.target.value))}
          className="absolute w-full appearance-none bg-transparent"
        />
      </div>
    </div>
  );
}
