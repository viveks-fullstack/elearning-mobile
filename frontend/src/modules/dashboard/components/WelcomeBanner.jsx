import styles from "./WelcomeBanner.module.css";

export default function WelcomeBanner() {
  return (
    <div className={`animate-slide-in ${styles.banner}`}>
      {/* Background decoration */}
      <div className={styles.decoration} />

      <div className={styles.content}>
        <h3 className={`fw-bold mb-2 ${styles.title}`}>Welcome Back, Admin!</h3>
        <p className={`mb-0 ${styles.subtitle}`}>
          Here's a summary of your coaching performance today.
        </p>
      </div>
    </div>
  );
}
