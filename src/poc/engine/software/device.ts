import {Architecture} from "./architecture";


export class Device {
    private id: Device.Id;
    private name: string;
    private arch: Architecture;
    private marketShare: number;
}

export namespace Device {
    export type Id = number;
}