declare module 'commander' {
  interface Program {
    usage: (description: string) => Program;
    option: (flags: string, description: string, fn: Function | any, defaultValue?: any) => Program;
    parse: (argv: any) => any;
    outputHelp: () => void;
  }

  const program: Program;

  export = program;
}
