import React from "react";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface TextInputProps {
  placeholder?: string;
  type?: string;
  error?: FieldError;
  register: UseFormRegisterReturn;
}

const InputText: React.FC<TextInputProps> = ({ placeholder, type = "text", error, register }) => {
  return (
    <div>
		<label htmlFor={placeholder}>{placeholder}</label>
		<br />
      <input {...register} type={type} placeholder={placeholder} className={error ? "error" : ""} />
	  <i className="fas fa-envelope" style={{
		position: 'absolute',
		left: '8px',
		top: '38px',
		color: '#00f0f0',
		pointerEvents: 'none',
	}} />
      {error && <p className="error-message">{error.message}</p>}
    </div>
  );
};

export default InputText