import React from "react";

type Props = {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
};

const Button = ({
  onClick,
  disabled = false,
  children,
  className = "",
}: Props) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
