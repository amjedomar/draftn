# Draftn

A text editor that comes with a compatible view component based on Draft.js that works in both client-side and server-side (see the [Server Side Rendering Instructions](#server-side-rendering-instructions) below).

## Installation

first, navigate to a react.js project (if you don't have one already, you can create one using [`create-react-app`](https://create-react-app.dev)) then run

**using npm**

```
npm install draftn draft-js@0.11.7
```

**or using yarn**

```
yarn add draftn draft-js@0.11.7
```

## Examples

**`DraftnEditor` example**

```ts
import { Component } from 'react';
import { DraftnEditor, DraftnUploadHandler } from 'draftn';
import { EditorState, convertFromRaw } from 'draft-js';
/*
 you must not import the 'draft-js/dist/Draft.css' file
 because its code included in the 'draftn/dist/index.css' file
*/
import 'draftn/dist/index.css';

const emptyContentState = convertFromRaw({
  blocks: [
    {
      key: 'foo',
      text: '',
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
  ],
  entityMap: {},
});

interface AppProps {}

interface AppState {
  editorState: EditorState;
}

class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    this.state = {
      editorState: EditorState.createWithContent(emptyContentState),
    };
  }

  onChange = (editorState: EditorState) => {
    this.setState({ editorState });
  };

  handleFileUpload: DraftnUploadHandler = (
    fileType,
    file,
    success,
    failure,
  ) => {
    if (fileType === 'image') {
      /*
        you can send the image to the server
        then pass the image url you will receive
        to "success" function like the following
      */

      // const formData = new FormData();
      // formData.set("image", file);
      // fetch("http://localhost:3030/upload", {
      //   method: "POST",
      //   body: formData,
      // })
      //   .then((res) => res.json())
      //   .then(data => {
      //     success(data.imageUrl);
      //   })
      //   .catch(failure);

      /*
        or you can convert it to base64 url
        then pass it to "success" function
        like the following
      */

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        success(imageUrl);
      };

      reader.onerror = failure;
    }
  };

  render() {
    const { editorState } = this.state;

    return (
      <DraftnEditor
        editorKey="foo"
        style={{
          maxWidth: '600px',
          height: '300px',
        }}
        editorState={editorState}
        onChange={this.onChange}
        onUploadFile={this.handleFileUpload}
        lang="en"
        restrictions={{
          linkHref: '^https?:\\/\\/',
          imageSrc: '^(https?:\\/\\/|data:)',
          imageExtensions: ['png', 'jpg', 'jpeg'],
        }}
      />
    );
  }
}

export default App;
```

**`DraftnView` example**

```ts
import { Component } from 'react';
import { DraftnView } from 'draftn';
import { EditorState, RawDraftContentState, convertFromRaw } from 'draft-js';
/*
 you must not import the 'draft-js/dist/Draft.css' file
 because its code included in the 'draftn/dist/index.css' file
*/
import 'draftn/dist/index.css';

const rawContentState: RawDraftContentState = {
  blocks: [
    {
      key: 'foo',
      text: 'Draft.js is a JavaScript rich text editor framework',
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [
        {
          offset: 0,
          length: 8,
          style: 'BOLD',
        },
        {
          offset: 14,
          length: 10,
          style: 'ITALIC',
        },
      ],
      entityRanges: [],
      data: {},
    },
  ],
  entityMap: {},
};

const contentState = convertFromRaw(rawContentState);

interface AppProps {}

interface AppState {
  editorState: EditorState;
}

class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    this.state = {
      editorState: EditorState.createWithContent(contentState),
    };
  }

  render() {
    const { editorState } = this.state;
    const contentState = editorState.getCurrentContent();

    /*
     * for good performance use 'DraftnViewOnce' rather than 'DraftnView'
     * if the component will renders once only
     */
    return <DraftnView lang="en" contentState={contentState} />;
  }
}

export default App;
```

## Server-Side Rendering Instructions

to make the Draftn components render correctly in both server-side and client-side follow these instructions

- replace the Draftn css file import with `DRAFTN_CSS` constant import from the Draftn javascript css text file then pass the constant to a CSS-in-JS library that supports css rendering for both client-side and server-side like [`styled-jsx`](https://github.com/vercel/styled-jsx), [`emotion-js`](https://github.com/emotion-js/emotion), [`styled-components`](https://github.com/styled-components/styled-components), or others. like the following:

```ts
import { Component } from 'react';
import { DraftnEditor, DraftnView } from 'draftn';
/*
 * import the `DRAFTN_CSS` constant from the Draftn javascript css text file
 */
import DRAFTN_CSS from 'draftn/dist/index.css-text';

class App extends Component {
  render() {
    return (
      <>
        {/* pass the `DRAFTN_CSS` constant to `styled-jsx` */}
        <style jsx>{DRAFTN_CSS}</style>

        <DraftnEditor {...draftnEditorProps} />

        {/*
         * for good performance use 'DraftnViewOnce' rather than 'DraftnView'
         * if the component will renders once only
         */}
        <DraftnView {...draftnViewProps} />
      </>
    );
  }
}

export default App;
```

- set the `editorKey` prop of the `DraftnEditor` component explicitly. like the following:

```ts
import { Component } from 'react';
import { DraftnEditor } from 'draftn';

class App extends Component {
  render() {
    return <DraftnEditor editorKey="foo" {...restDraftnEditorProps} />;
  }
}

export default App;
```

- don't use the `EditorState.createEmpty()` to generate the initial `editorState` of the `DraftnEditor` component instead use the `EditorState.createWithContent()`. like the following:

```ts
import { Component } from 'react';
import { DraftnEditor } from 'draftn';
import { EditorState, convertFromRaw } from 'draft-js';

const emptyContentState = convertFromRaw({
  blocks: [
    {
      key: 'foo',
      text: '',
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
  ],
  entityMap: {},
});

interface AppProps {}

interface AppState {
  editorState: EditorState;
}

class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    this.state = {
      /**
       * use the `EditorState.createWithContent()` instead of the `EditorState.createEmpty()`
       * like the following
       */
      editorState: EditorState.createWithContent(emptyContentState),
    };
  }

  render() {
    const { editorState } = this.state;

    return (
      <DraftnEditor editorState={editorState} {...restDraftnEditorProps} />
    );
  }
}

export default App;
```

## Components API
### `<DraftnEditor />` Props

Name | Type | Description
--- | ----- | ---
`editorState*` | `EditorState` | The state which represents the content of the editor
`onChange*` | `func` | The function that will receive the new editor state whenever the user changes the editor's content. <br /><br /> **Signature** <br /> `(editorState: EditorState) => void`
`onUploadFile*` | `func` |  The function that will be invoked when the user uploaded a file and will receive the `fileType` and the `file` and two functions `success` and `failure`. <br /> After the app uploaded the file to the server successfully and got its url or maybe convert it to `base64` url the app has to call the `success` function and pass to it the image url. <br /> However, if the app failed to upload the file because of the network connection the app has to call the `failure` function.  <br /><br /> **Signature** <br /> `function (` <br /> &nbsp;&nbsp;`fileType: 'image',` <br /> &nbsp;&nbsp;`file: File,` <br /> &nbsp;&nbsp;`success: (fileUrl: string) => void,` <br />&nbsp;&nbsp;`failure: () => void` <br /> `) => void`
| `editorKey?` | `string` | this prop is optional if you don't set it, `draft-js` will automatically generate a unique `editorKey`. However, if you are rendering the editor on the server-side you must set this prop to avoid server/client mismatches. and its value must be a unique value per editor.
`lang?` | `'en' \| 'ar'` | The language that will be used to describe things for the user and will also determine the direction of the editor either `LTR` or `RTL`. <br /><br /> **Default**: 'en' 
`restrictions?` | `object` | An optional object that will restrict the editor with the following optional properties: <br /><br /> `linkHref?` &nbsp;(regex as `string`) <br />  The value of it will tell the editor to show an error to the user if he/she creates a link that its href doesn't match it. also, it will be used to remove any hrefs that doesn't much it in the initial editor state or when the user pasted a link(s). <br /><br /> `imageSrc?` &nbsp;(regex as `string`) <br /> The value of it will tell the editor to show an error to the user if the uploaded image's src doesn't match it. also, it will be used to remove any images that doesn't much it in the initial editor state or when the user pasted an image(s). <br /><br /> `imageExtensions?` &nbsp;(`string[]`) <br /> The value of it will tell the editor to filter the files that appeared in the upload window and it will show an error to the user if he/she uploaded a file with an extension that isn't included in the given extensions. however unlike `imageSrc`, this restriction will **not** apply in the initial state or when the user paste.
`className?` | `string` | A name of a CSS class that may change the editor's `width`/`height` or any other style stuff
`style?` | `CSSProperties` | A style object that may change the editor's `width`/`height` or any other style stuff

### `<DraftnView />` Props

Name | Type | Description
--- | ----- | ---
`editorState*` | `EditorState` | The state which represents the content of the draft
`lang?` | `'en' \| 'ar'` | The language that will be used to describe things for the user and will also determine the direction of the draft content either `LTR` or `RTL`. <br /><br /> **Default**: 'en' 
`className?` | `string` | A name of a CSS class that may change the draft's `width`/`height` or any other style stuff
`style?` | `CSSProperties` | A style object that may change the darft's `width`/`height` or any other style stuff

### `<DraftnViewOnce />`
this component has the same props and functionality of `DraftnView` except it will render once only (which is good for performance)

## CSS Classes
using these CSS classes you can customize the draft content style

| Name | Description |
| --- | --- |
| `.DraftnFormat_root` | The class of the root element that wraps the draft content 
| `.DraftnFormat_root[langdir="ltr"]` | The class of the root element that wraps the draft content which its `lang` prop value is an LTR language
| `.DraftnFormat_root[langdir="rtl"]` | The class of the root element that wraps the draft content which its `lang` prop value is an RTL language
| `.DraftnFormat_root[iseditable="true"]` | The class of the root element that wraps the draft content which its component is `DraftnEditor`
| `.DraftnFormat_root[iseditable="false"]` | The class of the root element that wraps the draft content which its component is `DraftnView`
| `.DraftnFormat_h2` | The class of `h2` elements
| `.DraftnFormat_h3` | The class of `h3` elements
| `.DraftnFormat_li` | The class of `li` elements
| `.DraftnFormat_blockquote` | The class of `blockquote` elements
| `.DraftnFormat_image` | The class of `img` elements
| `.DraftnFormat_link` | The class of `a` elements
