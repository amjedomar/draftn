import styles from '../styles/Spinner.css';

const Spinner = () => (
  <div className={styles.root}>
    <svg className={styles.svg} viewBox="22 22 44 44">
      <circle
        className={styles.svgCircle}
        cx="44"
        cy="44"
        r="20.2"
        fill="none"
        strokeWidth="3.6"
      />
    </svg>
  </div>
);

export default Spinner;
