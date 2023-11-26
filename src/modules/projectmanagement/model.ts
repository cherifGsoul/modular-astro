import { NonEmptyString, Period, PositiveNumber, UUID, type UseCase } from "../shared/index.js";

export namespace Confidence {
    export type t = {
        start: PositiveNumber.t
        end: PositiveNumber.t
    }
    export const between = (start: number, end: number) => {
        if (start > 1 || end > 1) throw new Error('Confidence should not be greater than 1')
        return {
            start: PositiveNumber.fromNumber(start),
            end: PositiveNumber.fromNumber(end)
        }
    }
}

export namespace Project {
    export type t = {
        id: UUID.t
        name: NonEmptyString.t
        roles: Role[]
        description?: string
    }

    export type Role = {
        id: UUID.t
        skills: Skill[]
        name: NonEmptyString.t
        period: Period.t
        confidence: Confidence.t,
        assignments: Assignment[]
    }

    export type Skill = NonEmptyString.t

    export type Assignment = {
        id: UUID.t
        assignee: NonEmptyString.t
        period: Period.t
    }

    export type Assignee = NonEmptyString.t

    export type AddProject = UseCase<UnvalidatedProject, ProjectWasAdded>
    export type AddProjectRole = UseCase<UnvalidatedRole, RoleWasAddedToProject>
    export type AssignMemberToRole = UseCase<UnvalidatedAssignment, MemberWasAssignedToRole>

    export type UnvalidatedProject = {
        name: string
        description?: string
    }

    export type ProjectWasAdded = Project.t

    export interface GetAssignee {
        (member: string): Promise<Assignee>
    }

    export interface GetProject {
        (project: string): Promise<Project.t>
    }

    export type UnvalidatedPeriod = {
        startDate: string | Date
        endDate: string | Date
    }
    export type UnvalidatedAssignment = {
        project: string
        assignee: string
        role: string
        period: UnvalidatedPeriod

    }

    export type UnvalidatedConfidence = {
        start: number
        end: number
    }

    export type UnvalidatedRole = {
        skills: string[]
        name: string
        period: UnvalidatedPeriod
        confidence: UnvalidatedConfidence
        project: string
    }

    export type RoleWasAddedToProject = {
        project: UUID.t
        role: Role
    }

    export interface GetSkill {
        (skill: string): Promise<Skill>
    }

    export type MemberWasAssignedToRole = {
        project: UUID.t
        assignee: UUID.t
        role: Role
    }

    export interface SaveProject {
        (project: t): Promise<void>
    }

    export interface ProjectForId {
        (id: UUID.t): Promise<t>
    }

}