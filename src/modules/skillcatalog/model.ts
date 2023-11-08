import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const skills = sqliteTable("skills", {
    id: text("id").primaryKey(),
    name: text("name").unique().notNull()
});

export const insertSkillSchema = createInsertSchema(skills, {
    id: (schema) => schema.id.uuid(),
    name: (schema) => schema.name.min(3, "Skill name must contain at least 3 character(s) ")
});

export const requestSchema = insertSkillSchema.pick({ name: true });

export type NewSkill = typeof skills.$inferInsert
export type GetSkill = typeof skills.$inferSelect