import { ReactNode, SVGProps } from 'react';

interface SvgIconProps extends SVGProps<SVGSVGElement> {
  viewBox: string;
  children: ReactNode;
}

const SvgIcon = ({ style, viewBox, children, ...svgProps }: SvgIconProps) => (
  <svg
    style={{
      display: 'inline-block',
      width: '1em',
      height: '1em',
      fontSize: '24px',
      fill: 'currentColor',
      userSelect: 'none',
      ...style,
    }}
    viewBox={viewBox}
    {...svgProps}
  >
    {children}
  </svg>
);

export default SvgIcon;
