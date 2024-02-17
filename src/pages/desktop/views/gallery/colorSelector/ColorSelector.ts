import * as PIXI from 'pixi.js';
import { ColorButton } from './ColorButton';
import { Application } from '../../../../../Application';
import { EventDispatcher } from '../../../../../EventDispatcher';
import { Events } from '../../../events/Events';


export class ColorSelector extends PIXI.Container {

    private colorButtons: Array<ColorButton> = [];
    private colorPallette: Array<number> = [0xfaf9f5, 0x242423, 0x8a8a8a, 0x610909, 0x053b0d, 0x05083b, 0x440354, 0x452810];
    private selected: number;

    constructor(selected: number) {
        super();

        this.selected = selected;
        this.initialize();
    }

    public destroy() {
        super.destroy();
        this.colorButtons.forEach(button => button.destroy());
        this.colorPallette = [];
    }

    public show() {
        this.colorButtons.forEach(button => button.show());
    }

    public hide() {
        this.colorButtons.forEach(button => button.hide());
    }

    private initialize() {
        this.createButtons();
        EventDispatcher.getInstance().getDispatcher().on(Events.BACKGROUND_COLOR_CHANGE, this.onColorChange, this);
    }

    private createButtons() {
        const offset: number = Application.windowSizes().availableWidth * 0.001;
        this.colorPallette.forEach((color, i) => {
            let button: ColorButton = new ColorButton(color);
            this.colorButtons.push(button);
            button.x = i === 0 ? (i * button.width) : i * (button.width + offset);
            button.select(i === this.selected);
            this.addChild(button);
        });
    }

    private onColorChange(color: number) {
        this.colorButtons.forEach(button => { button.select(color === button.getColor()); });
    }

}