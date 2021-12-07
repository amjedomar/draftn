const injectCss = (css: string): void => {
  if (!document) return;
  
  const style = document.createElement('style');

  document.head.appendChild(style);
  
  style.appendChild(document.createTextNode(css));
};

export default injectCss;
