import { ContentState } from 'draft-js';
import { ReactNode } from 'react';
import formatStyles from '../styles/Format.css';

interface LinkEditableProps {
  entityKey: string;
  contentState: ContentState;
  children: ReactNode;
}

const LinkEditable = ({
  entityKey,
  contentState,
  children,
}: LinkEditableProps) => {
  const { url } = contentState.getEntity(entityKey).getData();

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      title={url}
      className={formatStyles.link}
    >
      {children}
    </a>
  );
};

export default LinkEditable;
