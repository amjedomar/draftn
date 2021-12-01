import { Component, createRef, MouseEventHandler, RefObject } from 'react';
import { EditorState, RichUtils } from 'draft-js';
import { ImageEditorPlugin } from '@draft-js-plugins/image';
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
import { DraftnUploadHandler } from './DraftnEditor';
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
            let result: EditorState;

            if (fileType === 'image') {
              const fileExt = parseExt(file.name);

              if (imageExtensions && !imageExtensions.includes(fileExt)) {
                focusEditor();
                return;
              }

              if (imageSrc && !new RegExp(imageSrc).test(imageSrc)) {
                focusEditor();
                return;
              }

              result = plugins.imagePlugin.addImage(editorState, imageUrl, {});
            }

            this.setState({ isUploading: false }, () => {
              onChange(result);
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
    const { editorState, restrictions } = this.props;
    const { isUploading } = this.state;
    const currentInlineStyles = editorState.getCurrentInlineStyle();
    const currentBlockType = RichUtils.getCurrentBlockType(editorState);

    return (
      <>
        <Backdrop show={isUploading} />

        <div className={styles.root}>
          {inlineStyleButtons.map(({ type, icon, title }) => (
            <ToolbarButton
              key={type}
              title={title}
              checked={currentInlineStyles.has(type)}
              data-style={type}
              onMouseDown={this.toggleInlineStyle}
            >
              {icon}
            </ToolbarButton>
          ))}

          {blockTypeButtons.map(({ type, icon, title }) => (
            <ToolbarButton
              key={type}
              title={title}
              checked={currentBlockType === type}
              data-block={type}
              onMouseDown={this.toggleBlockType}
            >
              {icon}
            </ToolbarButton>
          ))}

          <ToolbarFileInput
            ref={this.imageInputRef}
            onPick={this.handleFilePick('image')}
            id="image-input"
            title="Ctrl+G"
            extensions={restrictions?.imageExtensions}
          >
            <ImageIcon />
          </ToolbarFileInput>

          <ToolbarButton title="Ctrl+L" onMouseDown={this.handleAddLink}>
            <LinkIcon />
          </ToolbarButton>

          <ToolbarButton
            title="Ctrl+Shift+L"
            onMouseDown={this.handleRemoveLink}
          >
            <LinkOffIcon />
          </ToolbarButton>
        </div>
      </>
    );
  }
}

export default Toolbar;
