document.addEventListener('DOMContentLoaded', function () {
    const articlesContainer = document.getElementById('articles');

    function generateArticleHTML(article) {
        return `
            <article class="article">
                <h2>${article.title}</h2>
                <p><strong>Published on:</strong> ${article.date}</p>
                <p><strong>Written by:</strong> ${article.author}</p>
                <p><strong>Category:</strong> ${article.category}</p>
                <button class="read-full-article-btn" data-id="${article.id}">Read Full Article</button>
            </article>
        `;
    }

    function loadArticles() {
        articlesContainer.innerHTML = articles.map(article => generateArticleHTML(article)).join('');
    }

    articlesContainer.addEventListener('click', function (e) {
        if (e.target.classList.contains('read-full-article-btn')) {
            const articleId = e.target.getAttribute('data-id');
            window.location.href = `./articles/article.html?id=${articleId}`;
        }
    });

    loadArticles();
});
