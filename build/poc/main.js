define(["require", "exports", "jquery", "../fwk/umbra/main", "../fwk/gui/main", "./poc-screen", "../generogue/base"], function (require, exports, $, Umbra, Gui, poc_screen_1, base_1) {
    "use strict";
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
            this.screens.push(this.addChild(new poc_screen_1.PocScreen()));
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
});
//# sourceMappingURL=main.js.map