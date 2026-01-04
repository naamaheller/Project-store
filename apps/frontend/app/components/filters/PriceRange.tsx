"use client";

type PriceRangeProps = {
  min: number;
  value: number;
  max: number; 
  onChange: (value: number) => void;
};
export function RangePrice({ min, max, onChange , value }: PriceRangeProps) {
  return (
    <div>
      <p className="font-medium mb-2">price range</p>

      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />

      <div className="text-sm mt-1">
        {min}₪ - {value}₪
      </div>
    </div>
  );
}
