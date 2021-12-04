import clsx from 'clsx';
import {
  ChangeEventHandler,
  forwardRef,
  HTMLProps,
  ReactNode,
  Ref,
} from 'react';
import parseExt from '../utils/parseExt';
import toolbarButtonStyles from '../styles/ToolbarButton.css';
import styles from '../styles/ToolbarFileInput.css';
import phrases from '../data/phrases';
import { DraftnLang } from '..';

export type PickHandler = (file: File) => void;

interface ToolbarFileInputProps extends HTMLProps<HTMLInputElement> {
  id: string;
  lang: DraftnLang;
  onPick: PickHandler;
  title?: string;
  extensions?: string[];
  children: ReactNode;
}

const ToolbarFileInput = forwardRef(
  (props: ToolbarFileInputProps, ref: Ref<HTMLInputElement>) => {
    const {
      className,
      id,
      onPick,
      children,
      lang,
      extensions,
      title,
      ...inputProps
    } = props;

    const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
      if (!e.target.files) return;

      const file = e.target.files[0];

      const fileExt = parseExt(file.name);

      if (!extensions || extensions.includes(fileExt)) {
        onPick(file);
      } else {
        alert(phrases.invalidImage[lang]);
      }

      e.target.value = '';
    };

    return (
      <>
        <label
          htmlFor={id}
          className={clsx(toolbarButtonStyles.root, className)}
          title={title}
        >
          {children}
        </label>

        <input
          ref={ref}
          id={id}
          className={styles.input}
          type="file"
          onChange={handleChange}
          accept={
            extensions
              ? extensions.map((ext) => `.${ext}`).join(',')
              : undefined
          }
          {...inputProps}
        />
      </>
    );
  },
);

export default ToolbarFileInput;
