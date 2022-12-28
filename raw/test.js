const inputKeyword = document.querySelector(".searchBox");
const genreName = document.querySelectorAll(".genreName");
const cariBtn = document.querySelector(".cariBtn");

cariBtn.addEventListener("click", function () {
  if (inputKeyword.value === "") {
    alert("Please write something in the search bar");
  } else {
    const apiUrl = "https://api.jikan.moe/v4/" + "anime?q=" + inputKeyword.value;
    const movieContainer = document.querySelector(".movieContainer");
    const specialContainer = document.querySelector(".specialContainer");
    const ovaContainer = document.querySelector(".ovaContainer");
    const musicContainer = document.querySelector(".musicContainer");
    const onaContainer = document.querySelector(".onaContainer");
    const tvContainer = document.querySelector(".tvContainer");
    fetch(apiUrl)
      .then((response) => response.json())
      .then((response) => {
        const animes = response.data;
        console.log(response.data);
        const animeCategory = animes.reduce((acc, animes) => {
          if (!acc[animes.type]) {
            acc[animes.type] = [];
          }
          acc[animes.type].push(animes);
          return acc;
        }, {});
        let ovaCards = "";
        let tvCards = "";
        let specialCards = "";
        let movieCards = "";
        let onaCards = "";
        let musicCards = "";
        const { TV, OVA, Special, Movie, Music, ONA } = animeCategory;
        if (!Special && !OVA && !TV && !Movie && !Music && !ONA) {
          alert("Animes that you search is not found try searching other anime");
        }
        if (!Special) {
          console.log("cannot find special");
          document.querySelector(".specialMain").style.display = "none";
        } else {
          Special.map((m) => (specialCards += showAnimes(m)));
        }
        if (!OVA) {
          console.log("cannot find OVA");
          document.querySelector(".ovaMain").style.display = "none";
        } else {
          OVA.map((m) => (ovaCards += showAnimes(m)));
        }
        if (!TV) {
          console.log("cannot find TV");
          document.querySelector(".tvMain").style.display = "none";
        } else {
          TV.map((m) => (tvCards += showAnimes(m)));
        }
        if (Movie) {
          console.log("cannot find Movie");
          document.querySelector(".movieMain").style.display = "none";
        } else {
          Movie.map((m) => (movieCards += showAnimes(m)));
        }
        if (!Music) {
          console.log("cannot find Music");
          document.querySelector(".musicMain").style.display = "none";
        } else {
          Music.map((m) => (musicCards += showAnimes(m)));
        }
        if (!ONA) {
          console.log("cannot find ONA");
          document.querySelector(".onaMain").style.display = "none";
        } else {
          ONA.map((m) => (onaCards += showAnimes(m)));
        }

        specialContainer.innerHTML = specialCards;
        musicContainer.innerHTML = musicCards;
        onaContainer.innerHTML = onaCards;
        ovaContainer.innerHTML = ovaCards;
        tvContainer.innerHTML = tvCards;
        movieContainer.innerHTML = movieCards;

        console.log(animeCategory);
        detailProcessEps();
        console.log(animes);
      });
  }
});
function showAnimes(m) {
  return `
  <div class="movieBox">
  <img src="${m.images.jpg.image_url}" style="height: 250px; width: 200px"> 
      <h4 style="max-width:150px; min-width:100px" class="title">${m.title.length > 20 ? (m.title = m.title.substring(0, 20) + "...") : m.title}</h4>
      <p>${m.episodes} Episodes</p>
      <p class="genres">${m.genres
        .map((genre) => {
          return `<span>${genre.name}</span>`;
        })
        .join(" ")}</p>
        <button class="epsBtn" data-idmal="${m.mal_id}">Show Episode</button>
      </div>
      `;
}

function detailProcessEps() {
  const detailEpsBtn = document.querySelectorAll(".epsBtn");
  const epsContainer = document.querySelector(".epsContainer");
  detailEpsBtn.forEach((btn) => {
    btn.addEventListener("click", function () {
      const idmal = this.dataset.idmal;
      fetch("https://api.jikan.moe/v4/anime/" + idmal + "/videos/episodes")
        .then((response) => response.json())
        .then((response) => {
          const episodes = response.data;
          let epsList = "";
          episodes.forEach((m) => {
            epsList += showEps(m);
          });
          epsContainer.innerHTML = epsList;
        });
    });
  });
}
function showEps(m) {
  return `<div class="epsBox">

  <img src="${m.images.jpg.image_url}">

  <h2>${m.episode} : ${m.title}</h2>
</div>`;
}
// function showEpsProcess() {}

// // const imgUrl = animes.map((url) => console.log(url.images.jpg.large_image_url));
// // console.log(imgUrl);
