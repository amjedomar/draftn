import { Image } from '@draft-js-plugins/image';
import { ImageProps } from '@draft-js-plugins/image/lib/Image';
import formatStyles from '../styles/Format.css';

const ImageEditable = ({ className, ...restProps }: ImageProps) => (
  <Image
    {...restProps}
    className={`${className ?? ''} ${formatStyles.image}`}
  />
);

export default ImageEditable;
