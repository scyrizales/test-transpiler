export const joinByOperatorHandler =
  (logicOperator, argumentMapper, shouldConsiderDepth) =>
  (args, fields, macros, depth) => {
    if (shouldConsiderDepth && depth > 1) {
      return `(${args
        .map((w) => argumentMapper(w, fields, macros, depth))
        .join(` ${logicOperator} `)})`;
    }
    return args
      .map((w) => argumentMapper(w, fields, macros, depth))
      .join(` ${logicOperator} `);
  };

export const nullsHandler =
  (isNull, argumentMapper) => (args, fields, macros, depth) => {
    const [value] = args;
    return `${argumentMapper(value, fields, macros, depth)} ${
      isNull ? "IS NULL" : "IS NOT NULL"
    }`;
  };

export const negationHandler =
  (argumentMapper) => (args, fields, macros, depth) =>
    `NOT (${argumentMapper(args[0], fields, macros, depth)})`;

export const equalityHandler =
  (isEqual, argumentMapper) => (args, fields, macros, depth) => {
    const filteredArgs = args.filter((a) => a !== null);
    const originalLength = args.length;
    if (originalLength === filteredArgs.length) {
      if (originalLength > 2) {
        const [value, ...intoList] = args;
        return `${argumentMapper(value, fields, macros, depth)} IN (${intoList
          .map((w) => argumentMapper(w, fields, macros, depth))
          .join(", ")})`;
      } else {
        return joinByOperatorHandler(
          `${isEqual ? "=" : "<>"}`,
          argumentMapper,
          false
        )(args, fields, macros, depth);
      }
    } else {
      const [value, ...intoList] = filteredArgs;
      if (originalLength > 2) {
        return argumentMapper(
          [
            "or",
            [isEqual ? "is-empty" : "not-empty", value],
            [isEqual ? "=" : "!=", value, ...intoList],
          ],
          fields,
          macros,
          depth
        );
      } else {
        return argumentMapper(
          [isEqual ? "is-empty" : "not-empty", value],
          fields,
          macros,
          depth
        );
      }
    }
  };
