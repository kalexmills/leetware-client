define(["require", "exports", "../fwk/umbra/main", "../fwk/gui/main"], function (require, exports, Umbra, Gui) {
    "use strict";
    class PocScreen extends Umbra.Node {
        onInit() {
            this.popup = this.addChild(new Popup());
            this.popup.show();
        }
    }
    exports.PocScreen = PocScreen;
    class Popup extends Gui.Widget {
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
        onPressOk(_data) {
            return true;
        }
        onCancel() {
            return true;
        }
    }
});
//# sourceMappingURL=poc-screen.js.map