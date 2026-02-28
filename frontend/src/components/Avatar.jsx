import styles from "./Avatar.module.css";

export default function Avatar({ name, image, size = 38 }) {
  const sizeClassByPx = {
    32: styles.avatarXs,
    38: styles.avatarSm,
    40: styles.avatarSm,
    48: styles.avatarMd,
    64: styles.avatarLg,
    80: styles.avatarXl,
  };

  const sizeClass = sizeClassByPx[size] || styles.avatarSm;

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
    <div className={`${styles.avatar} ${sizeClass}`}>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name || "Avatar"}
          className={styles.image}
          onError={(e) => {
            // Fallback to initials if image fails to load
            e.target.style.display = "none";
            e.target.parentElement.innerHTML = initials || "A";
          }}
        />
      ) : (
        initials || "A"
      )}
    </div>
  );
}
