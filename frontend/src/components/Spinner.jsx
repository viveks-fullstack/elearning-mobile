export default function Spinner({
  size = "sm", // sm | md | lg
  variant = "dark", // primary | light | dark | etc
  fullPage = false,
}) {
  const sizeClass =
    size === "sm" ? "spinner-border-sm" : size === "lg" ? "" : "";

  const spinner = (
    <div
      className={`spinner-border ${sizeClass} text-${variant}`}
      role="status"
    >
      <span className="visually-hidden">Loading...</span>
    </div>
  );

  if (fullPage) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center">
        {spinner}
      </div>
    );
  }

  return spinner;
}
