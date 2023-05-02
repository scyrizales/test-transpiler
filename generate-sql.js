import { limitHandler } from "./limit-handlers.js";
import {
  
  whereValidator,
} from "./validators.js";
import {
  equalityHandler,
  joinByOperatorHandler,
  negationHandler,
  nullsHandler,
} from "./where-handlers.js";

export const Dialect = {
  SQLSERVER: "sqlserver",
  POSTGRES: "postgres",
  MYSQL: "mysql",
};

const CLAUSES_MAP = {
  and: {
    handler: joinByOperatorHandler("AND", whereBuilder, true),
    validationRules: { minimunParams: 1 },
  },
  or: {
    handler: joinByOperatorHandler("OR", whereBuilder, true),
    validationRules: { minimunParams: 1 },
  },
  not: {
    handler: negationHandler(whereBuilder),
    validationRules: { exactParams: 1 },
  },
  "is-empty": {
    handler: nullsHandler(true, whereBuilder),
    validationRules: {
      exactParams: 1,
      allowedTypes: ["field", "number", "string", "null"],
    },
  },
  "not-empty": {
    handler: nullsHandler(false, whereBuilder),
    validationRules: {
      exactParams: 1,
      allowedTypes: ["field", "number", "string", "null"],
    },
  },
  "=": {
    handler: equalityHandler(true, whereBuilder),
    validationRules: { minimunParams: 2, allowedTypes: ["field", "number", "string", "null"] },
  },
  "!=": {
    handler: equalityHandler(false, whereBuilder),
    validationRules: { minimunParams: 2, allowedTypes: ["field", "number", "string", "null"] },
  },
  ">": {
    handler: joinByOperatorHandler(">", whereBuilder, false),
    validationRules: {
      exactParams: 2,
      allowedTypes: ["field", "number"],
    },
  },
  "<": {
    handler: joinByOperatorHandler("<", whereBuilder, false),
    validationRules: {
      exactParams: 2,
      allowedTypes: ["field", "number"],
    },
  },
  field: {
    handler: (args, fields, macros, depth) => `${fields[args[0]]}`,
  },
  macro: {
    handler: (args, fields, macros, depth) => `${fields[args[0]]}`,
  },
};

function whereBuilder(where, fields, macros, depth = 0) {
  if (!where) return;
  if (Array.isArray(where)) {
    const [operator, ...args] = where;
    const errors = whereValidator(CLAUSES_MAP, where, fields, macros);
    if (errors.length) {
      throw new Error(errors.join("\n"));
    }
    return CLAUSES_MAP[operator]?.handler(args, fields, macros, ++depth);
  }
  if (typeof where === "string") {
    return `'${where}'`;
  }
  if (typeof where === "number") {
    return `${where}`;
  }
}

export function generateSql(dialect, fields, query, macros = {}) {
  let response = ["SELECT * FROM DATA"];
  if (query?.where) {
    response.push(`WHERE ${whereBuilder(query.where, fields, macros)}`);
  }
  const queryString = response.join(" ");
  if (query?.limit) {
    return limitHandler(dialect, queryString, query.limit)
  }
  return queryString;
}
