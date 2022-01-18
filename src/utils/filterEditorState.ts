import { EditorState } from 'draft-js';
// @ts-ignore
import { filterEditorState as $filterEditorState } from 'draftjs-filters';
import { DraftnFormat } from '../components/DraftnEditor';
import delUndefined from './delUndefined';

interface FilterRestrictions {
  imageSrc?: string;
  linkHref?: string;
}

const filterEditorState = (
  editorState: EditorState,
  exclude: DraftnFormat[],
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
      ].filter((block) => !exclude.includes(block as DraftnFormat)),
      styles: ['BOLD', 'ITALIC', 'UNDERLINE', 'STRIKETHROUGH'].filter(
        (inlineStyle) =>
          !exclude.includes(inlineStyle.toLowerCase() as DraftnFormat),
      ),
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
      ].filter(
        (entity) =>
          !exclude.includes(entity.type.toLowerCase() as DraftnFormat),
      ),
      maxNesting: 1,
      whitespacedCharacters: ['\t', '📷'],
    },
    editorState,
  );

export default filterEditorState;
