"use client";

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
