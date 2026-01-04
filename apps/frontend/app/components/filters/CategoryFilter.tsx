"use client";

import { useEffect } from "react";

type Category = {
  id: number;
  name: string;
};

type CategoryProps = {
  categories: Category[];
  selected: number[];
  onChange: (categories: number[]) => void;
};

export function FilterCategory({ categories, selected, onChange }: CategoryProps) {

  const toggle = (id: number) => {
    if (selected.includes(id)) {
      onChange(selected.filter((c) => c !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  useEffect(() => {
    console.log(categories);
  }, [categories]);

  return (
    <div>
      <p className="font-medium mb-2">categories</p>
      {categories.length === 0 && <p>No categories available.</p>}
      {categories.map((cat) => (
        <label key={cat.id} className="flex gap-2">
          <input
            type="checkbox"
            checked={selected.includes(cat.id)}
            onChange={() => toggle(cat.id)}
          />
          {cat.name}
        </label>
      ))}
    </div>
  );
}
