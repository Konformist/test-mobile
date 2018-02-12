'use strict';

import ArticlesView from 'articles-view';
import Pager from 'pager';

const HOST = 'https://api.knife-museum.ru';

class Articles {

    constructor(articleBlock, articlesBlock) {

        this._articleBlock = articleBlock;
        this._articlesBlock = articlesBlock;
        this._view = new ArticlesView;

        this.addArticle();

    }

    async addArticle(link = '/pages/api/v1/home') {

        let view = this._view;
        let container = this._articleBlock;
        let promise = await fetch(HOST + link);
        let article = await promise.json();

        container.innerHTML = view.renderArticle(article, false);
        await this.addArticles(`${link}/`);

    }

    async addArticles(link = '/pages/api/v1/home/') {

        let view = this._view;
        let container = this._articlesBlock;
        let promise = await fetch(HOST + link);
        let data = await promise.json();

        let dataPager = {
            count: data['count'],
            total: data['total'],
            index: data['index'],
            pages: data['pages']
        }

        container.innerHTML = view.renderArticles(data.items);
        container.innerHTML += this.addPager(data.links, dataPager);

    }

    addPager(links, data) {

        let pager = new Pager;
        let view = pager.create(links, data, HOST);

        return pager.getPager();

    }

}

window.Articles = Articles;
