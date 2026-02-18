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
    <div style={{ marginBottom: "12px" }}>
      <input {...register} type={type} placeholder={placeholder} className={error ? "error" : ""} />
      {error && <p className="error-message">{error.message}</p>}
    </div>
  );
};

export default InputText