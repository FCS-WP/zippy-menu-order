import React from "react";
import PropTypes from "prop-types";

/**
 * Reusable Button component with loading state
 * Fixed style – no custom className allowed
 */
const Button = ({
  size = "md",
  disabled = false,
  isLoading = false,
  onClick,
  children,
  className,
  loading = false,
  ...props
}) => {
  return (
    <button
      className={`app-button app-button--${size}`}
      onClick={!loading ? onClick : undefined}
      disabled={disabled || loading}
      {...props}
    >
      {/* Spinner */}
      {loading && <span className="app-button__spinner" />}

      {/* Text */}
      <span
        className={`app-button__text ${
          loading ? "app-button__text--hidden" : ""
        }`}
      >
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
};

export default Button;
