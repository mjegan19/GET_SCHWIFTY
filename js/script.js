const searchCharacter = document.getElementById('searchCharacter');
const searchButton = document.getElementById('searchButton');
const resultsDiv = document.getElementById('results');
const pageNav = document.getElementById('page-nav');
const prevPage = document.getElementById('prev-page');
const nextPage = document.getElementById('next-page');
let info = null
let character = ""
let currentPage = 1
var cards = null;

window.addEventListener("load", function () {
  character = localStorage.getItem('enquiry')
  searchCharacter.value = character;
})

searchButton.addEventListener('click', function () {
  character = searchCharacter.value;
  resultsDiv.innerHTML = "";
  localStorage.setItem("enquiry", character)
  searchMultiverse(currentPage, character);
});


prevPage.addEventListener('click', function () {
  currentPage--
  searchMultiverse(currentPage, character);
})

nextPage.addEventListener('click', function () {
  if (info.next) {
    console.log('next');
    currentPage++
    searchMultiverse(currentPage, character);
    window.scroll({
      top: 0, 
      left: 0, 
      behavior: 'smooth' 
    });
  }
});

async function searchMultiverse(currentPage, enquiry) {
  const response = await fetch(`https://rickandmortyapi.com/api/character?page=${currentPage}&name=${enquiry}`);
  const json = await response.json();
  console.log(json);
  displayResults(json);
  info = json.info
  const totalPages = json.info.pages;
  if (!info.next) {
    nextPage.disabled = true;
  } else {
    nextPage.disabled = false;
  }
}

function displayResults(data) {
  resultsDiv.innerHTML = ""
  data.results.forEach(characterAvatar => {
    let newCard = document.createElement('div');
    newCard.innerHTML = `
    <div class="flip-card">
    <!-- Front of Trading Card -->
    <div class="flip-card-inner">
      <div class="flip-card-front text-center">
        <div class="flip-card-front-header">
          <span id="set-list">${characterAvatar.id}/671</span><br />
          <p id="char-name" class="char-name-header text-uppercase overflow-hidden">${characterAvatar.name}</p>
        </div>
        <img src="${characterAvatar.image}" alt="${characterAvatar.name}">
        <div class="flip-card-front-footer">
          <span>A U T O G R A P H</span>
        </div>
        <div class="flip-card-front-bottom">
          <span>EYEHOLES - <em>THE OMNIVERSE CEREAL</em></span>
        </div>
      </div>      
      <!-- Rear of Trading Card -->
      <div class="flip-card-rear text-center">
        <div class="flip-card-rear-bg">
          <img src="./img/2872625.jpg" alt="Space Background Image for Card">
          <div class="flip-card-rear-stats text-center">
            <span>Rick & Morty Trading Cards</span><br />
            <span class="char-name-header-rear text-uppercase overflow-hidden">${characterAvatar.name}</span><br />
            <span class="text-info bg-dark stats-header">STATUS:</span><br />
            <span class="stats-data lh-1 text-uppercase">${characterAvatar.status}</span><br />
            <span class="text-info bg-dark stats-header">SPECIES:</span><br />
            <span class="stats-data lh-1 text-uppercase">${characterAvatar.species}</span><br />
            <span class="text-info bg-dark stats-header">GENDER:</span><br />
            <span class="stats-data lh-1 text-uppercase">${characterAvatar.gender}</span><br />
            <span class="text-info bg-dark stats-header">ORIGIN:</span><br />
            <span class="stats-data lh-1 text-uppercase">${characterAvatar.origin.name}</span><br />
            <span class="text-info bg-dark stats-header">LOCATION:</span><br />
            <span class="stats-data lh-1 text-uppercase">${characterAvatar.location.name}</span><br />
            <span class="text-info bg-dark stats-header">EPISODE APPEARANCES:</span><br />
            <span class="stats-data lh-1 text-uppercase">${characterAvatar.episode.length}</span>
            <div class="flip-card-rear-footer">
              <p>Card ${characterAvatar.id} of 671<br />
              Wubba Lubba Dub Dub</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
    `;

    newCard.className = "d-inline-block trading-card";
    resultsDiv.append(newCard);
  });

  // Card flip click flip function - for loop creates array for all querySelectors' generated
  var cards = document.querySelectorAll('.flip-card-inner');
  for(let i = 0; i < cards.length; i++){
    cards[i].addEventListener( 'click', function() {
      cards[i].classList.toggle('is-flipped');
    });
  }
  
}

