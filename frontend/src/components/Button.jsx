export default function Button({
  children,
  variant = "primary",
  type = "button",
  onClick,
  disabled = false,
  className = "",
  style = {},
  ...props
}) {
  const baseClasses = "btn";

  const variantStyles = {
    primary: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      border: "none",
      color: "white",
      boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
    },
    secondary: {
      background: "linear-gradient(135deg, #6c757d, #5a6268)",
      border: "none",
      color: "white",
      boxShadow: "0 4px 15px rgba(108, 117, 125, 0.3)",
    },
    success: {
      background: "linear-gradient(135deg, #10b981, #059669)",
      border: "none",
      color: "white",
      boxShadow: "0 4px 15px rgba(16, 185, 129, 0.3)",
    },
    danger: {
      background: "linear-gradient(135deg, #ef4444, #dc2626)",
      border: "none",
      color: "white",
      boxShadow: "0 4px 15px rgba(239, 68, 68, 0.3)",
    },
    outline: {
      background: "transparent",
      border: "2px solid rgba(99, 102, 241, 0.5)",
      color: "#6366f1",
    },
  };

  const buttonStyle = {
    fontWeight: "500",
    padding: "10px 20px",
    borderRadius: "12px",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    ...variantStyles[variant],
    ...style,
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${className}`}
      style={buttonStyle}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
