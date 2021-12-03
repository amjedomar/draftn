const capitalize = <T extends string>(str: T): Uppercase<T> =>
  (str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()) as Uppercase<T>;

export default capitalize;
