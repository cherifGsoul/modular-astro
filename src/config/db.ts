import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { skills } from "../modules/skillcatalog";

const sqlite = new Database("./staffing.db");
const db = drizzle(sqlite, {
    schema: {skills}
});

export default db;