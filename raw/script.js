const inputKeyword = document.querySelector(".searchBox");
const genreName = document.querySelectorAll(".genreName");
const cariBtn = document.querySelector(".cariBtn");
cariBtn.addEventListener("click", function () {
  const apiUrl = "https://api.jikan.moe/v4/" + "anime?q=" + inputKeyword.value;
  const container = document.querySelector(".cardContainer");
  fetch(apiUrl)
    .then((response) => response.json())
    .then((response) => {
      const animes = response.data;
      // Loop data yang sudah di fetch dan simpan di variabel cards
      console.log(animes);
      let cards = "";
      animes.forEach((m) => (cards += showAnimes(m)));
      // masukan isi cards ke container html
      container.innerHTML = cards;
      const categorizedData = animes.reduce((acc, animes) => {
        if (!acc[animes.type]) {
          acc[animes.type] = [];
        }
        acc[animes.type].push(animes);
        return acc;
      }, {});
      // Variabel untuk menyimpan type anime
      //map anime sesuai type
      const { Movie } = categorizedData;
      Movie.map((movie) => movie);
      console.log(Movie);
      console.log(categorizedData);

      // Foreach hasil dari map diatas dan letakan di variabel untuk menyimpan type anime
      // Jika ingin rapi hasil forEach bisa di letakan di function
      detailProcessEps();
    });
});
function showAnimes(m) {
  return `<div class="cardBox">
  <img src="${m.images.jpg.image_url}"> 
      <h2>${m.title}</h2>
      <p>${m.episodes} Episodes</p>
      <p class="genreName">${m.genres
        .map((genre) => {
          return `<span class="genre">${genre.name}</span>`;
        })
        .join(" ")}</p>
        <p>${m.synopsis}</p>
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

// const imgUrl = animes.map((url) => console.log(url.images.jpg.large_image_url));
// console.log(imgUrl);
