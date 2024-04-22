const identity = (i: any) => i;

export const PLACE_HOLDER = {
  '@@functional/placeholder': true,
};

const isPlaceHolder = (val: any) => val === PLACE_HOLDER;

const curry0 = (fn: Function) =>
  function _curried(...args: any[]) {
    if (args.length === 0 || (args.length === 1 && isPlaceHolder(args[0]))) {
      return _curried;
    }

    return fn(...args);
  };

const curryN = (n: number, fn: Function) => {
  if (n === 1) {
    return fn;
  }

  return curry0((...args: any[]) => {
    const argsLength = args.filter(arg => arg !== PLACE_HOLDER).length;

    if (argsLength >= n) {
      return fn(...args);
    }

    return curryN(
      n - argsLength,
      curry0((...restArgs: any[]) => {
        const newArgs = args.map(arg => (isPlaceHolder(arg) ? restArgs.shift() : arg));

        return fn(...newArgs, ...restArgs);
      }),
    );
  });
};

export const curry = (fn: Function) => curryN(fn.length, fn);

export const range = (begin: number, end: number) => {
  const arr = [];

  for (let i = begin; i < end; ++i) {
    arr[i - begin] = i;
  }

  return arr;
};

export const map = curry((fn: (value: any, index: number, array: any[]) => unknown, arr: any[]) => {
  if (Array.isArray(arr)) {
    return arr.map(fn);
  }

  return Object.keys(arr)
    .map(key => arr[key])
    .map(fn);
});

export const compose = (...args: any[]) => {
  if (!args.length) {
    return identity;
  }

  const fns = args.reverse();
  // first function can receive multiply arguments
  const firstFn = fns[0];
  const tailsFn = fns.slice(1);

  return (...composeArgs: any[]) => tailsFn.reduce((res, fn) => fn(res), firstFn(...composeArgs));
};

export const reverse = (arr: any[] | string) => {
  if (Array.isArray(arr)) {
    return arr.reverse();
  }

  // can be string
  return arr.split('').reverse().join('');
};

export const memoize = (fn: Function) => {
  let lastArgs: any[] = null;
  let lastResult: any[] = null;

  return (...args: any[]) => {
    if (lastArgs && args.every((val, i) => val === lastArgs[i])) {
      return lastResult;
    }

    lastArgs = args;
    lastResult = fn(...args);

    return lastResult;
  };
};
