const LIMIT_MAP = {
  sqlserver: (queryString, limit) =>
    `SELECT TOP ${limit} ${queryString.split("SELECT ").pop()}`,
  postgres: (queryString, limit) => `${queryString} LIMIT ${limit}`,
  mysql: (queryString, limit) => `${queryString} LIMIT ${limit}`,
};
export function limitHandler(dialect, queryString, limit) {
  return LIMIT_MAP[dialect](queryString, limit);
}
