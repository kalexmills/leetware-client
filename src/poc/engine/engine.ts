/**
 * Tickables have their tick() method called on each update of the global clock. Each Tickable is responsible for
 * its own registration with the Clock.
 */
import {Software} from "./software/software";
import {AppClass} from "./software/app_class";
import {Device} from "./software/device";
import {Architecture} from "./software/architecture";
import {Employee} from "./company/employee";
import {Room} from "./company/room";
import {Team} from "./company/team";
import {Workstation} from "./company/workstation";

export interface Tickable {
    tick(time: Clock.Tick): void;
}

/**
 * The global clock which runs the simulation.
 */
export abstract class Clock {
    private static subscribers: Set<Tickable> = new Set<Tickable>([]);
    private static NOW: number = 0;

    public static now(): Clock.Tick { return Clock.NOW; }

    public static tick(): void {
        Clock.NOW++;
        Clock.subscribers.forEach((subscriber) => {
            subscriber.tick(Clock.NOW);
        })
    }

    public static registerTickable(t: Tickable) {
        this.subscribers.add(t);
    }

    public static unregisterTickable(t: Tickable) {
        this.subscribers.delete(t);
    }

    /**
     * Removes all subscribers of this Clock.
     */
    public static jettisonSubscribers() {
        Clock.subscribers.clear();
    }

    /**
     * Resets this clock back to zero.
     */
    public static reset() {
        Clock.NOW = 0;
    }
};

export namespace Clock {
    export type Tick = number;
}

export class EntityManager<Id, T> {
    private entities: Map<Id, T>;

    public nextId(): number { return Managers.nextId++; }
}

export namespace Managers {

    export var nextId: number = 0;

    export const Software: EntityManager<Software.Id, Software> = new EntityManager<Software.Id, Software>();
    export const AppClass: EntityManager<AppClass.Id, AppClass> = new EntityManager<AppClass.Id, AppClass>();
    export const Device: EntityManager<Device.Id, Device> = new EntityManager<Device.Id, Device>();
    export const Architecture: EntityManager<Architecture.Id, Architecture> = new EntityManager<Architecture.Id, Architecture>();
    export const Employee: EntityManager<Employee.Id, Employee> = new EntityManager<Employee.Id, Employee>();
    export const Room: EntityManager<Room.Id, Room> = new EntityManager<Room.Id, Room>();
    export const Team: EntityManager<Team.Id, Team> = new EntityManager<Team.Id, Team>();
    export const Workstation: EntityManager<Workstation.Id, Workstation> = new EntityManager<Workstation.Id, Workstation>();
}