# Changelog

## v1.2.0
**Breaking Changes**
- move Draftn css and Draft.js css to a css file located in `draftn/dist/index.css`

**Features**
- provides a javascript css file located in `draftn/dist/index.css-text.js` that can be used for css server side-rendering

**Fixes**
- increment default spaces between some elements
- prevent toolbar button to be checked in SSR

**Docs**
- add server-side rendering instructions

## v1.1.3
- fix: remove some draftn css

## v1.1.2
**Breaking Changes**
- the `draft.js` css import is removed form `DraftnEditor` so you should import it manually

**Fixes**
- makes `DraftnEditor` works in ssr
- makes html sanitization works in ssr

## v1.1.1
- fix: remove extra margins and paddings in draft content

## v1.1.0
**Breaking Changes**
- rename format class `.DraftnFormat_rootLtr` to `.DraftnFormat_root[langdir="ltr"]`
- rename format class `.DraftnFormat_rootRtl` to `.DraftnFormat_root[langdir="rtl"]`
- replace the two format classes `.DraftnFormat_olItem` and `.DraftnFormat_ulItem` with `.DraftnFormat_li`


**Features**
- add `DraftnView` and `DraftViewOnce` components
- add two format classes `.DraftnFormat_root[iseditable="true"]` and `.DraftnFormat_root[iseditable="false"]`

## v1.0.10
**Breaking Changes**
- rename format class `.DraftnFormat_ol` to `.DraftnFormat_olItem`
- rename format class `.DraftnFormat_ul` to `.DraftnFormat_ulItem`

**Fixes**
- support nested lists
- set image max width to 100%
- add title to the image toggle button

## v1.0.9
- correct the height of the editor

## v1.0.8
- correct toolbar height when scroll appear

## v1.0.7
- makes text pasted correctly
- makes toolbar horizontal scrollable
- correct blockquote style for LTR languages
- document `DraftnEditor` component

## v1.0.6
- includes `tslib` in `draftn` dependencies so you don't have to install it

## v1.0.5
Initial release
