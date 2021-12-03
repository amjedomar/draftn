# Draftn

A text editor based on Draft.js

## Installation
first, navigate to a react.js project (if you don't have one you can create one using [`create-react-app`](https://create-react-app.dev)) then run

**using npm**
```
npm install draftn draft-js
```

**or using yarn**
```
yarn add draftn draft-js
```

## Example

**JavaScript Example**
```js
import { Component } from "react";
import { DraftnEditor } from "draftn";
import { EditorState } from "draft-js";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editorState: EditorState.createEmpty(),
    };
  }

  onChange = (editorState) => {
    this.setState({ editorState });
  };

  handleFileUpload = (
    fileType,
    file,
    success,
    failure
  ) => {
    if (fileType === "image") {
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
        const imageUrl = reader.result;
        success(imageUrl);
      };

      reader.onerror = failure;
    }
  };

  render() {
    const { editorState } = this.state;

    return (
      <DraftnEditor
        style={{
          maxWidth: "600px",
          height: "300px",
        }}
        editorState={editorState}
        onChange={this.onChange}
        onUploadFile={this.handleFileUpload}
        lang="en"
        restrictions={{
          linkHref: "^https?:\\/\\/",
          imageSrc: "^(https?:\\/\\/|data:)",
          imageExtensions: ["png", "jpg", "jpeg"],
        }}
      />
    );
  }
}

export default App;
```

**TypeScript Example**
```ts
import { Component } from "react";
import { DraftnEditor, DraftnUploadHandler } from "draftn";
import { EditorState } from "draft-js";

interface AppProps {}

interface AppState {
  editorState: EditorState;
}

class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    this.state = {
      editorState: EditorState.createEmpty(),
    };
  }

  onChange = (editorState: EditorState) => {
    this.setState({ editorState });
  };

  handleFileUpload: DraftnUploadHandler = (
    fileType,
    file,
    success,
    failure
  ) => {
    if (fileType === "image") {
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
        style={{
          maxWidth: "600px",
          height: "300px",
        }}
        editorState={editorState}
        onChange={this.onChange}
        onUploadFile={this.handleFileUpload}
        lang="en"
        restrictions={{
          linkHref: "^https?:\\/\\/",
          imageSrc: "^(https?:\\/\\/|data:)",
          imageExtensions: ["png", "jpg", "jpeg"],
        }}
      />
    );
  }
}

export default App;
```

## API
### `<DraftnEditor />` Props

Name | Type | Description
--- | ----- | ---
`editorState*` | `EditorState` | The state which represents the content of the editor
`onChange*` | `func` | The function that will receive the new editor state whenever the user changes the editor's content. <br /><br /> **Signature** <br /> `(editorState: EditorState) => void`
`onUploadFile*` | `func` |  The function that will be invoked when the user uploaded a file and will receive the `fileType` and the `file` and two functions `success` and `failure`. <br /> After the app uploaded the file to the server successfully and got its url or maybe convert it to `base64` url the app has to call the `success` function and pass to it the image url. <br /> However, if the app failed to upload the file because of the network connection the app has to call the `failure` function.  <br /><br /> **Signature** <br /> `function (` <br /> &nbsp;&nbsp;`fileType: 'image',` <br /> &nbsp;&nbsp;`file: File,` <br /> &nbsp;&nbsp;`success: (fileUrl: string) => void,` <br />&nbsp;&nbsp;`failure: () => void` <br /> `) => void`
`lang?` | `'en' \| 'ar'` | The language that will be used to describe things for the user and will also determine the direction of the editor either `LTR` or `RTL`. <br /><br /> **Default**: 'en' 
`restrictions?` | `object` | An optional object that will restrict the editor with the following optional properties: <br /><br /> `linkHref?` &nbsp;(regex as `string`) <br />  The value of it will tell the editor to show an error to the user if he/she creates a link that its href doesn't match it. also, it will be used to remove any hrefs that doesn't much it in the initial editor state or when the user pasted a link(s). <br /><br /> `imageSrc?` &nbsp;(regex as `string`) <br /> The value of it will tell the editor to show an error to the user if the uploaded image's src doesn't match it. also, it will be used to remove any images that doesn't much it in the initial editor state or when the user pasted an image(s). <br /><br /> `imageExtensions?` &nbsp;(`string[]`) <br /> The value of it will tell the editor to filter the files that appeared in the upload window and it will show an error to the user if he/she uploaded a file with an extension that isn't included in the given extensions. however unlike `imageSrc`, this restriction will **not** apply in the initial state or when the user paste.
`className?` | `string` | A name of a CSS class that may change the editor's `width`/`height` or any other style stuff
`style?` | `CSSProperties` | A style object that may change the editor's `width`/`height` or any other style stuff

## CSS Classes
using these CSS classes you can customize the draft content style

| Name | Description |
| --- | --- |
| `.DraftnFormat_root` | The class of the root element that wraps the editor 
| `.DraftnFormat_rootLtr` | The class of the root element that wraps the editor content which its `lang` prop value is an LTR language
| `.DraftnFormat_rootRtl` | The class of the root element that wraps the editor content which its `lang` prop value is an RTL language
| `.DraftnFormat_h2` | The class of `h2` elements
| `.DraftnFormat_h3` | The class of `h3` elements
| `.DraftnFormat_ol` | The class of `li` elements that are children of the `ol` element
| `.DraftnFormat_ul` | The class of `li` elements that are children of the `ul` element
| `.DraftnFormat_blockquote` | The class of `blockquote` elements
| `.DraftnFormat_image` | The class of `img` elements
| `.DraftnFormat_link` | The class of `a` elements
