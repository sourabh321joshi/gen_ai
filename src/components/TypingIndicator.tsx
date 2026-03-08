import styles from './TypingIndicator.module.css';

export function TypingIndicator() {
  return (
    <div className={styles.message} role="status" aria-label="Assistant is typing">
      <div className={styles.typing}>
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}
