import {Employee} from "./employee";
import {avg, dot} from "./util";
import {Skill} from "./skills";

export class Team {
    private employees: Employee[];
    private minSkill: number;

    public idealSkill(skill: Skill): number {
        return avg(this.employees.filter((emp) => emp.skills[skill] > this.minSkill)
                                 .map((emp) => emp.skills[skill]));
    }

    public actualSkill(skill: Skill) {
        return dot(this.employees.map((emp) => emp.effectiveness),
                   this.employees.map((emp) => emp.skills[skill])) / this.employees.length;
    }
}