import {Workstation} from "./workstation";
import {Team} from "../team";


export class Room {
    private id: Room.Id;
    private light: number;
    private temperature: number;
    private noise: number;
    private cleanliness: number;
    private assignedTeam: Team;
    private workstations: Workstation[];
    private adjacentRooms: Room;
}

export namespace Room {
    export type Id = number;
}

