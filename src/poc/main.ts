import * as $ from "jquery";
import * as Umbra from "../fwk/umbra/main";
import * as Yendor from "../fwk/yendor/main";
import * as Gui from "../fwk/gui/main";
import {
    PocScreen
} from "./poc-screen";
import {
    MENU_BACKGROUND,
    MENU_BACKGROUND_ACTIVE,
    MENU_FOREGROUND,
    MENU_FOREGROUND_ACTIVE,
    MENU_FOREGROUND_DISABLED, TITLE_FOREGROUND
} from "../generogue/base";

const WIDTH: number = 80;
const HEIGHT: number = 50;

class MainScene extends Umbra.Scene {
    private framesPerSecond: number = 0;
    private currentFrameCount: number = 0;
    private fpsTimer: number = 0;
    private screens: Umbra.Node[] = [];
    private mustClearConsole: boolean = false;

    public onInit() {
        this.screens.push(this.addChild(new PocScreen()));
        this.screens[0].show();
    }

    public onRender(con: Yendor.Console) {
        this.currentFrameCount ++;
        if (this.mustClearConsole) {
            this.clearConsole(con);
            this.mustClearConsole = false;
        }
        con.print(1, 46, "frame/s : " + this.framesPerSecond + "    ");
    }

    public onUpdate(time: number) {
        this.computeFps(time);
    }

    private clearConsole(con: Yendor.Console) {
        con.clearText();
        con.clearBack(0x000000);
        con.clearFore(0xFFFFFF);
    }

    private computeFps(time: number) {
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

$(function() {
    Gui.setConfiguration(
        {
            color: {
                background: MENU_BACKGROUND,
                backgroundActive: MENU_BACKGROUND_ACTIVE,
                backgroundDisabled: MENU_BACKGROUND,
                foreground: MENU_FOREGROUND,
                foregroundActive: MENU_FOREGROUND_ACTIVE,
                foregroundDisabled: MENU_FOREGROUND_DISABLED,
                titleForeground: TITLE_FOREGROUND,
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
