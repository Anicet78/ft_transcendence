import React from "react";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface SelectInputProps {
  options: string[];
  placeholder?: string;
  error?: FieldError;
  register: UseFormRegisterReturn;
}

const SelectRegion: React.FC<SelectInputProps> = ({ options, placeholder, error, register }) => {
  return (
    <div>
		<label htmlFor={placeholder}>{placeholder}</label>
		<br />
      <select {...register} defaultValue="" className={error ? "error" : ""} style={{color: '#888'}}>
        <option value="" disabled>{placeholder}</option>
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      {error && <p className="error-message">{error.message}</p>}
    </div>
  );
};

export default SelectRegion