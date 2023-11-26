import type { Project } from "../../../src/modules/projectmanagement/index.js";
import { UUID } from "../../../src/modules/shared/index.js";

let projects: Project.t[] = []

export const projectForId: Project.ProjectForId = async (id: UUID.t): Promise<Project.t> => {
    const found = projects.find((p: Project.t)=> p.id === id)
    if (!found) {
        throw new Error('project can not be found')
    }
    return found;
}

export const saveProject = async (project: Project.t): Promise<void> => {
    projects.push(project)
}

export const clearProjects = async (): Promise<void> => {
    projects = []
}