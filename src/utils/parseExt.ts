const parseExt = (fileName: string) =>
  fileName.split('.').splice(-1)[0].trim().toLowerCase();

export default parseExt;
