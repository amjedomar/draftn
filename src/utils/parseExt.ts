const parseExt = (fileName: string) =>
  fileName.split('.').splice(-1)[0].trim().toLocaleLowerCase();

export default parseExt;
