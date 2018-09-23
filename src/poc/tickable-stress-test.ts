import * as Umbra from "../fwk/umbra/main";
import {Employee} from "./engine/employee";
import {Clock} from "./engine/engine";

export class TickableStressTest extends Umbra.Node {
    private emps: Employee[];
    private sinceLastUpdate: number = 0;
    private ticksPerSecond: number = 60;

    onInit() {
        console.log("OnInit start!");
        this.emps = new Array(1000000);
        // The game needs to be able to support 100k Employees sitting around and doing nothing while providing a high framerate.
        for (let i = 0; i < 1000000; i++) {
            this.emps[i] = new Employee(Clock.now());
        }
        console.log("OnInit done!");
    }

    onUpdate(sinceLastMillis: number) {
        console.log("Update:", sinceLastMillis);
        console.log(this.sinceLastUpdate);
        this.sinceLastUpdate += sinceLastMillis;
        if (this.sinceLastUpdate > 1000 / this.ticksPerSecond) {
            Clock.tick();
            this.sinceLastUpdate = 0;
        }
    }
}