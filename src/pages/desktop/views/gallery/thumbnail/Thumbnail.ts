import * as PIXI from 'pixi.js';
import gsap from "gsap";
import { DropShadowFilter } from '@pixi/filter-drop-shadow';
import { EventDispatcher } from '../../../../../EventDispatcher';
import { Events } from '../../../events/Events';

export class Thumbnail extends PIXI.Container {

    private image: PIXI.Sprite;
    private texture: PIXI.Texture;
    private targetHeight: number;
    private originalHeight: number;
    private originalWidth: number;
    private id: number;
    private mouseCoord: PIXI.Point;

    constructor(id: number, texture: PIXI.Texture, height: number) {
        super();
        this.id = id;
        this.texture = texture;
        this.targetHeight = height;
        this.init();
    }

    public destroy() {
        super.destroy();

        gsap.killTweensOf(this.image);

        if (this.image) {
            this.image.destroy();
            this.image = null;
        }

        this.removeEventListener('mouseover', this.onMouserOver);
        this.removeEventListener('mouseout', this.onMouserOut);
        this.removeEventListener('mouseup', this.onMouseUp);
    }

    public show() {
        if (this.image.visible) return;

        this.image.visible = true;
        this.image.alpha = 0;

        gsap.to(this.image, { alpha: 1, duration: 0.3 });

        setTimeout( () => this.image.alpha = 1, 300);
    }

    public hide() {
        if (!this.image.visible) return;

        gsap.to(this.image, { alpha: 0, duration: 0.3, onComplete: () => { this.visible = false } });
    }

    private init() {

        this.cullable = true;
        this.mouseCoord = new PIXI.Point();
        this.image = new PIXI.Sprite(this.texture);
        this.image.interactive = true;
        this.image.anchor.set(0.5);
        this.image.height = this.targetHeight;
        this.image.scale.x = this.image.scale.y;

        this.originalHeight = this.image.height;
        this.originalWidth = this.image.width;

        this.image.visible = false;

        this.image.filters = [new DropShadowFilter({ offset: new PIXI.Point(12, 12), blur: 2, alpha: 0.3, resolution: 5 })];

        this.addChild(this.image);

        this.addEventListener('mouseover', this.onMouserOver);
        this.addEventListener('mouseout', this.onMouserOut);
        this.addEventListener('mouseup', this.onMouseUp);
        this.addEventListener('mousedown', this.onMouseDown);
    }

    private onMouseUp(e: PIXI.FederatedPointerEvent) {

        if (Math.round(e.global.x) !== this.mouseCoord.x ||
            Math.round(e.global.y) !== this.mouseCoord.y) {
            return;
        }

        EventDispatcher.getInstance().getDispatcher().emit(Events.THUMBNAIL_CLICK, { id: this.id, rect: new PIXI.Rectangle(this.mouseCoord.x, this.mouseCoord.y, this.width, this.height) });
    }

    private onMouseDown(e: PIXI.FederatedPointerEvent) {
        this.mouseCoord.x = Math.round(e.global.x);
        this.mouseCoord.y = Math.round(e.global.y);
    }

    private onMouserOver() {

        gsap.killTweensOf(this.image);

        const targetHeight: number = this.originalHeight * 1.1;
        const targetWidth: number = this.originalWidth * 1.1;

        gsap.to(this.image, {
            width: targetWidth,
            height: targetHeight,
            duration: 0.3,
            ease: "power2.out",
        });
    }

    private onMouserOut() {
        gsap.killTweensOf(this.image);

        const targetHeight: number = this.originalHeight;
        const targetWidth: number = this.originalWidth;

        gsap.to(this.image, {
            width: targetWidth,
            height: targetHeight,
            duration: 0.3,
            ease: "power2.out",
        });
    }
}