import { useErrorMessagesValidationStore } from "@/store/store";
import React from "react";

type Props = {
  id: string;
  type: string;
  placeholder: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  maxLength?: number;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  autoComplete?: string;
  defaultValue?: string;
  label?: string;
  text?: string;
  textStyle?: string;
};

const InputField = ({
  id,
  type,
  placeholder,
  onChange,
  className,
  maxLength,
  inputMode,
  autoComplete,
  defaultValue,
  label,
  text,
  textStyle,
}: Props) => {
  const errorMessage = useErrorMessagesValidationStore(
    (state) => state.getErrorMessages
  );
  function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  return (
    <div className="mb-6">
      {label ? (
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor={label}
        >
          {capitalizeFirstLetter(label) || " "}
        </label>
      ) : (
        ""
      )}
      {text ? <p className={` mt-12 mb-6 ${textStyle}`}>{text}</p> : null}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        className={`shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${className}`}
        maxLength={maxLength}
        inputMode={inputMode}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
      />
      <p className="text-sm font-bold text-red-500 mt-1">{errorMessage(id)}</p>
    </div>
  );
};

export default InputField;
