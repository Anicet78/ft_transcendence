import React from "react";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface TextInputProps {
  placeholder?: string;
  type?: string;
  error?: FieldError;
  register: UseFormRegisterReturn;
  icon: string;
}

const InputText: React.FC<TextInputProps> = ({ placeholder, type = "text", error, register, icon }) => {
  return (
    <div className="field">
		<label htmlFor={placeholder}>{placeholder}</label>
		<p className="control has-icons-left">
			<input 
				{...register} 
				type={type} 
				placeholder={placeholder} 
				className={`input ${error ? "error" : ""}`}
			/>
			<span className="icon is-small is-left">
				<i className={icon}></i>
			</span>
		</p>
		{error && <p className="error-message">{error.message}</p>}
    </div>
  );
};

export default InputText