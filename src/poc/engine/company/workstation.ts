
import Chair = Workstation.Chair;
import {Device} from "../software/device";
import {Room} from "./room";
import {Employee} from "../employee";


export class Workstation {
    private id: Workstation.Id;
    private devices: Device[];
    private chair: Chair;
    private room: Room;
    private assignedTo: Employee;
}

export namespace Workstation {
    export type Id = number;

    export class Chair {
        private name: string;
        private comfort: number;
    }
}