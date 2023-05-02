enum Dialect {
  SQLSERVER = "sqlserver",
  POSTGRES = "postgres",
  MYSQL = "mysql",
}

type ComparisonInput<F, M> = FieldClause<F, M> | number;
type EqualityInput<F, M> = ComparisonInput<F, M> | string | null;

type FieldClause<F, M> = ["field", keyof F];
type MacroClause<F, M> = ["macro", keyof M];
type AndOrClause<F, M> = ["and" | "or", Clause<F, M>, ...Clause<F, M>[]];
type NotClause<F, M> = ["not", Clause<F, M>];

type ComparisonClause<F, M> = [
  "<" | ">",
  ComparisonInput<F, M>,
  ComparisonInput<F, M>
];
type EqualityClause<F, M> = [
  "=" | "!=",
  EqualityInput<F, M>,
  EqualityInput<F, M>
];
type InclusionClause<F, M> = [
  "=" | "!=",
  EqualityInput<F, M>,
  EqualityInput<F, M>,
  EqualityInput<F, M>,
  ...EqualityInput<F, M>[]
];
type EmptinessClause<F, M> = ["is-empty" | "not-empty", EqualityInput<F, M>];

type Clause<F, M> =
  | FieldClause<F, M>
  | AndOrClause<F, M>
  | NotClause<F, M>
  | ComparisonClause<F, M>
  | EqualityClause<F, M>
  | InclusionClause<F, M>
  | EmptinessClause<F, M>
  | MacroClause<F, M>;

interface Query<F, M> {
  limit?: number;
  where?: Clause<F, M>;
}

interface Macro<F, M> {
  [index: string]: Clause<F, M>;
}

function multipleArgsValidation<F, M>(
  clauseName: string,
  args: Clause<F, M>[],
  paramLength: number = 1
) {
  if (!args.length) {
    return {
      valid: false,
      msg: `${clauseName} clause requires at least ${paramLength} parameter${
        paramLength > 1 ? "s" : ""
      }`,
    };
  }
  return {
    valid: true,
  };
}

function singleArgValidation<F, M>(clauseName: string, args: Clause<F, M>[]) {
  if (args.length !== 1) {
    return {
      valid: false,
      msg: `${clauseName} clause support only 1 parameter`,
    };
  }
  return {
    valid: true,
  };
}

const VALIDATION_MAP = {
  and: <F, M>(args: Clause<F, M>[]) => multipleArgsValidation("and", args),
  or: <F, M>(args: Clause<F, M>[]) => multipleArgsValidation("or", args),
  not: <F, M>(args: Clause<F, M>[]) => singleArgValidation("not", args),
};

const CLAUSES_MAP = {
  and: <F, M>(args: Clause<F, M>[]) =>
    args.map((w) => whereBuilder(w)).join(" AND "),
  or: <F, M>(args: Clause<F, M>[]) =>
    args.map((w) => whereBuilder(w)).join(" OR "),
  not: <F, M>(args: Clause<F, M>[]) => {
    if (args.length > 1) {
      throw "not clause support only 1 parameter";
    }
    return `NOT ${whereBuilder(args[0])}`;
  },
};

function whereBuilder<F, M>(where: Query<F, M>["where"]) {
  if (!where) return;
  const [operator, ...args] = where;
  if (!Object.keys(CLAUSES_MAP).includes(operator)) {
    throw "Operator not defined";
  }
  const validation = VALIDATION_MAP[operator]?.(args);
  if (!validation.valid) {
    throw validation.msg
  }
  return CLAUSES_MAP[operator]?.(args);
}

export function generateSql<F, M>(
  dialect: Dialect,
  fields: F,
  query: Query<F, M>,
  macros?: M
) {
  return "";
}

generateSql(
  Dialect.MYSQL,
  { 1: "some" },
  { where: ["and", ["=", ["field", 1], "some"], ["macro", "is_joe"]] },
  {
    is_joe: ["not", ["field", 1]],
  }
);
