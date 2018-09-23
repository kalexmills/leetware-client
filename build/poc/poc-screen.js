"use strict";
const Umbra = require("../fwk/umbra/main");
const Gui = require("../fwk/gui/main");
class PocScreen extends Umbra.Node {
    onInit() {
        this.popup = this.addChild(new Popup());
        this.popup.show();
    }
}
exports.PocScreen = PocScreen;
class Popup extends Gui.Widget {
    constructor() {
        super();
        this.setModal();
    }
    onInit() {
        super.onInit();
        let popup = this.addChild(new Gui.Popup({ cancelAction: this.onCancel.bind(this) }));
        this.frame = popup.addChild(new Gui.Frame({}));
        let vpanel = this.frame.addChild(new Gui.VPanel({}));
        vpanel.addChild(new Gui.Label({ label: "Press OK to cancel" }));
        vpanel.addChild(new Gui.Button({
            autoHideWidget: this,
            callback: this.onPressOk.bind(this),
            label: "OK",
            textAlign: Gui.TextAlignEnum.CENTER,
        }));
        this.hide();
    }
    onRender(_destination) {
        this.center();
    }
    onUpdate(time) {
        super.onUpdate(time);
    }
    onPressOk(_data) {
        return true;
    }
    onCancel() {
        return true;
    }
}
//# sourceMappingURL=poc-screen.js.map