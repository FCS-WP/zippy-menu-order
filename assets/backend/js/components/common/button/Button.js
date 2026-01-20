import React from "react";
import PropTypes from "prop-types";

/**
 * Reusable Button component with loading state
 */
const Button = ({
  size = "md",
  disabled = false,
  isLoading = false,
  onClick,
  children,
  className = "bg-primary border border-primary hover:bg-transparent text-white hover:text-primary cursor-pointer",
  ...props
}) => {
  const baseStyles =
    "rounded font-medium transition-all duration-150 ease-in-out relative flex items-center justify-center";

  const sizeStyles = {
    sm: "px-2 py-1 text-sm",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };

  const buttonClass = `
    ${baseStyles}
    ${sizeStyles[size] || ""}
    ${disabled || isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
    ${className}
  `.trim();

  return (
    <button
      onClick={!isLoading ? onClick : undefined}
      disabled={disabled || isLoading}
      className={buttonClass}
      {...props}
    >
      {/* Spinner */}
      {isLoading && (
        <span className="absolute h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
      )}

      {/* Hide text when loading */}
      <span className={`${isLoading ? "opacity-0" : "opacity-100"}`}>
        {children}
      </span>
    </button>
  );
};

Button.propTypes = {
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  disabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Button;
