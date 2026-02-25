export default function Avatar({ name, image, size = 38 }) {
  const initials = name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Construct full image URL if image is provided
  const imageUrl = image
    ? image.startsWith("http")
      ? image
      : `${import.meta.env.VITE_API_BASE_URL?.replace("/api", "")}${image}`
    : null;

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: imageUrl
          ? "transparent"
          : "linear-gradient(135deg,#6366f1,#8b5cf6)",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "600",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name || "Avatar"}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          onError={(e) => {
            // Fallback to initials if image fails to load
            e.target.style.display = "none";
            e.target.parentElement.style.background =
              "linear-gradient(135deg,#6366f1,#8b5cf6)";
            e.target.parentElement.innerHTML = initials || "A";
          }}
        />
      ) : (
        initials || "A"
      )}
    </div>
  );
}
