import clsx from 'clsx';
import Spinner from './Spinner';
import styles from '../styles/Backdrop.css';

interface BackdropProps {
  show: boolean;
}

const Backdrop = ({ show }: BackdropProps) => (
  <div className={clsx(styles.root, show ?? 'show')}>
    <Spinner />
  </div>
);

export default Backdrop;
