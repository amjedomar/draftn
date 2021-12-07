import join from './join';
import spaceStart from './spaceStart';

type Replace = (cb: (tag: string, attrs: string) => string) => void;

interface LiteDOMElementMethods {
  setAttr: (attrKey: string, attrVal: string) => void;
  appendAttr: (attrKey: string, attrVal: string) => void;
  removeAttr: (attrKey: string) => void;
}

const _removeAttr = (attrs: string, attrKey: string): string => {
  const attrRegex = new RegExp(`${attrKey}\\s*?=\\s*?("|')(.*?)\\1`, 'gi');

  const resultAttrs = attrs.replace(attrRegex, '');

  return resultAttrs ? ` ${resultAttrs}` : '';
};

const _getAttribute = (attrs: string, attrKey: string): string | undefined => {
  const attrRegex = new RegExp(`${attrKey}\\s*?=\\s*?("|')(.*?)\\1`, 'i');

  const result = attrs.match(attrRegex);

  return result ? result[2] : undefined;
};

const setAttr =
  (replace: Replace) =>
  (attrKey: string, attrVal: string): void => {
    replace((tagName, attrs) => {
      const resultAttrs = join(
        _removeAttr(attrs, attrKey),
        `${attrKey}="${attrVal.trim()}"`,
      );

      return `<${tagName} ${resultAttrs}>`;
    });
  };

const appendAttr =
  (replace: Replace) =>
  (attrKey: string, attrVal: string): void => {
    replace((tagName, attrs) => {
      const resultAttrs = join(
        _removeAttr(attrs, attrKey),
        `${attrKey}="${join(_getAttribute(attrs, attrKey), attrVal)}"`,
      );

      return `<${tagName} ${resultAttrs}>`;
    });
  };

const removeAttr =
  (replace: Replace) =>
  (attrKey: string): void => {
    replace((tagName, attrs) => {
      const resultAttrs = spaceStart(_removeAttr(attrs, attrKey).trim());

      return `<${tagName}${resultAttrs}>`;
    });
  };

class LiteDOM {
  constructor(private html: string) {}

  getHTML = () => this.html;

  selectByTagName = (
    tagName: string,
    level?: number,
  ): LiteDOMElementMethods => {
    const tagRegex = new RegExp(
      `<((${tagName}( .*?)?)|(\\/\\s*?${tagName}\\s*?))>`,
      'gi',
    );

    let curLevel = -1;

    const replace: Replace = (cb) => {
      this.html = this.html.replace(tagRegex, (match, _p1, _p2, attrs) => {
        const isStart = !match.startsWith('</');

        if (isStart) {
          curLevel++;
        } else {
          curLevel--;
          return match;
        }

        if (typeof level !== 'undefined' && curLevel !== level) {
          return match;
        }

        return cb(tagName, attrs ?? '');
      });
    };

    return {
      setAttr: setAttr(replace),
      appendAttr: appendAttr(replace),
      removeAttr: removeAttr(replace),
    };
  };
}

export default LiteDOM;
