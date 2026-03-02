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
	<div className="field">
		<label htmlFor={placeholder}>{placeholder}</label>
		<br />
		<p className="control has-icons-left">
		<select {...register} defaultValue="" className={`input ${error ? "error" : ""}`} style={{color: '#888'}}>
			<option value="" disabled>{placeholder}</option>
			{options.map(opt => (
			<option key={opt} value={opt}>{opt}</option>
			))}
		</select>
		<span className="icon is-small is-left">
				<i className="fas fa-globe"></i>
			</span>
		</p>
		{error && <p className="error-message">{error.message}</p>}
	</div>
  );
};

export default SelectRegion