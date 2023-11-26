import { NonEmptyString, Period, UUID } from "../../modules/shared/index.js"
import { type ProjectDto, projectDtoFromModel } from "./dto.js";
import { Confidence, type Project } from "./model.js";

export const addProject =
  (
    saveProject: Project.SaveProject // dependency
  ): Project.AddProject =>
  async (
    unvalidatedProject: Project.UnvalidatedProject
  ): Promise<Project.ProjectWasAdded> => {
    const project: Project.t = {
      id: UUID.generate(),
      name: NonEmptyString.fromString(unvalidatedProject.name),
      description: unvalidatedProject.description,
      roles: [],
    };
    await saveProject(project);
    return project;
  };

export const getProject =
  (
    projectForId: Project.ProjectForId // dependency
  ): ((id: string) => Promise<ProjectDto>) =>
  async (id: string): Promise<ProjectDto> => {
    try {
      const project = await projectForId(UUID.fromString(id));
      return projectDtoFromModel(project);
    } catch (error) {
      throw error;
    }
  };

export const addProjectRole =
  (
    projectForId: Project.ProjectForId, // dependency
    saveProject: Project.SaveProject, // dependency
    getSkill: Project.GetSkill // dependency
  ): Project.AddProjectRole =>
  async (
    unvalidatedRole: Project.UnvalidatedRole
  ): Promise<Project.RoleWasAddedToProject> => {
    const project = await projectForId(
      UUID.fromString(unvalidatedRole.project)
    );
    const skills = await Promise.all(
      unvalidatedRole.skills.map(async (s: string) => {
        return await getSkill(NonEmptyString.fromString(s));
      })
    );
    const role: Project.Role = {
      id: UUID.generate(),
      name: NonEmptyString.fromString(unvalidatedRole.name),
      period: Period.between(
        unvalidatedRole.period.startDate,
        unvalidatedRole.period.endDate
      ),
      skills,
      confidence: Confidence.between(
        unvalidatedRole.confidence.start,
        unvalidatedRole.confidence.end
      ),
      assignments: [],
    };
    project.roles.push(role);
    await saveProject(project);
    return {
      project: project.id,
      role: role,
    };
  };

export const assignMemberToRole =
  (
    projectForId: Project.ProjectForId, // dependency
    saveProject: Project.SaveProject, // dependency
    getAssignee: Project.GetAssignee // dependency
  ): Project.AssignMemberToRole =>
  async (
    unvalidatedAssignment: Project.UnvalidatedAssignment
  ): Promise<Project.MemberWasAssignedToRole> => {
    const project = await projectForId(
      UUID.fromString(unvalidatedAssignment.project)
    );
    const assignee = await getAssignee(unvalidatedAssignment.assignee);
    const role = project.roles.find(
      (role: Project.Role) => role.id === unvalidatedAssignment.role
    );
    if (!role) {
      throw new Error("Can not assign a member to non-existing role");
    }
    const idx = project.roles.findIndex((r: Project.Role) => r.id === role.id);
    const assignment: Project.Assignment = {
      id: UUID.generate(),
      assignee,
      period: Period.between(
        unvalidatedAssignment.period.startDate,
        unvalidatedAssignment.period.endDate
      ),
    };

    role.assignments.push(assignment);
    project.roles[idx] = role;
    await saveProject(project);
    return {
      project: project.id,
      assignee,
      role,
    };
  };
