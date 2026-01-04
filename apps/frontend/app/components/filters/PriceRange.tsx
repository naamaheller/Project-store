"use client";

type PriceRangeProps = {
  min: number | null;
  max: number | null;
  onChange: (min: number, max: number) => void;
};

export function RangePrice({ min, max, onChange }: PriceRangeProps) {
  return (
    <div>
      <p className="font-medium mb-2">price range</p>

      <input
        type="range"
        min={0}
        max={5000}
        value={max ?? 5000}
        onChange={(e) => onChange(min ?? 0, Number(e.target.value))}
      />

      <div className="text-sm mt-1">
        {min ?? 0}₪ - {max ?? 5000}₪
      </div>
    </div>
  );
}
