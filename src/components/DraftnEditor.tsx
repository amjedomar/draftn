import {
  Component,
  createRef,
  CSSProperties,
  RefObject,
  KeyboardEvent,
} from 'react';
import {
  DraftEditorCommand,
  DraftHandleValue,
  EditorCommand,
  EditorState,
  KeyBindingUtil,
  RichUtils,
} from 'draft-js';
import Editor from '@draft-js-plugins/editor';
import createImagePlugin from '@draft-js-plugins/image';
import createListPlugin from 'draft-js-list-plugin';
import clsx from 'clsx';
import {
  onDraftEditorCopy,
  onDraftEditorCut,
  handleDraftEditorPastedText,
  // @ts-ignore
} from 'draftjs-conductor';
import filterEditorState from '../utils/filterEditorState';
import ImageEditable from './ImageEditable';
import createLinkPlugin from '../plugins/linkPlugin';
import Toolbar, { ToolbarRefSetter } from './Toolbar';
import styles from '../styles/DraftnEditor.css';
import formatStyles from '../styles/Format.css';
import setBlockStyle from '../utils/setBlockStyle';

const listPlugin = createListPlugin({ allowNestedLists: true, maxDepth: 1 });
const imagePlugin = createImagePlugin({ imageComponent: ImageEditable });
const linkPlugin = createLinkPlugin();

export type DraftnLang = 'ar' | 'en';

export interface DraftnRestrictions {
  imageSrc?: string;
  imageExtensions?: string[];
  linkHref?: string;
}

export type DraftnChangeHandler = (editorState: EditorState) => void;

export type DraftnUploadHandler = (
  fileType: 'image',
  file: File,
  success: (fileUrl: string) => void,
  failure: () => void,
) => void;

export type DraftnFormat =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strikethrough'
  | 'header-two'
  | 'header-three'
  | 'ordered-list-item'
  | 'unordered-list-item'
  | 'blockquote'
  | 'image'
  | 'link';

export interface DraftnEditorProps {
  editorState: EditorState;
  onChange: DraftnChangeHandler;
  onUploadFile: DraftnUploadHandler;
  lang?: DraftnLang;
  restrictions?: DraftnRestrictions;
  editorKey?: string;
  exclude?: DraftnFormat[];
  className?: string;
  style?: CSSProperties;
}

const defaultProps = {
  lang: 'en',
};

type PropsWithDefaults = DraftnEditorProps & typeof defaultProps;

class DraftnEditor extends Component<DraftnEditorProps> {
  isChanged = false;

  wrapperRef = createRef<HTMLDivElement>();

  editorRef = createRef<Editor>();

  imageInputRef: RefObject<HTMLInputElement> | undefined;

  static defaultProps = defaultProps;

  focus = () => {
    this.editorRef.current?.focus();
  };

  handleChange: DraftnChangeHandler = (editorState: EditorState) => {
    const {
      editorState: prevEditorState,
      restrictions,
      onChange,
      exclude = [],
    } = this.props;

    const shouldFilter =
      editorState.getCurrentContent() !== prevEditorState.getCurrentContent() &&
      editorState.getLastChangeType() === 'insert-fragment';

    const updatedEditorState = shouldFilter
      ? filterEditorState(editorState, exclude, restrictions)
      : editorState;

    onChange(updatedEditorState);

    if (!this.isChanged) {
      setTimeout(() => {
        this.isChanged = true;
      }, 0);
    }
  };

  handleKeyCommand = (command: EditorCommand): DraftHandleValue => {
    const {
      editorState,
      onChange,
      lang,
      restrictions,
      exclude = [],
    } = this.props as PropsWithDefaults;

    let updatedEditorState: EditorState | undefined;

    if (
      ['bold', 'italic', 'underline', 'strikethrough']
        .filter((inlineStyle) => !exclude.includes(inlineStyle as DraftnFormat))
        .includes(command)
    ) {
      updatedEditorState = RichUtils.toggleInlineStyle(
        editorState,
        command.toLocaleUpperCase(),
      );
    }

    if (
      [
        'header-two',
        'header-three',
        'ordered-list-item',
        'unordered-list-item',
        'blockquote',
      ]
        .filter((block) => !exclude.includes(block as DraftnFormat))
        .includes(command)
    ) {
      updatedEditorState = RichUtils.toggleBlockType(editorState, command);
    }

    if (command === 'image') {
      this.imageInputRef!.current!.click();
      return 'handled';
    }

    if (command === 'link') {
      linkPlugin.addLink(editorState, { lang, restrictions }, (result) => {
        onChange(result);
      });

      return 'handled';
    }

    if (command === 'unlink') {
      linkPlugin.removeLink(editorState, (result) => {
        onChange(result);
      });

      return 'handled';
    }

    if (updatedEditorState) {
      onChange(updatedEditorState);
      return 'handled';
    }

    return 'not-handled';
  };

  handleKeyBinding = (
    e: KeyboardEvent,
  ): DraftEditorCommand | string | null | undefined => {
    const { editorState } = this.props;

    if (e.code === 'Enter') {
      const lastBlockKey = editorState
        .getCurrentContent()
        .getBlockMap()
        .last()
        .getKey();
      const focusKey = editorState.getSelection().getFocusKey();

      if (lastBlockKey === focusKey) {
        setTimeout(() => {
          this.wrapperRef.current!.scrollTop =
            this.wrapperRef.current!.scrollHeight;
        }, 0);
      }
    }

    if (KeyBindingUtil.hasCommandModifier(e)) {
      if (e.code === 'KeyS') return 'strikethrough';
      if (e.code === 'Digit2') return 'header-two';
      if (e.code === 'Digit3') return 'header-three';
      if (e.code === 'Digit7') return 'ordered-list-item';
      if (e.code === 'Digit8') return 'unordered-list-item';
      if (e.code === 'KeyQ') return 'blockquote';
      if (e.code === 'KeyG') return 'image';
      if (e.code === 'KeyL') {
        if (e.shiftKey) return 'unlink';
        return 'link';
      }
      if (
        ['Digit0', 'Digit1', 'Digit4', 'Digit5', 'Digit6', 'Digit9'].includes(
          e.code,
        )
      ) {
        return 'reversed';
      }
    }

    return undefined;
  };

  setRefs: ToolbarRefSetter = (refKey, refVal) => {
    if (refKey === 'imageInput') {
      this.imageInputRef = refVal;
    }
  };

  getEditorState = () => {
    const { editorState, restrictions, exclude = [] } = this.props;

    if (this.isChanged) {
      return editorState;
    }

    return filterEditorState(editorState, exclude, restrictions);
  };

  handlePastedText = (
    text: string,
    html: string,
    editorState: EditorState,
  ): DraftHandleValue => {
    const { onChange, exclude = [], restrictions } = this.props;

    const newState = handleDraftEditorPastedText(
      html,
      editorState,
    ) as EditorState;

    if (newState) {
      onChange(filterEditorState(newState, exclude, restrictions));
      return 'handled';
    }

    return 'not-handled';
  };

  render() {
    const {
      onUploadFile,
      lang,
      restrictions,
      editorKey,
      exclude = [],
      className,
      style,
    } = this.props as PropsWithDefaults;

    const editorState = this.getEditorState();

    const langDir = lang === 'ar' ? 'rtl' : 'ltr';

    if (restrictions?.imageExtensions?.length === 0) {
      throw new Error(
        'prop "restrictions.imageExtensions" cannot be an empty array ' +
          'either append strings to it or set it to undefined',
      );
    }

    return (
      <div
        className={clsx(
          'DraftnComponent',
          styles.root,
          styles[langDir],
          className,
        )}
        style={style}
      >
        <Toolbar
          editorState={editorState}
          lang={lang}
          restrictions={restrictions}
          exclude={exclude}
          plugins={{ imagePlugin, linkPlugin }}
          setRefs={this.setRefs}
          onChange={this.handleChange}
          onUploadFile={onUploadFile}
          focusEditor={this.focus}
        />

        <div
          ref={this.wrapperRef}
          className={clsx(styles.body, formatStyles.root)}
          data-langdir={langDir}
          data-iseditable="true"
          onClick={this.focus}
        >
          <div className={styles[langDir]}>
            <Editor
              textDirectionality={langDir.toUpperCase() as 'RTL' | 'LTR'}
              editorState={editorState}
              onChange={this.handleChange}
              plugins={[imagePlugin, listPlugin, linkPlugin]}
              ref={this.editorRef}
              handleKeyCommand={this.handleKeyCommand}
              keyBindingFn={this.handleKeyBinding}
              blockStyleFn={setBlockStyle}
              onCopy={onDraftEditorCopy}
              onCut={onDraftEditorCut}
              handlePastedText={this.handlePastedText}
              editorKey={editorKey}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default DraftnEditor;
