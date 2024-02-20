import { Select } from '@pixi/ui';
import * as PIXI from 'pixi.js';
import { Model } from '../../../../../Model';
import { EventDispatcher } from '../../../../../EventDispatcher';
import { Events } from '../../../events/Events';

export class SelectBtn extends PIXI.Container {

    private enabled: boolean = true;
    private select: Select;
    private arrowTexture: PIXI.Texture;

    constructor(arrowTexture: PIXI.Texture) {
        super();
        this.arrowTexture = arrowTexture;
        this.init();
    }

    public enable(value: boolean) {
        this.enabled = value;
    }

    private init() {
        this.createSelectBtn();
    }

    private createSelectBtn() {

        const items = Model.instance.gameIds.map(item => item.GameId);
        items.unshift("lobby");
        const backgroundColor = 0xF5E3A9;
        const hoverColor = 0xffffff;
        const width = 250;
        const height = 50;  
        const radius = 15;
        const textStyle = {fontSize: 25, fill: 0x000000};

        this.select = new Select({
            closedBG: this.getClosedBG(backgroundColor, width, height, radius),
            openBG: this.getOpenBG(backgroundColor, width, height, radius),
            textStyle: textStyle,
            items: {
                items,
                backgroundColor,
                hoverColor,
                width,
                height,
                radius,
                textStyle: textStyle,
            },
            scrollBox: {
                width,
                height: height * items.length,
                radius
            }
        });

        this.select.onSelect.connect(this.onSelect.bind(this));

        this.addChild(this.select);
    }

    private getClosedBG(backgroundColor: number, width: number, height: number, radius: number): PIXI.Graphics {
        const closedBG = new PIXI.Graphics().beginFill(backgroundColor).drawRoundedRect(0, 0, width, height, radius);

        const arrowDown = PIXI.Sprite.from(this.arrowTexture);

        arrowDown.anchor.set(0.5);
        arrowDown.height = height * 0.5;
        arrowDown.scale.x  = arrowDown.scale.y;
        arrowDown.x = width * 0.9;
        arrowDown.y = height * 0.5;
        closedBG.addChild(arrowDown);

        return closedBG;
    }

    private getOpenBG(backgroundColor: number, width: number, height: number, radius: number): PIXI.Graphics {
        const openBG = new PIXI.Graphics().beginFill(backgroundColor).drawRoundedRect(0, 0, width, height * 6, radius);

        const arrowUp = PIXI.Sprite.from(this.arrowTexture);

        arrowUp.height = height * 0.5;
        arrowUp.scale.x  = arrowUp.scale.y;
        arrowUp.angle = 180;
        arrowUp.anchor.set(0.5);
        arrowUp.x = width * 0.9;
        arrowUp.y = height * 0.5;
        openBG.addChild(arrowUp);

        return openBG;
    }

    private onSelect(index: number, text: string) {

        if(!this.enabled) return;

        EventDispatcher.instance.dispatcher.emit(Events.SHOW_PAGE, text);
    }
}