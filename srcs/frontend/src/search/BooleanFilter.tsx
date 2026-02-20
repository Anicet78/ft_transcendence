import React from 'react';

type Props = {
  value: boolean | '';
  onChange: (val: boolean | '') => void;
  label: string;
};

export const BooleanFilter: React.FC<Props> = ({ value, onChange, label }) => (
  <select value={value === '' ? '' : String(value)} onChange={(e) => onChange(e.target.value === '' ? '' : e.target.value === 'true')}>
    <option value="">Any {label}</option>
    <option value="true">Yes</option>
    <option value="false">No</option>
  </select>
);
