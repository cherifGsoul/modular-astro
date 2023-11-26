import { type Project } from '../../../src/modules/projectmanagement/index.js'

let skills: Project.Skill[] = []

export const getSkill: Project.GetSkill = async (skill: string): Promise<Project.Skill> => {
    const found = skills.find((s: Project.Skill) => s === skill)
    if (!found) {
        throw new Error('skill can not be found')
    }
    return found;
}

export const addSkill = async (s: Project.Skill): Promise<void> => {skills.push(s)};

export const clearSkills = async (): Promise<void> => {
    skills = [];
}
