export function wrapNextReturnValue(func: (index: number) => any, arg: number): Promise<any> {
  try {
    const result = func(arg);
    if (result && typeof result.then === 'function') {
      return result;
    } else {
      return Promise.resolve(result);
    }
  } catch (err) {
    return Promise.reject(err);
  }
}
