// Local embedded Postgres for development previews (not used in production).
// Usage: node scripts/local-pg.mjs  →  postgres on 127.0.0.1:5432, db "zemabet"
import EmbeddedPostgres from "embedded-postgres";

const pg = new EmbeddedPostgres({
  databaseDir: "./.pgdata",
  user: "postgres",
  password: "postgres",
  port: 5432,
  persistent: true,
});

await pg.initialise();
await pg.start();
try {
  await pg.createDatabase("zemabet");
} catch {
  /* already exists */
}
console.log("LOCAL_PG_READY");
setInterval(() => {}, 1 << 30);
