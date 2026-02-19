import React, { useState } from "react";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface PasswordInputProps {
  placeholder?: string;
  error?: FieldError;
  register: UseFormRegisterReturn;
  watchValue?: string; // Pass watch("password") from the form to show feedback
}

export const InputPassword: React.FC<PasswordInputProps> = ({ placeholder, error, register, watchValue }) => {
  const [show, setShow] = useState(false);

  const password = watchValue || "";

  // Password validation rules
  const rules = [
    { test: password.length >= 8, label: "At least 8 characters" },
    { test: /[A-Z]/.test(password), label: "At least 1 uppercase letter" },
    { test: /[a-z]/.test(password), label: "At least 1 lowercase letter" },
    { test: /\d/.test(password), label: "At least 1 digit" },
    { test: /[@$!%*?&]/.test(password), label: "At least 1 special character" },
  ];

  return (
    <div style={{ position: "relative", marginBottom: "12px" }}>
      <input
        {...register}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        className={error ? "error" : ""}
      />
      <span className="toggle-password" onClick={() => setShow(prev => !prev)}>
        {show ? "Hide" : "Show"}
      </span>

      {error && <p className="error-message">{error.message}</p>}

      {password && (
        <div className="password-feedback">
          {rules.map((rule, i) => (
            <p key={i} className={rule.test ? "valid" : "invalid"}>
              {rule.test ? "✓" : "✗"} {rule.label}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};


export default InputPassword
