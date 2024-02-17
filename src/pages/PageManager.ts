import * as PIXI from 'pixi.js';
import { BaseView } from './desktop/views/BaseView';
import { EventDispatcher } from '../EventDispatcher';
import { Events } from './desktop/events/Events';

export enum PageId {
    Home,
    Gallery,
    About,
    Contact
}

export class PageManager extends PIXI.Container {

    private pages: Array<BaseView> = [];
    private currentPage: PageId;

    constructor() {
        super();

        this.init();
    }

    public getCurrentPage(): PageId {
        return this.currentPage;
    }

    public showPage(pageId: PageId) {
        if (!this.pages[pageId] || pageId === this.currentPage) {
            return;
        }

        EventDispatcher.getInstance().getDispatcher().emit(Events.SHOW_PAGE);

        this.pages[pageId].show();
        this.pages[this.currentPage].hide();

        this.currentPage = pageId;
    }

    public addPage(page: BaseView) {
        this.pages.push(page);
        this.addChild(page);
    }

    private init() {
        this.currentPage = PageId.Home;
    }

}