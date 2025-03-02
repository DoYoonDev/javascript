const API_KEY = `4d52698a98e84e07a18106b9123fabb0`;
let newsList = [];
let url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr`);
let totalResults = 0;
let page = 1;
const pageSize = 10;
const groupSize = 5;

const menus = document.querySelectorAll(".list-inline li");
menus.forEach((menu) =>
  menu.addEventListener("click", (event) => getNewsByCategory(event))
);

const getNews = async(url) => {
  try {
    url.searchParams.set("page", page);
    url.searchParams.set("pageSize", pageSize);
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    if (response.status === 200) {
      if (data.articles.length === 0) {
        throw new Error("검색 결과가 없습니다.");
      }
      newsList = data.articles;
      totalResults = data.totalResults;
      render();
      paginationRender();
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    errorRender(error.message); // 에러 메시지 출력
  }
}

const getLatesNews = async () => {
  url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr`
  );
  getNews(url);
};

const getNewsByCategory = async (event) => {
  const category = event.target.textContent.toLowerCase();
  console.log("category", category);
  url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&category=${category}`
  );
  getNews(url);
};

document.addEventListener("DOMContentLoaded", () => {
  attachEventListeners();
});

const attachEventListeners = () => {
  // 검색 아이콘 클릭 시 검색창 토글
  document.getElementById("search-toggle").addEventListener("click", () => {
    const searchBox = document.getElementById("search-box");
    searchBox.classList.toggle("show"); // 검색창 표시/숨김
  });
  document
    .getElementById("search-button")
    .addEventListener("click", getNewsByKeyword);

  // 검색창에 엔터 클릭 시 검색 실행
  document
    .getElementById("search-input")
    .addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        getNewsByKeyword();
      }
    });

  // 햄버거 버튼 클릭 시 메뉴 토글
  document.getElementById("hamburger-toggle").addEventListener("click", () => {
    document.getElementById("side-menu").classList.add("show");
  });

  // 닫기 버튼 클릭 시 메뉴 닫기
  document.getElementById("close-menu").addEventListener("click", () => {
    document.getElementById("side-menu").classList.remove("show");
  });

  const categoryMenus = document.querySelectorAll(".nyt-menu li");
  categoryMenus.forEach((menu) =>
    menu.addEventListener("click", getNewsByCategory)
  );

  // 📌 사이드 메뉴 카테고리 클릭 이벤트 추가 + 메뉴 닫기
  const sideMenuCategories = document.querySelectorAll(".side-menu ul li");
  sideMenuCategories.forEach((menu) =>
    menu.addEventListener("click", (event) => {
      getNewsByCategory(event); // 뉴스 리스트 업데이트
      document.getElementById("side-menu").classList.remove("show"); // 사이드 메뉴 닫기
    })
  );
};

const toggleSearchBox = () => {
  const searchBox = document.getElementById("search-box");
  searchBox.style.display =
    searchBox.style.display === "flex" ? "none" : "flex";
};

const getNewsByKeyword = async () => {
  const searchInput = document.getElementById("search-input");
  const keyword = searchInput.value.trim();

  if (!keyword) return alert("검색어를 입력해주세요.");

  console.log("검색어:", keyword);

  const url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&q=${keyword}`
  );

  getNews(url);
};

// 200자 이상이면 ... 표기
const truncateText = (text, limit) => {
  if (!text) return "내용 없음";
  return text.length > limit ? text.substring(0, limit) + "..." : text;
};

// 시간 표기 변경
const formatTimeAgo = (dateString) => {
  return moment(dateString).fromNow();
};

const render = () => {
  const newsHTML = newsList
    .map((news) => {
      const imageUrl = news.urlToImage
        ? news.urlToImage
        : "https://breffee.net/data/editor/2210/20221013104826_fd5326c8ac17c04c88d91f03a8d313d8_5r8y.jpg";

      const source = news.source?.name ? news.source.name : "no source";

      const publishedTime = news.publishedAt
        ? formatTimeAgo(news.publishedAt)
        : "날짜 없음";

      return `<div class="row news">
                <div class="col-lg-4">
                    <img class="news-img-size"
                        src="${imageUrl}"
                        onerror="this.onerror=null; this.src='https://breffee.net/data/editor/2210/20221013104826_fd5326c8ac17c04c88d91f03a8d313d8_5r8y.jpg';" />
                        
                </div>
                <div class="col-lg-8">
                    <h2>${news.title}</h2>
                    <p class=news-description>${truncateText(
                      news.description,
                      200
                    )}</p>
                    <div>${source} * ${publishedTime}</div>
                </div>
            </div>`;
    })
    .join("");

  document.getElementById("news-board").innerHTML = newsHTML;
};

const errorRender = (errorMessage) => {
  const errorHTML = `<div class="alert alert-danger" role="alert">
                        ${errorMessage}
                    </div>`;
  document.getElementById("news-board").innerHTML = errorHTML;
}

const paginationRender = () => {
  const totalPage = Math.ceil(totalResults/pageSize);
  const pageGroup = Math.ceil(page/groupSize);
  let lastPage = pageGroup * groupSize;
  if (lastPage > totalPage) {
    lastPage = totalPage;
  }

  const firstPage = lastPage - (groupSize - 1) <= 0 ? 1 : lastPage - (groupSize - 1);

  let paginationHTML = ``;

  for (let i = firstPage; i < lastPage; i++) {
    paginationHTML += `<li class="page-item"><a class="page-link" onclick="moveToPage(${i})">${i}</a></li>`;    
  }
  document.querySelector(".pagination").innerHTML = paginationHTML;
  // <nav aria-label="Page navigation example">
  //   <ul class="pagination">
  //     <li class="page-item"><a class="page-link" href="#">Previous</a></li>
  //     <li class="page-item"><a class="page-link" href="#">1</a></li>
  //     <li class="page-item"><a class="page-link" href="#">2</a></li>
  //     <li class="page-item"><a class="page-link" href="#">3</a></li>
  //     <li class="page-item"><a class="page-link" href="#">Next</a></li>
  //   </ul>
  // </nav>
}

const moveToPage = (pageNum) => {
  page = pageNum;
  
  getNews(url);
}

getLatesNews();