const searchCharacter = document.getElementById('searchCharacter');
const searchButton = document.getElementById('searchButton');

const refineResults = document.getElementById('refine-results');
const gender = document.getElementById('gender');
const species = document.getElementById('species');
const lifeStatus = document.getElementById('status');

const noResultsDiv = document.getElementById('no-results');
const resultsDiv = document.getElementById('results');

const pageNav = document.getElementById('page-nav');

const nextPage = document.getElementById('next-page');
const prevPage = document.getElementById('prev-page');


let info = null;

let character = "";

let totalCharacters = null;
let totalPages = null;
let currentPage = 1;

window.addEventListener("load", function () {
  character = localStorage.getItem('charName');
  searchCharacter.value = character;

  getTotalCharacters();
  searchMultiverse(currentPage, character, gender.value, species.value, lifeStatus.value);
});

searchButton.addEventListener('click', function () {
  character = searchCharacter.value;
  resetQueryString();

  if (totalPages > 1) {
    pageNav.classList.toggle('visually-hidden');
  }

  localStorage.setItem("charName", character);
  searchMultiverse(currentPage, character, gender.value, species.value, lifeStatus.value);
});

// Event listener to refine gender of character query when changed
gender.addEventListener('change', function () {
  currentPage = 1;
  searchMultiverse(currentPage, character, gender.value, species.value, lifeStatus.value);

});

// Event listener to refine species of character query when changed
species.addEventListener('change', function () {
  currentPage = 1;
  searchMultiverse(currentPage, character, gender.value, species.value, lifeStatus.value);

});

// Event listener to refine life status of character query when changed
lifeStatus.addEventListener('change', function () {
  currentPage = 1;
  searchMultiverse(currentPage, character, gender.value, species.value, lifeStatus.value);

});

prevPage.addEventListener('click', function () {
  if (info.prev) {
    console.log('next');
    currentPage--;
    pageNav.classList.toggle('visually-hidden');
    searchMultiverse(currentPage, character, gender.value, species.value, lifeStatus.value);    
    window.scroll({
      top: 0, 
      left: 0, 
      behavior: 'smooth' 
    });
  }
});

nextPage.addEventListener('click', function () {
  if (info.next) {
    console.log('next');
    currentPage++;
    pageNav.classList.toggle('visually-hidden');
    searchMultiverse(currentPage, character, gender.value, species.value, lifeStatus.value);
    window.scroll({
      top: 0, 
      left: 0, 
      behavior: 'smooth' 
    });
  }
});

async function searchMultiverse(currentPage, charName, genderType, speciesType, lifeStatus) {
  const response = await fetch(`https://rickandmortyapi.com/api/character?page=${currentPage}&name=${charName}&gender=${genderType}&species=${speciesType}&status=${lifeStatus}`);
  const json = await response.json();

  displayResults(json);
  info = json.info;
  totalPages = json.info.pages;
  console.log('Multiverse ' + totalPages);
  pageNav.classList.toggle('visually-hidden');

  if (info.pages > 1) {
    if (!info.next) {
      nextPage.disabled = true;
    } else {
      nextPage.disabled = false;
    }
  
    if (!info.prev) {
      prevPage.disabled = true;
    } else {
      prevPage.disabled = false;
    }
  } else {
    pageNav.classList.toggle('visually-hidden');
  }
}

function displayResults(data) {
  noResultsDiv.innerHTML = "";
  resultsDiv.innerHTML = "";

  if (data.error) {
    let alertNone = document.createElement('div');
    alertNone.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
    <symbol id="exclamation-triangle-fill" fill="currentColor" viewBox="0 0 16 16">
      <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
    </symbol>
  </svg>
  
  <div class="alert alert-danger border-danger border-2 d-flex align-items-center" role="alert">
    <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Warning:"><use xlink:href="#exclamation-triangle-fill"/></svg>
    <div>
      No results found! Please enter a different search query.
    </div>
  </div>
    `;

    noResultsDiv.append(alertNone);
  
  } else {

    data.results.forEach(characterAvatar => {
      let newCard = document.createElement('div');
      newCard.innerHTML = `
      <div class="flip-card">
      <!-- Front of Trading Card -->
      <div class="flip-card-inner">
        <div class="flip-card-front text-center">
          <div class="flip-card-front-header">
            <span id="set-list">${characterAvatar.id}/${totalCharacters}</span><br />
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
            <img src="./img/2872625-min.jpg" alt="Space Background Image for Card">
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
                <p>Card ${characterAvatar.id} of ${totalCharacters}<br />
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
      cards[i].addEventListener('click', function() {
        cards[i].classList.toggle('is-flipped');
      });
    }
  }  
}

async function getTotalCharacters() {
  const response = await fetch(`https://rickandmortyapi.com/api/character`);
  const json = await response.json();
  totalCharacters = json.info.count;
}

function resetQueryString() {
  resultsDiv.innerHTML = "";
  noResultsDiv.innerHTML = "";
  gender.value = "";
  species.value = "";
  lifeStatus.value = "";
  refineResults.classList = "collapse";
  currentPage = 1;
}