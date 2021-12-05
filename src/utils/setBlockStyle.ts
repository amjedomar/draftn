import { ContentBlock } from 'draft-js';
import styles from '../styles/Format.css';

const setBlockStyle = (block: ContentBlock): string => {
  const type = block.getType();
  if (type === 'header-two') return styles.h2;
  if (type === 'header-three') return styles.h3;
  if (type === 'ordered-list-item') return styles.olItem;
  if (type === 'unordered-list-item') return styles.ulItem;
  if (type === 'blockquote') return styles.blockquote;

  return '';
};

export default setBlockStyle;
