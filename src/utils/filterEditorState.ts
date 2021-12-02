import { EditorState } from 'draft-js';
// @ts-ignore
import { filterEditorState as $filterEditorState } from 'draftjs-filters';
import delUndefined from './delUndefined';

interface FilterRestrictions {
  imageSrc?: string;
  linkHref?: string;
}

const filterEditorState = (
  editorState: EditorState,
  { imageSrc, linkHref }: FilterRestrictions = {},
): EditorState =>
  $filterEditorState(
    {
      blocks: [
        'header-two',
        'header-three',
        'blockquote',
        'unordered-list-item',
        'ordered-list-item',
      ],
      styles: ['BOLD', 'ITALIC', 'UNDERLINE', 'STRIKETHROUGH'],
      entities: [
        {
          type: 'IMAGE',
          attributes: ['src'],
          allowlist: delUndefined({
            src: imageSrc,
          }),
        },
        {
          type: 'LINK',
          attributes: ['url'],
          allowlist: delUndefined({
            url: linkHref,
          }),
        },
      ],
      whitespacedCharacters: ['\t', '📷'],
    },
    editorState,
  );

export default filterEditorState;
