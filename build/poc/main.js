"use strict";
const $ = require("jquery");
const Umbra = require("../fwk/umbra/main");
const Gui = require("../fwk/gui/main");
const base_1 = require("../generogue/base");
const tickable_stress_test_1 = require("./tickable-stress-test");
const WIDTH = 80;
const HEIGHT = 50;
class MainScene extends Umbra.Scene {
    constructor() {
        super(...arguments);
        this.framesPerSecond = 0;
        this.currentFrameCount = 0;
        this.fpsTimer = 0;
        this.screens = [];
        this.mustClearConsole = false;
    }
    onInit() {
        this.screens.push(this.addChild(new tickable_stress_test_1.TickableStressTest()));
        this.screens[0].show();
    }
    onRender(con) {
        this.currentFrameCount++;
        if (this.mustClearConsole) {
            this.clearConsole(con);
            this.mustClearConsole = false;
        }
        con.print(1, 46, "frame/s : " + this.framesPerSecond + "    ");
    }
    onUpdate(time) {
        this.computeFps(time);
    }
    clearConsole(con) {
        con.clearText();
        con.clearBack(0x000000);
        con.clearFore(0xFFFFFF);
    }
    computeFps(time) {
        if (this.fpsTimer === 0) {
            this.fpsTimer = time;
        }
        if (time - this.fpsTimer > 1000) {
            this.framesPerSecond = this.currentFrameCount;
            this.fpsTimer = time;
            this.currentFrameCount = 0;
        }
    }
}
$(function () {
    Gui.setConfiguration({
        color: {
            background: base_1.MENU_BACKGROUND,
            backgroundActive: base_1.MENU_BACKGROUND_ACTIVE,
            backgroundDisabled: base_1.MENU_BACKGROUND,
            foreground: base_1.MENU_FOREGROUND,
            foregroundActive: base_1.MENU_FOREGROUND_ACTIVE,
            foregroundDisabled: base_1.MENU_FOREGROUND_DISABLED,
            titleForeground: base_1.TITLE_FOREGROUND,
        },
        input: {
            cancelAxisName: "cancel",
            focusNextWidgetAxisName: "next",
            focusPreviousWidgetAxisName: "prev",
            validateAxisName: "validate",
        },
    });
    Umbra.init(new Umbra.Application()).run(new MainScene(), {
        backgroundAnimation: true,
        consoleHeight: HEIGHT,
        consoleWidth: WIDTH,
    });
});
//# sourceMappingURL=main.js.map