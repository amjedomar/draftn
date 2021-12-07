const join = (...strings: (string | null | undefined)[]): string =>
  strings
    .filter((s) => s)
    .map((s) => s!.trim())
    .join(' ')
    .trim();

export default join;
