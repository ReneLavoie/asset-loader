import * as PIXI from 'pixi.js';
import { LanguageBtn } from './buttons/LanguageBtn';
import { Application } from '../../../../Application';
import { Model } from '../../../../Model';

export class LanguageSelector extends PIXI.Container {

    private buttons: Map<string, LanguageBtn>;
    private assets: any = {};

    constructor(assets: any) {
        super();
        this.assets = assets;
        this.init();
    }

    public resize() {
        this.buttons.forEach((btn, key) => {btn.destroy();});
        while(this.children.length > 0 ) this.removeChildAt(0);
        this.createButtons();
        this.positionButtons();
    }

    private init() {
        this.createButtons();
        this.positionButtons();
    }

    private createButtons() {

        this.buttons = new Map<string, LanguageBtn>();

        for(let key in this.assets) {
            let button: LanguageBtn = new LanguageBtn(key, this.assets[key]);
            button.show();
            this.addChild(button);
            this.buttons.set(key, button);
        }
        this.buttons.get(Model.instance.getLanguage()).select(true);
    }

    private positionButtons() {
        const enButton: LanguageBtn | undefined = this.buttons.get('en');
        const frButton: LanguageBtn | undefined = this.buttons.get('fr');
        const bgButton: LanguageBtn | undefined = this.buttons.get('bg');
        const space = Application.windowSizes.availableWidth * 0.01;

        if (bgButton) {
            bgButton.x = 0;
        }

        if (frButton) {
            frButton.x = bgButton?.width + space ?? 0;
        }

        if (enButton) {
            enButton.x = frButton.x + frButton?.width + space ?? 0 ;
        }
    }
}