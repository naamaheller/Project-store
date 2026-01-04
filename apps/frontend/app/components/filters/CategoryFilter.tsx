"use client";

import { useEffect } from "react";
import { CheckboxGroup } from "../ui/CheckboxGroup";

type Category = {
  id: number;
  name: string;
};

type CategoryProps = {
  categories: Category[];
  selected: number[];
  onChange: (categories: number[]) => void;
};

export function FilterCategory({
  categories,
  selected,
  onChange,
}: CategoryProps) {
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
      <p className="font-medium mb-2">Categories</p>

      <CheckboxGroup
        options={categories.map((cat) => ({
          value: cat.id,
          label: cat.name,
        }))}
        selected={selected}
        onChange={onChange}
      />
    </div>
  );
}
