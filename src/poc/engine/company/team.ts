import {Employee} from "../employee";
import Task = Team.Task;

export class Team {
    private id: Team.Id;
    private members: Employee[];
    private leader: Employee;
    private tasks: Task[]
}

export namespace Team {
    export const None: Team = null;

    export type Id = number;
}

