import {
  CSSProperties,
  ReactNode,
  MouseEventHandler,
  HTMLAttributes,
} from 'react';
import clsx from 'clsx';
import styles from '../styles/ToolbarButton.css';

interface ToolbarBtnProps extends HTMLAttributes<HTMLButtonElement> {
  className?: string;
  style?: CSSProperties;
  checked?: boolean;
  onMouseDown?: MouseEventHandler<HTMLButtonElement>;
  onCheck?: MouseEventHandler<HTMLButtonElement>;
  onUncheck?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  children: ReactNode;
}

const ToolbarBtn = ({
  className,
  style,
  checked,
  onMouseDown,
  onCheck,
  onUncheck,
  disabled,
  children,
  ...buttonProps
}: ToolbarBtnProps) => {
  const handleMouseDown: MouseEventHandler<HTMLButtonElement> = (e) => {
    if (onMouseDown) onMouseDown(e);
    if (!checked && onCheck) onCheck(e);
    if (checked && onUncheck) onUncheck(e);
  };

  return (
    <button
      className={clsx(styles.root, checked && styles.checked, className)}
      type="button"
      style={style}
      disabled={disabled}
      onMouseDown={handleMouseDown}
      {...buttonProps}
    >
      {children}
    </button>
  );
};

export default ToolbarBtn;
