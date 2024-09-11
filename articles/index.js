const articlesList = document.getElementById('articles');
const db = firebase.database().ref('articles');

// Load and display articles initially, sorted by date (recent to old)
db.orderByKey().on('value', (snapshot) => {
  const articles = snapshot.val();
  const sortedArticles = Object.entries(articles).sort(([, a], [, b]) => new Date(b.publishDate) - new Date(a.publishDate));
  displayArticles(sortedArticles);
});

// Function to display articles based on provided array of articles
function displayArticles(articles) {
  articlesList.innerHTML = '';
  if (articles.length === 0) {
    articlesList.innerHTML = '<p>No articles found.</p>';
  }
  articles.forEach(([key, article]) => {
    displayArticle(key, article.title, article.author, article.publishDate, article.category, article.viewCount || 0);
  });
}

// Search functionality
document.getElementById('searchButton').addEventListener('click', function () {
  const searchText = document.getElementById('searchBox').value.toLowerCase();
  db.orderByKey().once('value', (snapshot) => {
    const articles = snapshot.val();
    const filteredArticles = Object.entries(articles)
      .filter(([key, article]) =>
        article.title.toLowerCase().includes(searchText) ||
        article.category.toLowerCase().includes(searchText) ||
        article.content?.toLowerCase().includes(searchText)
      )
      .sort(([, a], [, b]) => new Date(b.publishDate) - new Date(a.publishDate)); // Sort by date (recent to old)
    displayArticles(filteredArticles);
  });
});

// Filter by category
document.getElementById('filter-by').addEventListener('change', function () {
  const selectedCategory = this.value;
  db.orderByKey().once('value', (snapshot) => {
    const articles = snapshot.val();
    const filteredArticles = selectedCategory === 'all'
      ? Object.entries(articles)
      : Object.entries(articles).filter(([key, article]) => article.category === selectedCategory);

    const sortedArticles = filteredArticles.sort(([, a], [, b]) => new Date(b.publishDate) - new Date(a.publishDate)); // Sort by date (recent to old)
    displayArticles(sortedArticles);
  });
});

function displayArticle(id, title, author, publishDate, category, viewCount) {
  const articleDiv = document.createElement('div');
  articleDiv.classList.add('article');
  articleDiv.innerHTML = `
    <h2>${title}</h2>
    <p><strong>Written by: ${author}</strong></p>
    <p><strong>Published on: ${publishDate}</strong></p>
    <p><strong>Category: ${category}</strong></p>
    <p><strong>Views: ${viewCount}</strong></p>
    <button class="read-full-article-btn" onclick="viewArticle('${id}')">Read Full Article</button>
  `;
  articlesList.appendChild(articleDiv);
}

function viewArticle(id) {
  window.location.href = `articles/article.html?id=${id}`;
}
