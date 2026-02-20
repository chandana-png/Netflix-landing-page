import mysql from "mysql2/promise";

import fs from "fs";

// read CA certificate from either a direct env var or a path to a file
function getSslOption() {
  if (process.env.MYSQL_CA_CERT_PATH) {
    return { ca: fs.readFileSync(process.env.MYSQL_CA_CERT_PATH) };
  }
  if (process.env.MYSQL_CA_CERT) {
    // dotenv doesn’t preserve literal newlines, so you may need to
    // encode them as "\n" when setting the variable.
    return { ca: process.env.MYSQL_CA_CERT };
  }
  // in development you might not care about verification;
  // don’t use this in production!
  return { rejectUnauthorized: false };
}

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT || 3306),
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  ssl: getSslOption()
});

export default pool;

