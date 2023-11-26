import type { Project } from "./model.js";
import dayjs from "dayjs";

export type ProjectDto = {
  id: string;
  name: string;
  roles: RoleDto[];
  description?: string;
};

export const projectDtoFromModel = (project: Project.t): ProjectDto => ({
  id: String(project.id),
  name: String(project.name),
  roles: project.roles.map((r: Project.Role) => {
    return {
      id: String(r.id),
      skills: r.skills.map((s) => String(s)),
      name: String(r.name),
      period: {
        startDate: dayjs(r.period.startDate).format("YYYY-MM-DD"),
        endDate: dayjs(r.period.endDate).format("YYYY-MM-DD"),
      },
      confidence: {
        start: r.confidence.start,
        end: r.confidence.end,
      },
      assignments: r.assignments.map((a) => ({
        id: a.id,
        assignee: a.assignee,
        period: {
          startDate: dayjs(r.period.startDate).format("YYYY-MM-DD"),
          endDate: dayjs(r.period.endDate).format("YYYY-MM-DD"),
        },
      })),
    };
  }),
});

export type RoleDto = {
  id: string;
  skills: string[];
  name: string;
  period: {
    startDate: string | Date;
    endDate: string | Date;
  };
  confidence: {
    start: number;
    end: number;
  };
  assignments: AssignmentDto[];
};

export type AssignmentDto = {
  id: string;
  assignee: String;
  period: {
    startDate: string | Date;
    endDate: string | Date;
  };
};
