import * as Umbra from "../fwk/umbra/main";
import * as Gui from "../fwk/gui/main";
import * as Yendor from "../fwk/yendor/main";

export class PocScreen extends Umbra.Node {
    private popup: Popup;
    onInit() {
        this.popup = this.addChild(new Popup());
        this.popup.show();
    }
}

class Popup extends Gui.Widget {
    private frame: Gui.Frame;

    constructor() {
        super();
        this.setModal();
    }

    public onInit() {
        super.onInit();
        let popup: Gui.Popup = this.addChild(new Gui.Popup({cancelAction: this.onCancel.bind(this)}));
        this.frame = popup.addChild(new Gui.Frame({}));
        let vpanel: Gui.VPanel = this.frame.addChild(new Gui.VPanel({}));
        vpanel.addChild(new Gui.Label({label: "Press OK to cancel"}));

        vpanel.addChild(new Gui.Button({
            autoHideWidget: this,
            callback: this.onPressOk.bind(this),
            label: "OK",
            textAlign: Gui.TextAlignEnum.CENTER,
        }));
        this.hide();
    }

    public onRender(_destination: Yendor.Console) {
        this.center();
    }

    public onUpdate(time: number) {
        super.onUpdate(time);
    }

    private onPressOk(_data: any): boolean {
        return true;
    }

    private onCancel(): boolean {
        return true;
    }
}