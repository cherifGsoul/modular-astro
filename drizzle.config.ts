import type { Config } from "drizzle-kit";

export default {
    schema: ["./src/modules/skillcatalog/model.ts"],
    out: "./drizzle",
    driver: "better-sqlite",
    dbCredentials: {
        url: "./staffing.db",
    }
} satisfies Config;