// get anime data

const searchBtn = document.querySelector(".searchBtn");
const notificationSound = document.querySelector(".notification");

searchBtn.addEventListener("click", function () {
  const inputKeyword = document.querySelector(".inputKeyword");
  const apiUrl = "https://api.jikan.moe/v4/" + "anime?q=" + inputKeyword.value;
  fetch(apiUrl)
    .then((response) => response.json())
    .then((response) => {
      const animeList = response.data;
      console.log(animeList);
      // Variable
      const animeContainer = document.querySelector(".animeSlider");
      const movieContainer = document.querySelector(".movieSlider");
      const specialContainer = document.querySelector(".specialSlider");
      const animeSection = document.querySelector(".animeContainer");
      const movieSection = document.querySelector(".movieContainer");
      const specialSection = document.querySelector(".specialContainer");
      const nullAlert = document.querySelector(".nullAlert");
      // Category
      const animeCategory = animeList.reduce((acc, animes) => {
        if (!acc[animes.type]) {
          acc[animes.type] = [];
        }
        acc[animes.type].push(animes);
        return acc;
      }, {});
      // stored cards
      let animeCards = "";
      let movieCards = "";
      let specialCards = "";

      // stored category data
      const { Movie, Special, TV } = animeCategory;

      // Map the result and put to cards
      function tvMap() {
        TV.map((m) => (animeCards += getAnimeData(m)));
      }
      function specialMap() {
        Special.map((m) => (specialCards += getAnimeData(m)));
      }
      function movieMap() {
        Movie.map((m) => (movieCards += getAnimeData(m)));
      }

      // Dont even ask
      if (!Special && !TV && !Movie) {
        notificationSound.play();
        nullAlert.classList.add("show");
        setTimeout(function () {
          nullAlert.classList.remove("show");
        }, 1700);
      }
      if (!Special) {
        console.log("cannot find special");
        specialSection.classList.add("none");
      } else {
        specialSection.classList.remove("none");
        specialMap();
      }
      if (!TV) {
        console.log("cannot find TV");
        animeSection.classList.add("none");
      } else {
        animeSection.classList.remove("none");
        tvMap();
      }
      if (!Movie) {
        console.log("cannot find Movie");
        movieSection.classList.add("none");
      } else {
        movieSection.classList.remove("none");
        movieMap();
      }

      // Display category result to broweser
      animeContainer.innerHTML = animeCards;
      movieContainer.innerHTML = movieCards;
      specialContainer.innerHTML = specialCards;

      detailProcess();
    });
});

function getAnimeData(anime) {
  return `<div class="resultSlider swiper-slide">
  <img src="${anime.images.webp.image_url}" alt="links" />
  <div class="overlay">
    <button class="detailBtn" data-idmal="${anime.mal_id}">Show Details</button>
  </div>
  <h4>${anime.title.length > 30 ? (anime.title = anime.title.substring(0, 30) + "...") : anime.title}</h4>
  <p>${anime.episodes === 1 ? anime.episodes + " Episode" : anime.episodes + " Episodes"}</p>
</div>`;
}

function detailProcess() {
  const detailBtn = document.querySelectorAll(".detailBtn");
  const detailcontainer = document.querySelector(".detailPopup");

  detailBtn.forEach((details) => {
    details.addEventListener("click", function () {
      detailcontainer.classList.add("show");
      detailcontainer.style.display = "flex";
      const failedText = "Cannot get anime info, this might happen because the anime is new or still in production process, we will update it soon.";
      const animeId = this.dataset.idmal;
      fetch("https://api.jikan.moe/v4/anime/" + animeId)
        .then((response) => response.json())
        .then((response) => {
          const detailData = response.data;
          // display the data
          detailcontainer.innerHTML = ` <div class="popup">
          <div class="cover">
          <img src="${detailData.images.webp.large_image_url}" alt="" />
          <div class="genreList">${detailData.genres.map((genre) => {
            return `<span class="genre">${genre.name}</span>`;
          })}</div>
          </div>
          <div class="detailText">
          <button class="closeBtn"><i class="fa-solid fa-xmark"></i></button>
          <h1>${detailData.title}</h1>
          <p>
          ${detailData.synopsis === null ? failedText : detailData.synopsis}
          </p>
          <span class="seeEpisode" data-epsid="${detailData.mal_id}">Latest Episode</span>
          </div>
          </div>`;
          detailProcessEps();

          const closeBtn = document.querySelector(".closeBtn");
          closeBtn.addEventListener("click", function () {
            detailcontainer.classList.remove("show");
            detailcontainer.style.display = "none";
            ``;
          });
        });
    });
  });
}
// Get Episode
function detailProcessEps() {
  const episodeSection = document.querySelector(".episodeSection");
  const episodeContainer = document.querySelector(".episodeContainer");
  const episodeBtn = document.querySelector(".seeEpisode");
  console.log(episodeBtn);
  episodeBtn.addEventListener("click", function () {
    const loadingAlert = document.querySelector(".loadingAlert");
    loadingAlert.classList.add("show");
    loadingAlert.style.borderLeftColor = "#88c37a";
    loadingAlert.innerHTML = `
          <i class="fa-solid fa-circle-exclamation" style="color: #88c37a;"></i>
          <p>Loading episodes</p>
          `;
    episodeSection.classList.add("show");
    const epsId = this.dataset.epsid;
    fetch("https://api.jikan.moe/v4/anime/" + epsId + "/videos/episodes")
      .then((response) => response.json())
      .then((response) => {
        // variable

        const episodes = response.data;
        const responseTime = performance.now() % 100;
        console.log(responseTime);
        console.log(episodes);
        if (episodes.length < 1) {
          notificationSound.play();
          episodeContainer.innerHTML = "";
          loadingAlert.innerHTML = `
          <i class="fa-solid fa-circle-exclamation" style="color: #ff4c4c;"></i>
          <p>theres an error while getting the anime episode</p>
          `;
          loadingAlert.style.width = "450px";
          loadingAlert.style.borderLeftColor = "#ff4c4c";
          setTimeout(function () {
            loadingAlert.classList.remove("show");
          }, 1700);
        } else {
          setTimeout(function () {
            loadingAlert.classList.remove("show");
          }, responseTime);

          let episodeList = "";
          // map episode
          episodes.map((anime) => (episodeList += showEpisode(anime)));
          console.log(episodes);
          episodeContainer.innerHTML = episodeList;
        }
      });
  });

  const toDetail = document.querySelector(".toDetail");
  toDetail.addEventListener("click", function () {
    episodeSection.classList.remove("show");
  });
}

function showEpisode(anime) {
  return `  
  <div class="episode">
  <img src="${anime.images.jpg.image_url}" alt="episode" />
  <p>${anime.episode} : ${anime.title}</p>
</div>`;
}

// slider
var swiper = new Swiper(".swiper", {
  slidesPerView: 1,
  breakpoints: {
    1200: {
      slidesPerView: 5,
    },
    1024: {
      slidesPerView: 4,
    },
    820: {
      slidesPerView: 3,
    },
    550: {
      slidesPerView: 2,
    },
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

var swiper = new Swiper(".headerContainer", {
  autoplay: {
    delay: 3000,
  },
  grabCursor: true,
  rewind: true,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});
