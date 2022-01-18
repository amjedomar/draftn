import { Component, createRef, MouseEventHandler, RefObject } from 'react';
import { EditorState, RichUtils } from 'draft-js';
import { ImageEditorPlugin } from '@draft-js-plugins/image';
import clsx from 'clsx';
import Backdrop from './Backdrop';
import ToolbarFileInput, { PickHandler } from './ToolbarFileInput';
import { LinkEditorPlugin } from '../plugins/linkPlugin';
import { blockTypeButtons, inlineStyleButtons } from '../data/toolbarButtons';
import ToolbarButton from './ToolbarButton';
import ImageIcon from '../icons/ImageIcon';
import LinkIcon from '../icons/LinkIcon';
import LinkOffIcon from '../icons/LinkOffIcon';
import phrases from '../data/phrases';
import styles from '../styles/Toolbar.css';
import { DraftnFormat, DraftnUploadHandler } from './DraftnEditor';
import { DraftnRestrictions } from '..';
import parseExt from '../utils/parseExt';

export type ToolbarRefSetter = (
  refKey: 'imageInput',
  refVal: RefObject<HTMLInputElement>,
) => void;

interface ToolbarProps {
  editorState: EditorState;
  lang: 'en' | 'ar';
  restrictions?: DraftnRestrictions;
  exclude: DraftnFormat[];
  plugins: {
    imagePlugin: ImageEditorPlugin;
    linkPlugin: LinkEditorPlugin;
  };
  setRefs: ToolbarRefSetter;
  onChange: (editorState: EditorState) => void;
  onUploadFile: DraftnUploadHandler;
  focusEditor: () => void;
}

interface ToolbarState {
  isUploading: boolean;
}

class Toolbar extends Component<ToolbarProps, ToolbarState> {
  imageInputRef = createRef<HTMLInputElement>();

  constructor(props: ToolbarProps) {
    super(props);

    this.state = {
      isUploading: false,
    };
  }

  componentDidMount() {
    const { setRefs } = this.props;

    setRefs('imageInput', this.imageInputRef);
  }

  toggleInlineStyle: MouseEventHandler<HTMLButtonElement> = (event) => {
    const { editorState, onChange } = this.props;
    event.preventDefault();
    const style = event.currentTarget.getAttribute('data-style')!;
    onChange(RichUtils.toggleInlineStyle(editorState, style));
  };

  toggleBlockType: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    const { editorState, onChange } = this.props;
    const block = event.currentTarget.getAttribute('data-block')!;
    onChange(RichUtils.toggleBlockType(editorState, block));
  };

  handleFilePick =
    (fileType: 'image'): PickHandler =>
    (file) => {
      const {
        editorState,
        onChange,
        onUploadFile,
        plugins,
        lang,
        restrictions: { imageSrc, imageExtensions } = {},
        focusEditor,
      } = this.props;

      this.setState({ isUploading: true });

      if (onUploadFile)
        onUploadFile(
          fileType,
          file,
          (imageUrl: string) => {
            let result: EditorState | undefined;

            const fileExt = parseExt(file.name);

            if (fileType === 'image') {
              if (
                (!imageExtensions || imageExtensions.includes(fileExt)) &&
                (!imageSrc || new RegExp(imageSrc).test(imageUrl))
              ) {
                result = plugins.imagePlugin.addImage(
                  editorState,
                  imageUrl,
                  {},
                );
              }
            }

            if (result) {
              onChange(result);
            } else {
              alert(phrases.invalidImage[lang]);
            }

            this.setState({ isUploading: false }, () => {
              focusEditor();
            });
          },
          () => {
            if (fileType === 'image') {
              alert(phrases.imageUploadFailed[lang]);
            }

            this.setState({ isUploading: false });
          },
        );
    };

  handleAddLink: MouseEventHandler = (e) => {
    e.preventDefault();
    const { editorState, onChange, plugins, lang, restrictions } = this.props;
    plugins.linkPlugin.addLink(
      editorState,
      { lang, restrictions },
      (result) => {
        onChange(result);
      },
    );
  };

  handleRemoveLink: MouseEventHandler = (e) => {
    e.preventDefault();
    const { editorState, onChange, plugins } = this.props;
    plugins.linkPlugin.removeLink(editorState, (result) => {
      onChange(result);
    });
  };

  render() {
    const { editorState, restrictions, lang, exclude } = this.props;
    const { isUploading } = this.state;
    const currentInlineStyles = editorState.getCurrentInlineStyle();
    const currentBlockType = RichUtils.getCurrentBlockType(editorState);
    const isClientSide = typeof window !== 'undefined';

    const langDir = lang === 'ar' ? 'rtl' : 'ltr';

    return (
      <>
        <Backdrop show={isUploading} />

        <div className={clsx(styles.root, styles[langDir])}>
          {inlineStyleButtons
            .filter(
              (inlineStyle) =>
                !exclude.includes(
                  inlineStyle.type.toLowerCase() as DraftnFormat,
                ),
            )
            .map(({ type, icon, title }) => (
              <ToolbarButton
                key={type}
                title={title}
                checked={isClientSide && currentInlineStyles.has(type)}
                data-style={type}
                onMouseDown={this.toggleInlineStyle}
              >
                {icon}
              </ToolbarButton>
            ))}

          {blockTypeButtons
            .filter(
              (block) =>
                !exclude.includes(block.type as DraftnFormat),
            )
            .map(({ type, icon, title }) => (
              <ToolbarButton
                key={type}
                title={title}
                checked={isClientSide && currentBlockType === type}
                data-block={type}
                onMouseDown={this.toggleBlockType}
              >
                {icon}
              </ToolbarButton>
            ))}

          {!exclude.includes('image') && (
            <ToolbarFileInput
              ref={this.imageInputRef}
              onPick={this.handleFilePick('image')}
              id="image-input"
              title="Ctrl+G"
              lang={lang}
              extensions={restrictions?.imageExtensions}
            >
              <ImageIcon />
            </ToolbarFileInput>
          )}

          {!exclude.includes('link') && (
            <>
              <ToolbarButton title="Ctrl+L" onMouseDown={this.handleAddLink}>
                <LinkIcon />
              </ToolbarButton>

              <ToolbarButton
                title="Ctrl+Shift+L"
                onMouseDown={this.handleRemoveLink}
              >
                <LinkOffIcon />
              </ToolbarButton>
            </>
          )}
        </div>
      </>
    );
  }
}

export default Toolbar;
