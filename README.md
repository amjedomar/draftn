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

## API
### `<DraftnEditor />` Props

Name | Type | Description
--- | ----- | ---
`editorState*` | `EditorState` | The state which represents the content of the editor
`onChange*` | `func` | The function that will be passed the new editor state whenever the user changes the editor state. <br /><br /> **Signature** <br /> `(editorState: EditorState) => void`
`onUploadFile*` | `func` |  The function that will be invoked when the user uploaded a file and will be passed the `fileType` and the `file` and two functions `success` and `failure`. <br /> After the app uploaded the file to the server successfully and got its link or maybe convert it to `base64` url the app has to call the `success` function and pass to it the image url. <br /> However, if the app failed to upload the file because of the network connection the app has to call the `failure` function.  <br /><br /> **Signature** <br /> `function (` <br /> &nbsp;&nbsp;`fileType: 'image',` <br /> &nbsp;&nbsp;`file: File,` <br /> &nbsp;&nbsp;`success: (url: string) => void,` <br />&nbsp;&nbsp;`failure: () => void` <br /> `) => void`
`lang?` | `'en' \| 'ar'` | The language that will be used to describe things for the user and will also determine the direction of the editor either `LTR` or `RTL` 
`restrictions?` | `object` | An optional object that will restrict the editor with the following optional properties: <br /><br /> `linkHref?` &nbsp;(`string` as regex) <br /> The value of it will show an error to the user if he/she creates a link that its href doesn't match it. also, it will be used to remove any link's href that doesn't much it in the initial editor state or when the user pasted a link(s). <br /><br /> `imageSrc?` &nbsp;(`string` as regex) <br /> The value of it will show an error to the user if the uploaded image's src doesn't match it. also, it will be used to remove any images that doesn't much it in the initial editor state or when the user pasted an image(s). <br /><br /> `imageExtensions?` &nbsp;(`string[]`) <br /> The value of it will filter the files that appeared in the upload window and it will show an error to the user if he/she uploaded a file with an extension that doesn't match the given extension. however unlike `imageSrc`, it will not remove any of the images that don't match it in the initial state or the ones that are pasted.
`className?` | `string` | A name of a CSS class that may change the editor's `width`/`height` or any other style stuff
`style?` | `CSSProperties` | A style object that may change the editor's `width`/`height` or any other style stuff
