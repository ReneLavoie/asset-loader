import { Application } from "../../../../Application";
import * as PIXI from 'pixi.js';
import { EventDispatcher } from "../../../../EventDispatcher";
import { Events } from "../../events/Events";
import gsap from "gsap";
import { BaseView } from "../BaseView";
import { SystemEvents } from "../../../../events/Events";
import { AssetManager } from "../../../../AssetManager";
import { Select } from "@pixi/ui";
import { SelectBtn } from "../navBar/select/SelectBtn";

export class NavigationBar extends BaseView {
    private selectGame: SelectBtn;

    constructor(id: string) {
        super(id);
    }

    public async show() {
        if (this.visible) return;

        this.visible = true;
        gsap.to(this, { duration: 0.3, alpha: 1 });
    }

    public hide() {
        if (!this.visible) return;

        gsap.to(this, { duration: 0.3, alpha: 0, onComplete: () => { this.visible = false } });
    }

    protected init() {
        super.init();
        EventDispatcher.instance.dispatcher.on(Events.PAGE_SHOWN, this.onPageShown, this);
        EventDispatcher.instance.dispatcher.on(Events.SHOW_PAGE, this.onShowPage, this);

        AssetManager.instance.loadAssetBundle(this.id);
    }

    protected createBackground() {

        if (this.background) {
            this.background.destroy();
            this.background = null;
        }

        const targetWidth: number = Application.windowSizes.width;
        const targetHeight: number = Application.windowSizes.height * 0.1;

        this.background = new PIXI.Graphics();
        this.background.beginFill(0xFFFFFF);
        this.background.lineStyle({ width: 1, color: 0x2f3238 });
        this.background.drawRect(0, 0, targetWidth, targetHeight);
        this.background.endFill();

        this.background.tint = 0x333843;

        this.addChildAt(this.background, 0);
    }

    private enable(value: boolean) {
        this.selectGame.enable(value);
    }

    private createSelectBtn(arrowTexture: PIXI.Texture) {
        this.selectGame = new SelectBtn(arrowTexture);
        this.selectGame.x = (this.background.width - this.selectGame.width) * 0.5;
        this.selectGame.y = (this.background.height - this.selectGame.height) * 0.5;

        this.addChild(this.selectGame);
    }

    private create(arrowTexture: PIXI.Texture) {
        this.createBackground();
        this.createSelectBtn(arrowTexture);
    }

    protected async onBundleLoaded(e: any) {
        if (e.id !== this.id) return;

        this.create(e.assets.arrow);

        EventDispatcher.instance.dispatcher.emit(Events.PAGE_SHOWN);
    }

    private onPageShown() {
        setTimeout(() => this.enable(true), 500);
    }

    private onShowPage() {
        this.enable(false);
    }

    protected onResize(e: any) {
        super.onResize(e);
        
    }
}