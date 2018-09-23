/**
 * Tickables have their tick() method called on each update of the global clock. Each Tickable is responsible for
 * its own registration with the Clock.
 */
export interface Tickable {
    tick(time: number): void;
}

/**
 * The global clock which runs the simulation.
 */
export abstract class Clock {
    private static subscribers: Set<Tickable> = new Set<Tickable>([]);
    private static NOW: number = 0;

    public static now() { return Clock.NOW; }

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
};