import { eq, sql } from 'drizzle-orm';
import db from '../../config/db';
import { skills, type NewSkill, type GetSkill } from './model'

export const createSkill =async (skill: NewSkill): Promise<void> => {
    await db
            .insert(skills)
            .values(skill)
            .run();
}

export const skillForId = async (id: string): Promise<GetSkill | undefined> => {
    const stmt = await db
                        .select()
                        .from(skills)
                        .where(eq(skills.id, sql.placeholder('id')))
                        .prepare()
    return stmt.get({ id });
}

export const updateSkill = async (skill: NewSkill): Promise<void> => {
    await db.update(skills).set({name: skill.name}).where(eq(skills.id, skill.id))
}

export const deleteSkill = async (id: string): Promise<void> => {
    await db.delete(skills).where(eq(skills.id, id));
}

