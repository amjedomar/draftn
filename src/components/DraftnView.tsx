import { CSSProperties } from 'react';
import { ContentState } from 'draft-js';
import { convertToHTML, IConvertToHTMLConfig } from 'draft-convert';
import DOMPurify from 'isomorphic-dompurify';
import clsx from 'clsx';
import formatStyles from '../styles/Format.css';
import styles from '../styles/DraftnView.css';
import { DraftnLang } from '..';
import phrases from '../data/phrases';

const OL = (depth: number) => {
  const type = depth % 2 ? 'a' : '1';

  return (
    <ol
      className={clsx(styles.list, depth === 0 && styles.listLevel0)}
      type={type}
    />
  );
};

const UL = (depth: number) => (
  <ul className={clsx(styles.list, depth === 0 && styles.listLevel0)} />
);

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

    if (block.type === 'ordered-list-item') {
      return {
        element: <li className={formatStyles.li} />,
        nest: OL,
      };
    }

    if (block.type === 'unordered-list-item') {
      return {
        element: <li className={formatStyles.li} />,
        nest: UL,
      };
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

export interface DraftnViewProps {
  contentState: ContentState;
  lang: DraftnLang;
  className?: string;
  style?: CSSProperties;
}

const DraftnView = ({
  contentState,
  lang,
  className,
  style,
}: DraftnViewProps) => {
  const html = DOMPurify.isSupported
    ? convertToHTML(covertConfig)(contentState)
    : `<p style="color: red">${phrases.unsupportedBrowser[lang]}</p>`;

  const langDir = lang === 'ar' ? 'rtl' : 'ltr';

  return (
    <div
      className={clsx('DraftnComponent', styles.root, formatStyles.root, className)}
      style={style}
      data-langdir={langDir}
      data-iseditable="false"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }}
    />
  );
};

export default DraftnView;
