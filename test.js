import { generateSql } from "./generate-sql.js";

const fields = {
  1: "id",
  2: "name",
  3: "date_joined",
  4: "age",
};

// console.log(
//   generateSql("postgres", fields, { where: ["=", ["field", 4], null] })
// );

  console.log(generateSql("postgres", fields, {"where": ["=", ["field", 3], null]}))
  console.log("SELECT * FROM data WHERE date_joined IS NULL")
  console.log("")
  // -> "SELECT * FROM data WHERE date_joined IS NULL"

  console.log(generateSql( "postgres", fields, {"where": [">", ["field", 4], 35]}))
  console.log("SELECT * FROM data WHERE age > 35")
  console.log("")
  // -> "SELECT * FROM data WHERE age > 35"

  console.log(generateSql( "postgres", fields, {"where": ["and", ["<", ["field", 1], 5], ["=", ["field", 2], "joe"]]}))
  console.log("SELECT * FROM data WHERE id < 5 AND name='joe'")
  console.log("")
  // -> "SELECT * FROM data WHERE id < 5 AND name='joe'"

  console.log(generateSql( "postgres", fields, {"where": ["or", ["!=", ["field", 3], "2015-11-01"], ["=", ["field", 1], 456]]}))
  console.log("SELECT * FROM data WHERE date_joined <> '2015-11-01' OR id = 456")
  console.log("")
  // -> "SELECT * FROM data WHERE date_joined <> '2015-11-01' OR id = 456"

  console.log(generateSql( "postgres", fields, {"where": ["and", ["!=", ["field", 3], null], ["or", [">", ["field", 4], 25], ["=", ["field", 2], "Jerry"]]]}))
  console.log("SELECT * FROM data WHERE date_joined IS NOT NULL AND (age > 25 OR name = 'Jerry')")
  console.log("")
  // -> "SELECT * FROM data WHERE date_joined IS NOT NULL AND (age > 25 OR name = 'Jerry')"

  console.log(generateSql( "postgres", fields, {"where": ["and", ["!=", ["field", 3], "04/01/2023", "05/01/2023", null]]}))
  console.log("SELECT * FROM data WHERE date_joined IS NOT NULL")
  console.log("")
  // -> "SELECT * FROM data WHERE date_joined IS NOT NULL AND (age > 25 OR name = 'Jerry')"

  console.log(generateSql( "postgres", fields, {"where": ["=", ["field", 4], 25, 26, 27]}))
  console.log("SELECT * FROM data WHERE age IN (25, 26, 27)")
  console.log("")
  // -> "SELECT * FROM data WHERE date_joined IN (25, 26, 27)"

  console.log(generateSql( "postgres", fields, {"where": ["=", ["field", 2], "cam"]}))
  console.log("SELECT * FROM data WHERE name = 'cam';")
  console.log("")
  // -> "SELECT * FROM data WHERE name = 'cam';"

  console.log(generateSql( "mysql", fields, {"where": ["=", ["field", 2], "cam"], "limit": 10}))
  console.log("SELECT * FROM data WHERE name = 'cam' LIMIT 10;")
  console.log("")
  // -> "SELECT * FROM data WHERE name = 'cam' LIMIT 10;"

  console.log(generateSql( "postgres", fields, {"limit": 20}))
  console.log("SELECT * FROM data LIMIT 20;")
  console.log("")
  // -> "SELECT * FROM data LIMIT 20;"

  console.log(generateSql( "sqlserver", fields, {"limit": 20}))
  console.log("SELECT TOP 20 * FROM data;")
  console.log("")
  // -> "SELECT TOP 20 * FROM data;"
