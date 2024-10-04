import styles from './MobileScrollUnlock.module.css';

export default function MobileScrollUnlock() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <p>Scroll to unlock</p>
        <div className={styles.arrow}>
          <svg viewBox="0 0 24 24">
            {/* Arrow icon */}
          </svg>
        </div>
      </div>
    </div>
  );
}