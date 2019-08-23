const apiKey = 'afe914444a1746889521365eecab47ee';
const DEFALT_SOURCE = 'talksport';
const sourceOptions = document.querySelector('#sources');
const mainContainer = document.querySelector('main');

const updateNewsSources = async () => {
  try {
    const response = await fetch(
      `https://newsapi.org/v2/sources?apiKey=${apiKey}`,
    );
    const { sources } = await response.json();
    sourceOptions.innerHTML = sources
      .map((source) => `<option value="${source.id}">${source.name}</option>`)
      .join('\n');
  } catch (error) {
    window.alert('Error connecting to the internet');
  }
};

const updateNews = async (source = DEFALT_SOURCE) => {
  try {
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?sources=${source}&sortBy=top&apiKey=${apiKey}`,
    );
    const { articles } = await response.json();
    mainContainer.innerHTML = articles.map(createArticleHtml).join('\n');
  } catch (error) {
    window.alert('Error fetching articles');
  }
};

const createArticleHtml = (article) => {
  return `
  <div class="article">
    ${
      article.urlToImage
        ? '<img src="' +
          article.urlToImage +
          '" alt="' +
          article.title +
          '" width="320">'
        : ''
    }
    <h4>${article.title}</h4>
    <a href="${article.url}" target="_blank">${article.url ? 'Read' : ''}</a>
  </div>
  `;
};

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () =>
    navigator.serviceWorker
      .register('sw.js')
      .then((reg) => console.log('Service Worker registered'))
      .catch((err) => `SW registration failed: ${err.message}`),
  );
}

window.addEventListener('load', async (e) => {
  sourceOptions.addEventListener('change', (evt) =>
    updateNews(evt.target.value),
  );
  await updateNewsSources();
  sourceOptions.value = DEFALT_SOURCE;
  updateNews();
});

window.addEventListener('online', () => updateNews(sourceOptions.value));
