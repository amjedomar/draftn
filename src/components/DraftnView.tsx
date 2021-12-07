import { CSSProperties } from 'react';
import { ContentState } from 'draft-js';
import { convertToHTML, IConvertToHTMLConfig } from 'draft-convert';
import DOMPurify from 'dompurify';
import clsx from 'clsx';
import formatStyles from '../styles/Format.css';
import styles from '../styles/DraftnView.css';
import LiteDOM from '../utils/LiteDOM';
import { DraftnLang } from '..';

const covertConfig: IConvertToHTMLConfig = {
  styleToHTML: (style) => {
    if (style === 'STRIKETHROUGH') {
      return <s />;
    }

    return undefined;
  },
  blockToHTML: (block) => {
    if (
      ['unstyled', 'paragraph', 'header-two', 'header-three'].includes(
        block.type,
      ) &&
      block.text.trim().length === 0
    ) {
      return <br />;
    }

    if (block.type === 'unstyled' || block.type === 'paragraph') {
      return <p className={formatStyles.p} />;
    }

    if (block.type === 'header-two') {
      // eslint-disable-next-line jsx-a11y/heading-has-content
      return <h2 className={formatStyles.h2} />;
    }

    if (block.type === 'header-three') {
      // eslint-disable-next-line jsx-a11y/heading-has-content
      return <h3 className={formatStyles.h3} />;
    }

    if (block.type === 'blockquote') {
      return <blockquote className={formatStyles.blockquote} />;
    }
    
    return undefined;
  },
  entityToHTML: (entity, originalText) => {
    if (entity.type === 'IMAGE') {
      return (
        <img className={formatStyles.image} src={entity.data.src} alt="" />
      );
    }

    if (entity.type === 'LINK') {
      return (
        <a className={formatStyles.link} href={entity.data.url}>
          {originalText}
        </a>
      );
    }

    return undefined;
  },
};

interface DraftnViewProps {
  contentState: ContentState;
  lang: DraftnLang;
  className?: string;
  style?: CSSProperties;
}

const DraftnView = ({ contentState, lang, className, style }: DraftnViewProps) => {
  let html = convertToHTML(covertConfig)(contentState);

  const liteDOM = new LiteDOM(html);
  liteDOM.selectByTagName('ol').appendAttr('class', styles.list);
  liteDOM.selectByTagName('ul').appendAttr('class', styles.list);
  liteDOM.selectByTagName('ol', 0).appendAttr('class', styles.listLevel0);
  liteDOM.selectByTagName('ul', 0).appendAttr('class', styles.listLevel0);
  liteDOM.selectByTagName('li').appendAttr('class', formatStyles.li);

  html = liteDOM.getHTML();

  const langDir = lang === 'ar' ? 'rtl' : 'ltr';

  return (
    <div
      className={clsx(styles.root, formatStyles.root, className)}
      style={style}
      data-langdir={langDir}
      data-iseditable="false"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }}
    />
  );
};

export default DraftnView;
