import { EventDispatcher } from '../EventDispatcher';
import { SystemEvents, TotalHeap } from '../events/Events';
import { BaseView } from '../pages/desktop/views/BaseView';
import * as PIXI from 'pixi.js';
import { Application } from "../Application";
import { MathUtils } from '../utils/MathUtils';

export class MemoryUsageView extends BaseView {

    private heapUsed: PIXI.Text;
    private memoryUsed: PIXI.Text;

    constructor(id: string) {
        super(id);

        this.init();
    }

    public async show() {
        this.visible = true;
    }

    protected init() {

        this.createBackground();
        this.createText();

        EventDispatcher.instance.dispatcher.on(SystemEvents.CURRENT_HEAP_USAGE, this.onHeapUsage, this);
        EventDispatcher.instance.dispatcher.on(SystemEvents.MEMORY_UPDATE, this.onMemoryUpdate, this);
    }

    protected createBackground() {
        if(this.background) {
            this.background.destroy();
            this.background = null;
        }

        const targetWidth = Application.windowSizes.width * 0.15;
        const targetHeight = Application.windowSizes.availableHeight * 0.1;

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
            fill: 0x00ff00
        });

        this.heapUsed.x = this.background.width * 0.1;
        this.heapUsed.y = this.background.height * 0.1;

        this.addChild(this.heapUsed);

        this.memoryUsed = new PIXI.Text('Memory used: ', {
            fontSize: 20,
            fill: 0x00ff00
        });

        this.memoryUsed.x = this.background.width * 0.1;
        this.memoryUsed.y = this.heapUsed.height * 2;

        this.addChild(this.memoryUsed);
    }

    private onHeapUsage(e: TotalHeap ) {
        this.heapUsed.text = `Heap used: ${e.heapUsed.toFixed(4)} GB`;
    }

    private onMemoryUpdate(e: number) {
        const value = MathUtils.bytesToGB(e);
        this.memoryUsed.text = `Memory used: ${value.toFixed(4)} GB`;
    }
}