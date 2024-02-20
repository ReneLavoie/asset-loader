import * as PIXI from 'pixi.js';

export abstract class BaseSiteApp extends PIXI.Container {

    constructor() {
        super();
        this.init();
    }

    protected async init() {}

}