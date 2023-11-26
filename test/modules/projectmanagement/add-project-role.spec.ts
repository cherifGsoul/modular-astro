import { test } from 'tap'
import type { Project } from '../../../src/modules/projectmanagement/index.js'
import dayjs from "dayjs"
import * as projectManagement from '../../../src/modules/projectmanagement/index.js'
import * as fakeProjects from "./fake-projects.ts"
import * as fakeSkills from "./fake-skills.ts"
import { NonEmptyString } from "../../../src/modules/shared/index.ts"
import { v4 } from "uuid"

test('add project role', t => {
    let addRole: Project.AddProjectRole
    let addProject: Project.AddProject
    let getProject: (id: string) => Promise<projectManagement.DTO.ProjectDto>
    t.before(async () => {
        addRole = projectManagement.addProjectRole(fakeProjects.projectForId, fakeProjects.saveProject, fakeSkills.getSkill)
        addProject = projectManagement.addProject(fakeProjects.saveProject);
        getProject = projectManagement.getProject(fakeProjects.projectForId)

    });
    t.afterEach(async() => {
        await fakeProjects.clearProjects()
        await fakeSkills.clearSkills()
    })
    t.test('should throw if start date after end date', async (t) => {
        const today = dayjs();
        const unvalidatedProject: Project.UnvalidatedProject = {
            name: "a project name"
        };

        const projectWasAdded = await addProject(unvalidatedProject);
        const unvalidatedRole: Project.UnvalidatedRole = {
            skills: [],
            name: "some role name",
            period: {
                startDate: today.add(7, 'day').toDate(),
                endDate: today.subtract(7, 'day').toDate()
            },
            confidence: {
               start: 0,
                end: 0
            },
            project: String(projectWasAdded.id)
        }
        
        t.rejects(async () => await addRole(unvalidatedRole))

        t.end()
    });

    t.test('should add project role with valid data', async () => {
        const today = dayjs();
        const unvalidatedProject: Project.UnvalidatedProject = {
            name: "a project name"
        };
        const skill: Project.Skill = NonEmptyString.fromString(v4());
        await fakeSkills.addSkill(skill)
        const projectWasAdded = await addProject(unvalidatedProject);
        const unvalidatedRole: Project.UnvalidatedRole = {
            skills: [String(skill)],
            name: "some role name",
            period: {
                startDate: today.subtract(7, 'day').toDate(),
                endDate: today.add(20, 'day').toDate()
            },
            confidence: {
                start: 1,
                end: 1
            },
            project: String(projectWasAdded.id)
        }
        const projectRoleWasAdded = await addRole(unvalidatedRole);
        const persistedProject  = await getProject(projectWasAdded.id);
        const roleIsInProject = persistedProject.roles.some(r => {
            return r.id === projectRoleWasAdded.role.id
        });
        t.equal(projectRoleWasAdded.project, persistedProject.id)
        t.ok(roleIsInProject)
    });

    t.end()
})