declare module 'lodash/isString' {
  interface IsString {
    (value: any): boolean;
  }

  const isString: IsString;

  export = isString;
}
