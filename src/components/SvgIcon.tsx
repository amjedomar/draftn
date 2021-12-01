import { ReactNode, SVGProps } from 'react';
import clsx from 'clsx';
import styles from '../styles/SvgIcon.css';

interface SvgIconProps extends SVGProps<SVGSVGElement> {
  viewBox: string;
  children: ReactNode;
}

const SvgIcon = ({
  className,
  viewBox,
  children,
  ...svgProps
}: SvgIconProps) => (
  <svg className={clsx(styles.root, className)} viewBox={viewBox} {...svgProps}>
    {children}
  </svg>
);

export default SvgIcon;
