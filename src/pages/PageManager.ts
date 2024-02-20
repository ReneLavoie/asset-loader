import * as PIXI from 'pixi.js';
import { BaseView } from './desktop/views/BaseView';
import { EventDispatcher } from '../EventDispatcher';
import { Events } from './desktop/events/Events';

export class PageManager extends PIXI.Container {

    private pages: Array<BaseView> = [];
    private currentPageId: string;

    constructor() {
        super();
    }

    public getCurrentPageId(): string {
        return this.currentPageId;
    }

    public showPage(pageId: string) {
        
        if(this.currentPageId === pageId) {
            EventDispatcher.instance.dispatcher.emit(Events.PAGE_SHOWN);
            return;
        }
       

        let page;
        if(this.currentPageId && this.currentPageId !== "") {
            page = this.pages.find(p => p.id === this.currentPageId);
            page.hide();
        }

        page = this.pages.find(p => p.id === pageId);

        if(page) {
            page.show();
            this.currentPageId = pageId;
        }
    }

    public addPage(page: BaseView) {
        this.pages.push(page);
        this.addChild(page);
    }

}