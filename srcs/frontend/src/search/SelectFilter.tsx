import { useState, useRef, useEffect } from 'react';

type SelectFilterProps<T extends string> = {
  value: T | '';
  onChange: (val: T) => void;
  options: readonly T[];
  placeholder?: string;
};

export function SelectFilter<T extends string>({
  value, onChange, options, placeholder
}: SelectFilterProps<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const displayed = value || placeholder || 'Select';

  return (
    <div className="custom_select" ref={ref}>
      <button
        type="button"
        className={`custom_select__trigger ${open ? 'is-open' : ''}`}
        onClick={() => setOpen(p => !p)}
      >
        <span>{displayed}</span>
        <i className={`fas fa-chevron-${open ? 'up' : 'down'}`} />
      </button>
      {open && (
        <ul className="custom_select__list">
          {placeholder && (
            <li
              className={`custom_select__option ${value === '' ? 'is-selected' : ''}`}
              onClick={() => { onChange('' as T); setOpen(false); }}
            >
              {placeholder}
            </li>
          )}
          {options.map(o => (
            <li
              key={o}
              className={`custom_select__option ${value === o ? 'is-selected' : ''}`}
              onClick={() => { onChange(o); setOpen(false); }}
            >
              {o}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// type SelectFilterProps<T extends string> = {
//   value: T;
//   onChange: (val: T) => void;
//   options: readonly T[];
//   placeholder?: string;
// };

// export function SelectFilter<T extends string>({
//   value,
//   onChange,
//   options,
//   placeholder,
// }: SelectFilterProps<T>) {
//   return (
//     <select
//       value={value}
//       onChange={(e) => onChange(e.target.value as T)} // cast string to T
//     >
//       {placeholder && <option value="">{placeholder}</option>}
//       {options.map((o) => (
//         <option key={o} value={o}>{o}</option>
//       ))}
//     </select>
//   );
// }
