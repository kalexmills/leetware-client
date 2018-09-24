
export type Skill = Skills.Code | Skills.Design | Skills.Art | Skills.Base;

export namespace Skills {
    export type Code = "Code_TwoD" | "Code_ThreeD" | "Code_Algorithm" | "Code_Audio" |"Code_Networking" | "Code_System" |"Code_Web";
    export type Design = "Design_TwoD" | "Design_ThreeD" | "Design_Algorithm" | "Design_Audio" |"Design_Networking" | "Design_System" |"Design_Web";
    export type Art  = "Art_TwoD" | "Art_ThreeD" | "Art_Audio";
    export type Base = "Base_Code" | "Base_Design" | "Base_Art" | "Base_Lead" | "Base_Market";

    export function baseFor(skill: Skill): Skill {
        if(skill.startsWith("Code")) {
            return "Base_Code";
        }
        if (skill.startsWith("Design")) {
            return "Base_Design";
        }
        if (skill.startsWith("Art")) {
            return "Base_Art";
        }
        return skill;
    }

    export const CODE: string[] = ["Code_TwoD", "Code_ThreeD", "Code_Algorithm", "Code_Audio","Code_Networking", "Code_System", "Code_Web"];
    export const DESIGN: string[] = ["Design_TwoD", "Design_ThreeD", "Design_Algorithm", "Design_Audio","Design_Networking", "Design_System", "Design_Web"];
    export const ART: string[] = ["Art_TwoD", "Art_ThreeD", "Art_Audio"];
    export const BASE: string[] = ["Base_Code", "Base_Design", "Base_Art", "Base_Lead", "Base_Market"];
    export const ALL: string[] = [...CODE, ...DESIGN, ...ART, ...BASE];
}