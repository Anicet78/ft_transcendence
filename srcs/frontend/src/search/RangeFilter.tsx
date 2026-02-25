import React from 'react';

type Props = {
  min: number | '';
  max: number | '';
  onChangeMin: (val: number | '') => void;
  onChangeMax: (val: number | '') => void;
  label: string;
};

export const RangeFilter: React.FC<Props> = ({ min, max, onChangeMin, onChangeMax, label }) => (
  <div className="range_filter">
    <input type="number" placeholder={`Min ${label}`} value={min} onChange={(e) => onChangeMin(e.target.value === '' ? '' : Number(e.target.value))} />
    <input type="number" placeholder={`Max ${label}`} value={max} onChange={(e) => onChangeMax(e.target.value === '' ? '' : Number(e.target.value))} />
  </div>
);
