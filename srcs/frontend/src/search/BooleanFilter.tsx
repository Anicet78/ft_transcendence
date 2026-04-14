import React, { useState, useRef, useEffect } from 'react';

type Props = {
  value: boolean | '';
  onChange: (val: boolean | '') => void;
  label: string;
};

export const BooleanFilter: React.FC<Props> = ({ value, onChange, label }) => {
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

  const displayed = value === '' ? `Any ${label}` : value ? 'Yes' : 'No';

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
          {[
            { label: `Any ${label}`, val: '' as boolean | '' },
            { label: 'Yes', val: true },
            { label: 'No',  val: false },
          ].map(opt => (
            <li
              key={String(opt.val)}
              className={`custom_select__option ${value === opt.val ? 'is-selected' : ''}`}
              onClick={() => { onChange(opt.val); setOpen(false); }}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// import React from 'react';

// type Props = {
//   value: boolean | '';
//   onChange: (val: boolean | '') => void;
//   label: string;
// };

// export const BooleanFilter: React.FC<Props> = ({ value, onChange, label }) => (
//   <select value={value === '' ? '' : String(value)} onChange={(e) => onChange(e.target.value === '' ? '' : e.target.value === 'true')}>
//     <option value="">Any {label}</option>
//     <option value="true">Yes</option>
//     <option value="false">No</option>
//   </select>
// );

