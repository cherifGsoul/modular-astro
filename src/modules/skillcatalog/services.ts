import db from '../../config/db';
import { skills, type NewSkill } from './model'

export const createSkill =async (skill: NewSkill): Promise<void> => {
    await db
            .insert(skills)
            .values(skill)
            .run();
}