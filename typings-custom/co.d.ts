declare module 'co' {
  interface Co {
    (func: (...args: any[]) => any): Promise<any>;
    wrap: (func: (...args: any[]) => any) => (...args: any[]) => Promise<any>;
  }

  const co: Co;

  export = co;
}
