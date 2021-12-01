import { EditorPlugin } from '@draft-js-plugins/editor';
import { EditorState, RichUtils, DraftDecorator } from 'draft-js';
import { DraftnLang, DraftnRestrictions } from '..';
import LinkEditable from '../components/LinkEditable';
import phrases from '../data/phrases';

type AddLink = (
  editorState: EditorState,
  options: {
    lang: DraftnLang;
    restrictions?: DraftnRestrictions;
  },
  cb: (result: EditorState) => void,
) => void;

type RemoveLink = (
  editorState: EditorState,
  cb: (result: EditorState) => void,
) => void;

export interface LinkEditorPlugin extends EditorPlugin {
  addLink: AddLink;
  removeLink: RemoveLink;
}

const addLink: AddLink = (editorState, { lang, restrictions }, cb) => {
  const selection = editorState.getSelection();

  if (selection.isCollapsed()) return;

  const contentState = editorState.getCurrentContent();

  const url = prompt(phrases.enterLink[lang]) || '';

  if (url.length === 0) return;

  if (
    restrictions?.linkHref &&
    new RegExp(restrictions.linkHref).test(url) === false
  ) {
    alert(phrases.invalidLink[lang]);
    return;
  }

  const contentStateWithEntity = contentState.createEntity('LINK', 'MUTABLE', {
    url,
  });
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  const newEditorState = EditorState.set(editorState, {
    currentContent: contentStateWithEntity,
  });

  const result = RichUtils.toggleLink(
    newEditorState,
    newEditorState.getSelection(),
    entityKey,
  );

  cb(result);
};

const removeLink: RemoveLink = (editorState, cb) => {
  const selection = editorState.getSelection();
  if (selection.isCollapsed()) return;
  const result = RichUtils.toggleLink(editorState, selection, null);
  cb(result);
};

const findLinkEntities: DraftDecorator['strategy'] = (
  contentBlock,
  callback,
  contentState,
) => {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === 'LINK'
    );
  }, callback);
};

const createLinkPlugin = (): LinkEditorPlugin => ({
  decorators: [
    {
      strategy: findLinkEntities,
      component: LinkEditable,
    },
  ],
  addLink,
  removeLink,
});

export default createLinkPlugin;
