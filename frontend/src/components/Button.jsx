import styles from "./Button.module.css";

export default function Button({
  children,
  variant = "primary",
  type = "button",
  onClick,
  disabled = false,
  loading = false,
  className = "",
  ...props
}) {
  const variantClass = styles[variant] || styles.primary;
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      className={`${styles.buttonBase} ${variantClass} ${isDisabled ? styles.buttonDisabled : styles.buttonEnabled} ${className}`}
      onClick={onClick}
      disabled={isDisabled}
      {...props}
    >
      {children}
    </button>
  );
}
