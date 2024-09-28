import styles from './Card.module.css';

export default function Card(props) {
  const { hoverEffect = false } = props;

  return (
    <div className={`${styles.card} ${hoverEffect ? styles['card--hover'] : ''}`}>
      <div className={styles.card__header}>
        <h2 className={styles.card__title}>Mail from JRG</h2>
      </div>
      <div className={styles.card__body}>
        <p className={styles.card__from}>JRG</p>
        <h1 className={styles.card__subject}>Product Manager</h1>
        <p className={styles.card__text}>
          Hi,
          <br />
          <br />
          You found my site. Thank you for visiting. There is something you should know. You need
          to turn on your audio. To navigate this site, you must use your keyboard up, down, left,
          and right arrows. If that's okay, click the button below to turn on your audio.
        </p>
        <div className={styles.card__buttons}>
          <button className={styles.card__button}>Reply</button>
        </div>
      </div>
      <div className={styles.card__footer}>
        {/* Add any footer content */}
      </div>
    </div>
  );
}
