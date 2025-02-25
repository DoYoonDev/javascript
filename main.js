const API_KEY = "4d52698a98e84e07a18106b9123fabb0";
let news = [];
const getLatestNews = async() => {
    const url = new URL(
        `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`
    );
    const response = await fetch(url);
    const data = await response.json();
    news = data.articles;
    console.log("ddd", news);
}

getLatestNews();