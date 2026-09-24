const { Pool } = require("pg");
const p = new Pool({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 20000 });
p.query("select table_name from information_schema.tables where table_schema='public' order by table_name")
  .then((r) => { console.log("TABLES: " + r.rows.map((x) => x.table_name).join(", ")); return p.end(); })
  .catch((e) => { console.error("FAIL " + e.message); process.exit(1); });