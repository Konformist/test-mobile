'use strict';

class Pager {

    create(links, data, host) {

        this._links = links;
        this._data = data;
        this._pager = '';
        this._host = host;

        this.render();

    }

    render() {

        this._pager = `
            <div class="pager">
                ${this.addView(this.createPage('prev'))}
                ${this.addView(this.createPage('start'))}
                ${this.addPages()}
                ${this.addView(this.createPage('finish'))}
                ${this.addView(this.createPage('next'))}
            </div>`;

    }

    addPages(width = 5) {

        let data = this._data;
        let current = data['index'];
        let pages = data['pages'];
        let ret = '';

        let tail = Math.floor(width / 2);
        let start = current - tail;
        let end = current + tail;

        if (!(width % 2)) {

            console.log('Width is even');

        } else if (width >= pages) {

            start = 2;
            end = pages - 1;

        } else if (start < 2) {

            end += 1 - start;
            start = 2;

        } else if (end >= pages) {

            start -= end - pages;
            end = pages - 1;

        }

        ret += start > 2 ? this.addView(this.createPage('...')) : '';

        for (let i = start; i <= end; i++)
            ret += this.addView(this.createPage(i));

        ret += end < pages - 1 ? this.addView(this.createPage('...')) : '';

        return ret;

    }

    createPage(name) {

        let title = '';
        let page = {};
        let links = this._links;
        let data = this._data;
        let host = this._host;

        if(name == 'next' || name == 'prev') {

            title = name == 'next' ? '>' : '<';
            page['title'] = title;
            page['page'] = links[name];

        } else if (name == 'start' || name == 'finish') {

            title = name == 'start' ? '1' : `${data['pages']}`;
            page['title'] = title;
            page['page'] = links[name];

        } else if (name == '...') {

            page['title'] = `${name}`;
            page['page'] = `${name}`;

        } else {

            page['title'] = `${name}`;
            page['page'] = host.replace('{{page}}', name);

        }

        return page;

    }

    addView(page) {

        let ret = '';
        let current = this._links['current'];

        if (page['page'] == current || page['page'] == '...') {

            ret = `<div class="page page-active">${page['title']}</div>`;

        } else {

            ret = `
                <div class="page" onclick="articles.addArticles('${page.page}')">
                    ${page['title']}
                </div>`;

        }

        return ret;

    }

    getPager() {

        if (this._data['pages'] <= 1)
            return '';

        return this._pager;

    }

};

export default Pager;
