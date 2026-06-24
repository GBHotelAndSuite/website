import { createClient } from "@libsql/client";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, "data", "hotel.db");

const client = createClient({ url: `file:${dbPath}` });
const rs = await client.execute("SELECT id, email, name FROM admin_users");
console.log("admin_users:", JSON.stringify(rs.rows, null, 2));

const tables = await client.execute("SELECT name FROM sqlite_master WHERE type='table'");
console.log("tables:", tables.rows.map(r => r.name));
