import * as Umbra from "../fwk/umbra/main";
import {Employee} from "./engine/employee";
import {Clock} from "./engine/engine";

export class TickableStressTest extends Umbra.Node {
    private emps: Employee[];
    private sinceLastUpdate: number = 0;
    private ticksPerSecond: number = 60;

    onInit() {
        this.emps = [];
        // The game needs to be able to support 100k Employees sitting around and doing nothing while providing a high framerate.
        for (let i = 0; i < 100000; i++) {
            this.emps.concat(new Employee(Clock.now()));
            if (i % 100 == 0) console.log(i);
        }
        console.log("OnInit done!");
    }

    onUpdate(time: number) {
        console.log("Update:", time);
        console.log(this.sinceLastUpdate);
        this.sinceLastUpdate += time;
        if (time > 1000 / this.ticksPerSecond) {
            Clock.tick();
        }
    }
}