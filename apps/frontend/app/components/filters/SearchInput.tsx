"use client";

import { Input } from "../ui/Input";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export function InputSearch({ value, onChange }: SearchInputProps) {
  return (
    <Input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search..."
      className="w-full border rounded px-3 py-2"
    />
  );
}
