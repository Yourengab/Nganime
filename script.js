// get anime data
const searchBtn = document.querySelector(".searchBtn");
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

      // Category
      const animeCategory = animeList.reduce((acc, animes) => {
        if (!acc[animes.type]) {
          acc[animes.type] = [];
        }
        acc[animes.type].push(animes);
        return acc;
      }, {});
      // stored category data
      const { Movie, Special, TV } = animeCategory;

      // stored cards
      let animeCards = "";
      let movieCards = "";
      let specialCards = "";

      // Dont even ask
      if (!Special && !TV && !Movie) {
        alert("Animes that you search is not found try searching other anime");
      }
      // Special contain OVA, ONA.
      if (!Special) {
        console.log("cannot find special");
        document.querySelector(".specialContainer").style.display = "none";
      } else {
        document.querySelector(".specialContainer").style.display = "flex";
        Special.map((m) => (specialCards += getAnimeData(m)));
        // ONA.map((m) => (specialCards += getAnimeData(m)));
        // OVA.map((m) => (specialCards += getAnimeData(m)));
      }
      if (!TV) {
        console.log("cannot find TV");
        document.querySelector(".animeContainer").style.display = "none";
      } else {
        document.querySelector(".specialContainer").style.display = "flex";
        TV.map((m) => (animeCards += getAnimeData(m)));
      }
      if (!Movie) {
        console.log("cannot find Movie");
        document.querySelector(".movieContainer").style.display = "none";
      } else {
        document.querySelector(".specialContainer").style.display = "flex";
        Movie.map((m) => (movieCards += getAnimeData(m)));
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

      const animeId = this.dataset.idmal;
      fetch("https://api.jikan.moe/v4/anime/" + animeId)
        .then((response) => response.json())
        .then((response) => {
          const detailData = response.data;
          console.log(detailData.title);

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
          ${detailData.synopsis == "null" ? "Tidak Ada Detail yang harus ditampilkan" : detailData.synopsis}
          </p>
          <span class="seeEps">Latest Episode</span>
          </div>
          </div>`;
          const closeBtn = document.querySelector(".closeBtn");
          closeBtn.addEventListener("click", function () {
            detailcontainer.classList.remove("show");
            detailcontainer.style.display = "none";
          });
        });
    });
  });
}

// slider
const homeSlider = document.querySelector(".main-carousel");
var flkty = new Flickity(homeSlider, {
  // options
  cellAlign: "center",
  autoPlay: true,
});
const animeSlider = document.querySelector(".anime-carousel");
var flkty = new Flickity(animeSlider, {
  // options
  cellAlign: "left",
  freeScroll: false,
  contain: true,
});

var swiper = new Swiper(".swiper", {
  slidesPerView: 5,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});
