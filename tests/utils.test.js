const {
  getType,
  escapeRegExp,
  mapKeys,
  mapKeyNames,
  resolveAllKeys,
  unique,
  intersection,
  pick,
  omit,
  mergeWhereClause,
  objMerge,
  defaultObj,
  arrayToObject,
  flatten,
  flatMap,
  zipObj,
  captureSuspensePromises,
  upcase,
  asyncForEach,
  isPromise,
  ...utils
} = require("../dist");

describe("utils", () => {
  test("upcase", () => {
    expect(upcase("Foo")).toEqual("Foo");
    expect(upcase("foo")).toEqual("Foo");
    expect(upcase("FooBar")).toEqual("FooBar");
    expect(upcase("fooBar")).toEqual("FooBar");
    expect(upcase("Foo bar")).toEqual("Foo bar");
    expect(upcase("foo bar")).toEqual("Foo bar");
    expect(upcase("Foo Bar")).toEqual("Foo Bar");
    expect(upcase("foo Bar")).toEqual("Foo Bar");
  });

  test("getType", () => {
    expect(getType(undefined)).toEqual("Undefined");
    expect(getType(null)).toEqual("Null");
    expect(getType(0)).toEqual("Number");
    expect(getType("a")).toEqual("String");
    expect(getType({})).toEqual("Object");
    expect(getType([])).toEqual("Array");
    expect(getType(() => {})).toEqual("Function");
  });

  test("escapeRegExp", () => {
    const s = "a-b/c[d]e{f}g(h)i*j+k?l.m\\n^o$p|";
    const t =
      "a\\-b\\/c\\[d\\]e\\{f\\}g\\(h\\)i\\*j\\+k\\?l\\.m\\\\n\\^o\\$p\\|";
    expect(escapeRegExp(s)).toEqual(t);
    expect(escapeRegExp("abc")).toEqual("abc");
    expect(escapeRegExp("")).toEqual("");
    expect(escapeRegExp(null)).toEqual("");
    expect(escapeRegExp(undefined)).toEqual("");
    expect(escapeRegExp()).toEqual("");
  });

  test("mapKeys", () => {
    // Simple value based function
    const o = { a: 1, b: 2, c: 3 };
    const f = (x) => 2 * x;
    expect(mapKeys(o, f)).toEqual({ a: 2, b: 4, c: 6 });

    // Complex value/key/object base function.
    const g = (value, key, object) =>
      value * key.charCodeAt(0) + Object.keys(object).length;
    expect(mapKeys(o, g)).toEqual({ a: 100, b: 199, c: 300 });
  });

  test("mapKeyNames", () => {
    // Simple value based function
    const o = { 1: "a", 2: "b", 3: "c" };
    const f = (x) => 2 * x;
    expect(mapKeyNames(o, f)).toEqual({ 2: "a", 4: "b", 6: "c" });

    // Complex value/key/object base function.
    const g = (key, value, object) =>
      key * value.charCodeAt(0) + Object.keys(object).length;
    expect(mapKeyNames(o, g)).toEqual({ 100: "a", 199: "b", 300: "c" });
  });

  test("resolveAllKeys", async () => {
    const f = async () => 10;
    const g = async () => 20;
    const o = {
      a: f(),
      b: g(),
    };
    expect(await resolveAllKeys(o)).toEqual({ a: 10, b: 20 });
  });

  test("unique", () => {
    const a = [1, 2, 3, 4, 1, 2, 3, 4, 5];
    expect(unique([])).toEqual([]);
    expect(unique(a)).toEqual([1, 2, 3, 4, 5]);
  });

  test("intersection", () => {
    const a = [1, 2, 3, 4, 1, 2, 3, 4];
    const even = [2, 4, 6, 8];
    const odd = [1, 3, 5, 7];
    expect(intersection(a, [])).toEqual([]);
    expect(intersection([], a)).toEqual([]);

    expect(intersection(a, even)).toEqual([2, 4]);
    expect(intersection(even, a)).toEqual([2, 4]);

    expect(intersection(a, odd)).toEqual([1, 3]);
    expect(intersection(odd, a)).toEqual([1, 3]);

    expect(intersection(even, odd)).toEqual([]);
    expect(intersection(odd, even)).toEqual([]);
  });

  test("pick", () => {
    const o = {
      a: 1,
      b: 2,
      c: 3,
      d: 4,
    };

    // No keys, return empty object
    expect(pick(o, [])).toEqual({});
    // Pick specified keys
    expect(pick(o, ["b", "c"])).toEqual({ b: 2, c: 3 });
    // Pick specified keys, ignore keys which don't exist
    expect(pick(o, ["b", "c", "e"])).toEqual({ b: 2, c: 3 });
    // o remains unchanged
    expect(o).toEqual({ a: 1, b: 2, c: 3, d: 4 });
  });

  test("omit", () => {
    const o = {
      a: 1,
      b: 2,
      c: 3,
      d: 4,
    };

    // No keys, return same equal object
    expect(omit(o, [])).toEqual(o);
    // Remove specified keys
    expect(omit(o, ["b", "c"])).toEqual({ a: 1, d: 4 });
    // Remove specified keys, ignore keys which don't exist
    expect(omit(o, ["b", "c", "e"])).toEqual({ a: 1, d: 4 });
    // o remains unchanged
    expect(o).toEqual({ a: 1, b: 2, c: 3, d: 4 });
  });

  test("objMerge", () => {
    const obj1 = {
      a: 1,
      b: 2,
      c: 3,
    };

    const obj2 = {
      b: 10,
      c: 11,
      d: 12,
    };
    const obj3 = {
      c: 20,
      e: 30,
    };
    expect(objMerge([obj1, obj2, obj3])).toEqual({
      a: 1,
      b: 10,
      c: 20,
      d: 12,
      e: 30,
    });
  });

  test("defaultObj", () => {
    expect(defaultObj(["a", "b", "c"], 1)).toEqual({ a: 1, b: 1, c: 1 });
  });

  test("arrayToObject", () => {
    const pets = [
      { name: "a", animal: "cat" },
      { name: "b", animal: "dog" },
      { name: "c", animal: "cat" },
      { name: "d", animal: "dog" },
    ];
    expect(arrayToObject(pets, "name")).toEqual({
      a: { name: "a", animal: "cat" },
      b: { name: "b", animal: "dog" },
      c: { name: "c", animal: "cat" },
      d: { name: "d", animal: "dog" },
    });
    expect(arrayToObject(pets, "name", (pet) => pet.animal)).toEqual({
      a: "cat",
      b: "dog",
      c: "cat",
      d: "dog",
    });
  });

  test("flatten", () => {
    const a = [
      [1, 2, 3],
      [4, 5],
      6,
      [
        [7, 8],
        [9, 10],
      ],
    ];
    expect(flatten([])).toEqual([]);
    expect(flatten([1, 2, 3])).toEqual([1, 2, 3]);
    expect(flatten([[1, 2, 3]])).toEqual([1, 2, 3]);
    expect(flatten(a)).toEqual([1, 2, 3, 4, 5, 6, [7, 8], [9, 10]]);
  });

  test("flatMap", () => {
    expect(flatMap([], (x) => x)).toEqual([]);
    expect(flatMap([1, 2, 3], (x) => x)).toEqual([1, 2, 3]);
    expect(flatMap([[1, 2, 3]], (x) => x)).toEqual([1, 2, 3]);
    expect(
      flatMap(
        [
          [1, 2, 3],
          [4, 5],
          6,
          [
            [7, 8],
            [9, 10],
          ],
        ],
        (x) => x,
      ),
    ).toEqual([1, 2, 3, 4, 5, 6, [7, 8], [9, 10]]);
    expect(flatMap([{ vals: [2, 2] }, { vals: [3] }], (x) => x.vals)).toEqual([
      2, 2, 3,
    ]);
  });

  ["noop", "identity"].forEach((fnName) => {
    test(fnName, () => {
      expect(utils[fnName]()).toEqual(undefined);
      expect(utils[fnName]("hello")).toEqual("hello");
      const input = { bar: "zip" };
      expect(utils[fnName](input)).toEqual(input);
    });
  });

  test("zipObj", () => {
    const obj = { foo: [1, 2, 3], bar: [4, 5, 6] };
    expect(zipObj(obj)).toEqual([
      { foo: 1, bar: 4 },
      { foo: 2, bar: 5 },
      { foo: 3, bar: 6 },
    ]);
  });

  test("mergeWhereClause", () => {
    let args = { a: 1 };

    // Non-objects for where clause, simply return
    expect(mergeWhereClause(args, undefined)).toEqual(args);
    expect(mergeWhereClause(args, true)).toEqual(args);
    expect(mergeWhereClause(args, 10)).toEqual(args);

    let where = {};
    expect(mergeWhereClause(args, where)).toEqual({ a: 1 });

    where = { b: 20 };
    expect(mergeWhereClause(args, where)).toEqual({ a: 1, where: { b: 20 } });

    args = { a: 1, where: { b: 2, c: 3, d: 4 } };
    where = { b: 20, c: 30 };
    expect(mergeWhereClause(args, where)).toEqual({
      a: 1,
      where: {
        AND: [
          { b: 2, c: 3, d: 4 },
          { b: 20, c: 30 },
        ],
      },
    });

    args = { a: 1, where: {} };
    where = { b: 20, c: 30 };
    expect(mergeWhereClause(args, where)).toEqual({
      a: 1,
      where: { b: 20, c: 30 },
    });

    args = { a: 1, where: { b: 20, c: 30 } };
    where = {};
    expect(mergeWhereClause(args, where)).toEqual({
      a: 1,
      where: { b: 20, c: 30 },
    });
  });

  test("mergeWhereClause doesnt clobber arrays", () => {
    const args = { a: 1, where: { b: 2, c: ["1", "2"] } };
    const where = { d: 20, c: ["3", "4"] };
    expect(mergeWhereClause(args, where)).toEqual({
      a: 1,
      where: {
        AND: [
          { b: 2, c: ["1", "2"] },
          { d: 20, c: ["3", "4"] },
        ],
      },
    });
  });

  test("asyncForEach", async () => {
    const callback = jest.fn().mockResolvedValue(1);
    const array = [10, 20, 30];
    await asyncForEach(array, callback);
    expect(callback).toHaveBeenCalledTimes(3);
    expect(callback).toHaveBeenNthCalledWith(1, 10, 0, array);
    expect(callback).toHaveBeenNthCalledWith(2, 20, 1, array);
    expect(callback).toHaveBeenNthCalledWith(3, 30, 2, array);
  });

  describe("captureSuspensePromises", () => {
    test("executes all fns sync when no Promises thrown", () => {
      const funcs = [jest.fn(), jest.fn()];

      try {
        captureSuspensePromises(funcs);
      } catch (e) {}

      expect(funcs[0]).toHaveBeenCalledTimes(1);
      expect(funcs[1]).toHaveBeenCalledTimes(1);
    });

    test("does not throw when no executors throw", () => {
      const funcs = [jest.fn(), jest.fn()];

      try {
        captureSuspensePromises(funcs);
      } catch (e) {
        expect(true).toBeFalsey();
      }

      expect(funcs[0]).toHaveBeenCalledTimes(1);
      expect(funcs[1]).toHaveBeenCalledTimes(1);
    });

    test("executes all fns sync when a Promise is thrown", () => {
      const funcs = [
        jest.fn(),
        jest.fn(() => {
          throw Promise.resolve();
        }),
        jest.fn(),
      ];

      try {
        captureSuspensePromises(funcs);
      } catch (e) {}

      expect(funcs[0]).toHaveBeenCalledTimes(1);
      expect(funcs[1]).toHaveBeenCalledTimes(1);
      expect(funcs[2]).toHaveBeenCalledTimes(1);
    });

    test("throws a Promise when executor throws a Promise", () => {
      const funcs = [
        jest.fn(),
        jest.fn(() => {
          throw Promise.resolve();
        }),
        jest.fn(),
      ];

      try {
        captureSuspensePromises(funcs);
        expect(true).toBeFalsey();
      } catch (maybePromise) {
        expect(isPromise(maybePromise)).toBeTruthy();
      }
    });

    test("thrown Promise resolves all thrown Promises", () => {
      const resolvers = [jest.fn(), jest.fn(), jest.fn()];

      const funcs = [
        jest.fn(() => {
          throw new Promise((resolve) => {
            // Artificially delay this promise's resolution to the next tick
            // which will ensure the microtask (aka: Promise) queue is fully
            // flushed
            process.nextTick(() => {
              resolvers[0]();
              resolve();
            });
          });
        }),
        jest.fn(() => {
          throw Promise.resolve().then(resolvers[1]);
        }),
        jest.fn(() => {
          throw Promise.resolve().then(resolvers[2]);
        }),
      ];

      try {
        captureSuspensePromises(funcs);
      } catch (thrownPromise) {
        return thrownPromise.then(() => {
          expect(resolvers[0]).toHaveBeenCalledTimes(1);
          expect(resolvers[1]).toHaveBeenCalledTimes(1);
          expect(resolvers[2]).toHaveBeenCalledTimes(1);
        });
      }

      expect(true).toBeFalsey();
    });

    test("throws a Error when executor throws a Error", () => {
      const funcs = [
        jest.fn(),
        jest.fn(() => {
          throw new Error();
        }),
        jest.fn(),
      ];

      try {
        captureSuspensePromises(funcs);
        expect(true).toBeFalsey();
      } catch (maybePromise) {
        expect(!isPromise(maybePromise)).toBeTruthy();
      }
    });

    test("acts like .map when no promises thrown", () => {
      const funcs = [jest.fn(() => "foo"), jest.fn(() => "bar")];

      const result = captureSuspensePromises(funcs);

      expect(result).toMatchObject(["foo", "bar"]);
    });
  });
});
