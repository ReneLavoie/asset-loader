import * as PIXI from 'pixi.js';
import { BaseView } from './desktop/views/BaseView';
import { EventDispatcher } from '../EventDispatcher';
import { Events } from './desktop/events/Events';

export enum PageId {
    Lobby,
    Game_1,
    Game_2,
    Game_3,
    Game_4,
    Game_5,
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

        EventDispatcher.instance.dispatcher.emit(Events.SHOW_PAGE);

        this.pages[pageId].show();
        this.pages[this.currentPage].hide();

        this.currentPage = pageId;
    }

    public addPage(page: BaseView) {
        this.pages.push(page);
        this.addChild(page);
    }

    private init() {
        this.currentPage = PageId.Lobby;
    }

}