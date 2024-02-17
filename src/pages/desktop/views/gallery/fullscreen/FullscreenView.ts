import * as PIXI from 'pixi.js';
import { Assets } from '@pixi/assets';
import gsap from 'gsap';
import { Application } from '../../../../../Application';
import { EventDispatcher } from '../../../../../EventDispatcher';
import { Events } from '../../../events/Events';
import { FullscreenInfoText } from './FullscreenInfoText';
import { InfoBtn } from './InfoBtn';
import { DropShadowFilter } from '@pixi/filter-drop-shadow';

export class FullscreenView extends PIXI.Container {

    private infoTextView: FullscreenInfoText;
    private infoBtn: InfoBtn;
    private background: PIXI.Sprite;
    private image: PIXI.Sprite;
    private isShown: boolean = false;
    private imageId: number = -1;
    private textures: Map<string, PIXI.Texture>;
    private coord: PIXI.Rectangle;

    constructor() {
        super();
        this.init();
    }

    public getIsShown(): boolean {
        return this.isShown;
    }

    public resize() {
        if (this.isShown) {
            this.infoTextView.resize();
            this.show(this.imageId, null, true);
        }
    }

    public async show(id: number, coord: PIXI.Rectangle | null, force: boolean = false) {

        if (this.isShown && !force) {
            return;
        }

        this.isShown = true;

        if(coord) {
            this.coord = coord;
        }

        this.background.width = Application.windowSizes().availableWidth;
        this.background.height = Application.windowSizes().availableHeight;

        const targetHeight: number = Application.windowSizes().availableHeight * 0.9;
        const scaleRatio: number = targetHeight / this.coord.height;

        if(!force) {
            
            this.imageId = id;
            const texture: PIXI.Texture = await this.getTexture("thumb_" + this.imageId);
            this.image.texture = texture;
            this.image.alpha = 0;
            this.image.visible = true;
            this.image.scale.set(1);
            this.image.x = this.coord.x - this.x;
            this.image.height = this.coord.height;
            this.image.width = this.coord.width;
            this.image.filters = [new DropShadowFilter({ offset: new PIXI.Point(12, 12), blur: 2, alpha: 0.3, resolution: 5 })];

            gsap.to(this.image, {
                alpha: 1,
                width: this.coord.width * scaleRatio,
                height: targetHeight,
                x: 0,
                duration: 0.5,
                onComplete: () => {
                    this.infoBtn.show();
                    this.infoTextView.setLabel(id);
                    this.infoBtn.x = (this.image.x - (this.image.width * 0.4)) + (this.infoBtn.width * 0.5);
                    this.infoBtn.y = this.image.y - (this.image.height * 0.4) + (this.infoBtn.width * 0.5);
                    this.infoTextView.x = this.infoBtn.x + (this.image.width * 0.02);
                    this.infoTextView.y = this.infoBtn.y - (this.infoTextView.getTargetHeight() * 0.5);
                }
            });
    
            this.background.visible = true;
            this.background.alpha = 0;
    
            gsap.to(this.background, {
                alpha: 1,
                duration: 0.5,
            });
        } else {
            const scaleRatio: number = targetHeight / this.image.height;
            this.image.x = 0;
            this.image.height = targetHeight;
            this.image.width = this.image.width * scaleRatio;
            this.infoBtn.x = (this.image.x - (this.image.width * 0.4)) + (this.infoBtn.width * 0.5);
            this.infoBtn.y = this.image.y - (this.image.height * 0.4) + (this.infoBtn.width * 0.5);
            this.infoTextView.x = this.infoBtn.x + (this.image.width * 0.02);
            this.infoTextView.y = this.infoBtn.y - (this.infoTextView.getTargetHeight() * 0.5);
        }
    }

    public hide() {
        gsap.to(this.image, {
            alpha: 0,
            width: this.image.width * 0.3,
            height: this.image.height * 0.3,
            x: this.coord.x - this.x,
            duration: 0.5,
            onComplete: () => {
                this.image.visible = false;
                this.image.texture = null;
                this.isShown = false;
                EventDispatcher.getInstance().getDispatcher().emit(Events.FULLSCREEN_HIDE);
            }
        });

        gsap.to(this.background, {
            alpha: 0,
            duration: 0.5,
            onComplete: () => this.background.visible = false
        });

        this.infoTextView.hide();
        this.infoBtn.hide();
    }

    private init() {
        this.textures = new Map<string, PIXI.Texture>();
        this.interactive = true;
        this.on("pointerup", this.onMouseUp, this);
        EventDispatcher.getInstance().getDispatcher().on(Events.BACKGROUND_COLOR_CHANGE, this.onBackgroundColorChange, this);
        EventDispatcher.getInstance().getDispatcher().on(Events.INFO_BUTTON_CLICK, this.onInfoBtnClick, this);
        this.createBackground();
        this.createImage();
        this.createInfoTextView();
        this.createInfoButton();
    }

    private createBackground() {
        const targetWidth: number = Application.windowSizes().availableWidth;
        const targetHeight: number = Application.windowSizes().availableHeight;
        const gfx: PIXI.Graphics = new PIXI.Graphics();
        gfx.beginFill(0xffffff);
        gfx.drawRect(0, 0, targetWidth, targetHeight);
        gfx.endFill();
        const texture: PIXI.Texture = Application.getApp().renderer.generateTexture(gfx);
        this.background = new PIXI.Sprite(texture);
        this.background.tint = 0x610909;
        this.background.anchor.set(0.5);

        this.background.visible = false;

        this.addChild(this.background);
    }

    private createImage() {
        this.image = new PIXI.Sprite();
        this.image.anchor.set(0.5);
        this.image.visible = false;
        this.addChild(this.image);
    }

    private createInfoTextView() {
        this.infoTextView = new FullscreenInfoText();
        this.addChild(this.infoTextView);
    }

    private createInfoButton() {
        this.infoBtn = new InfoBtn();    
        this.addChild(this.infoBtn);
    }

    private async getTexture(id: string): Promise<PIXI.Texture> {

        if (this.textures.has(id)) {
            return this.textures.get(id);
        }
        const texture: PIXI.Texture = await Assets.load(id);

        this.textures.set(id, texture);

        return texture;
    }

    private onMouseUp() {
        this.hide();
    }

    private onBackgroundColorChange(color: number) {
        this.background.tint = color;
    }

    private onInfoBtnClick() {
        this.infoTextView.toggle();
    }

}