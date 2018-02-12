'use strict';

class ArticlesView {

    renderArticles(articles) {

        let ret = articles.reduce((acc, current) => {

            return acc += this.renderArticle(current);

        }, '');

        return ret;

    }

    renderArticle(article, announce = true) {

        let data = article.data;
        let links = article.links;
        let text = announce ? data.announce : data.text;
        let click = announce ? `onclick="articles.addArticle('${links.self}');"` : '';

        if (text !== '')
            text = `<div class="article-text">${text}</div>`;

        return `
            <div class="article" ${click}>
                <h3>${data.title}</h3>
                ${text}
            </div>
        `;

    }

}

export default ArticlesView;
