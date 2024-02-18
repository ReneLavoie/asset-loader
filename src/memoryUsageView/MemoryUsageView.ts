import { EventDispatcher } from '../EventDispatcher';
import { SystemEvents, TotalHeap } from '../events/Events';
import { BaseView } from '../pages/desktop/views/BaseView';
import * as PIXI from 'pixi.js';
import { Application } from "../Application";

export class MemoryUsageView extends BaseView {

    private heapUsed: PIXI.Text;

    constructor() {
        super();

        this.init();
    }

    public show() {
        this.visible = true;
    }

    protected init() {

        this.createBackground();
        this.createText();

        EventDispatcher.instance.dispatcher.on(SystemEvents.CURRENT_HEAP_USAGE, this.onHeapUsage, this);
    }

    protected createBackground() {
        if(this.background) {
            this.background.destroy();
            this.background = null;
        }

        const targetWidth = Application.windowSizes.width * 0.15;
        const targetHeight = Application.windowSizes.availableHeight * 0.15;

        this.background = new PIXI.Graphics();
        this.background.beginFill(0xffffff);
        this.background.drawRoundedRect(0, 0, targetWidth, targetHeight, 10);
        this.background.endFill();

        this.background.alpha = 0.3;

        this.addChild(this.background);
    }

    private createText() {

        this.heapUsed = new PIXI.Text('Heap used: ', {
            fontSize: 20,
            fill: 0x0000ff
        });

        this.heapUsed.x = this.background.width * 0.1;
        this.heapUsed.y = this.background.height * 0.1;

        this.addChild(this.heapUsed);
    }

    private onHeapUsage(e: TotalHeap ) {
        this.heapUsed.text = `Heap used: ${e.heapUsed.toFixed(4)} GB`;
    }
}