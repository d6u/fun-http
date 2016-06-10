export function toPromise(obj: any): Promise<any> {
  if (isPromise(obj)) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return arrayToPromise(obj);
  }

  if (isObject(obj)) {
    return objectToPromise(obj);
  }

  return Promise.resolve(obj);
}

function isPromise(obj: any) {
  return obj != null && typeof obj.then === 'function';
}

function isObject(val: any) {
  return val != null && Object === val.constructor;
}

function arrayToPromise(obj: any[]) {
  return Promise.all(obj.map(toPromise));
}

function objectToPromise(obj: any): Promise<any> {
  const results = new obj.constructor();
  const keys = Object.keys(obj);
  const promises: Promise<any>[] = [];

  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    const promise = toPromise(obj[key]);
    if (promise && isPromise(promise)) {
      defer(promise, key);
    } else {
      results[key] = obj[key];
    }
  }

  return Promise.all(promises).then(() => results);

  function defer(promise: Promise<any>, key: string) {
    promises.push(promise.then(function (res) {
      results[key] = res;
    }));
  }
}
