type SelectFilterProps<T extends string> = {
  value: T;
  onChange: (val: T) => void;
  options: readonly T[];
  placeholder?: string;
};

export function SelectFilter<T extends string>({
  value,
  onChange,
  options,
  placeholder,
}: SelectFilterProps<T>) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as T)} // cast string to T
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  );
}

