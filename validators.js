function plural(name, length) {
  return `${name}${length > 1 ? "s" : ""}`;
}

function isType(type, arg, fields) {
  if (type === "field" && arg && arg.length) {
    return (
      arg.length === 2 &&
      arg[0] === "field" &&
      isType("number", arg[1]) &&
      fields &&
      fields.hasOwnProperty(arg[1])
    );
  }
  if (type === "null") {
    return arg === null;
  }
  return typeof arg === type;
}

function matchTypes(types, arg, fields) {
  return types.some((type) => isType(type, arg, fields));
}

export function whereValidator(clauses, where, fields, macros, errors = []) {
  const [operator, ...args] = where;
  if (!Object.keys(clauses).includes(operator)) {
    errors.push(`Operator "${operator}" not defined`);
    return errors;
  }
  const { minimunParams, exactParams, allowedTypes } =
    clauses[operator].validationRules || {};
  if (minimunParams && args.length < minimunParams) {
    errors.push(
      `Clause "${operator}" requires at least ${minimunParams} ${plural(
        "parameter",
        minimunParams
      )}`
    );
  }
  if (exactParams && args.length !== exactParams) {
    errors.push(
      `Clause "${operator}" requires exactly ${exactParams} ${plural(
        "parameter",
        exactParams
      )}`
    );
  }
  if (allowedTypes) {
    if (!args.every((arg) => matchTypes(allowedTypes, arg, fields))) {
      errors.push(
        `Not all the parameters passed are valid for clause: "${operator}"`
      );
    }
    if (operator === "macro" && !macros.hasOwnProperty(args[0])) {
      errors.push(
        `Macro ${args[0]} does not exist in macros object`
      );
    }
  } else {
    for (const arg of args) {
      if (Array.isArray(arg)) {
        whereValidator(clauses, arg, fields, macros, errors);
      }
    }
  }
  return errors;
}
