const API_KEY = "4d52698a98e84e07a18106b9123fabb0";
let newsList = [];
const getLatestNews = async () => {
  const url = new URL(
    // `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&apiKey=${API_KEY}`
  );
  const response = await fetch(url);
  const data = await response.json();
  newsList = data.articles;
  console.log("ddd", newsList);
  render();
};

const render = () => {
  const newsHTML = newsList.map(
    (news) => `<div class="row news">
                    <div class="col-lg-4">
                        <img class="news-img-size" src="${news.urlToImage}" alt="">
                    </div>
                    <div class="col-lg-8">
                        <h2>${news.title}</h2>
                        <p>
                            ${news.description}
                        </p>
                        <div>
                            ${news.source.name} * ${news.publishedAt}
                        </div>
                    </div>
                </div>`
  ).join("");

  document.getElementById("news-board").innerHTML = newsHTML;
};

getLatestNews();
