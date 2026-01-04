"use client";

import { Checkbox } from "./CheckBox";

type Option<T extends number | string> = {
  value: T;
  label: string;
};

type CheckboxGroupProps<T extends number | string> = {
  options: Option<T>[];
  selected: T[];
  onChange: (values: T[]) => void;
};

export function CheckboxGroup<T extends number | string>({
  options,
  selected,
  onChange,
}: CheckboxGroupProps<T>) {
  const toggle = (value: T) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  if (options.length === 0) {
    return <p>No options available.</p>;
  }

  return (
    <div className="space-y-1">
      {options.map((opt) => (
        <Checkbox
          key={opt.value}
          label={opt.label}
          checked={selected.includes(opt.value)}
          onChange={() => toggle(opt.value)}
        />
      ))}
    </div>
  );
}
