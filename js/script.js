// RickTastic MortyVerse Version 1.0
// Copyright 2021
// Michael Egan

// Find search input by ID & store query in variable
const searchCharacter = document.getElementById('searchCharacter');
// Find search button by ID, store in variable for 'eventlistner'
const searchButton = document.getElementById('searchButton');

// Find refine search button by ID in order to modify classList
const refineResults = document.getElementById('refine-results');
// Find select menus by IDs, store in variables for 'eventlistner' & values
const gender = document.getElementById('gender');
const species = document.getElementById('species');
const lifeStatus = document.getElementById('status');

// Find reset button by ID in order to clear variables & reload page
const resetButton = document.getElementById('reset-btn');

// Find placeholder DIV by ID to return dynamic error alert
const noResultsDiv = document.getElementById('no-results');
// Find placeholder DIV by ID to return dynamic card results
const resultsDiv = document.getElementById('results');

// Find page navigation elements by ID and save to variables
const pageNav = document.getElementById('page-nav');
const nextPage = document.getElementById('next-page');
const prevPage = document.getElementById('prev-page');

// Define variables globally to access/modify in required functions
let info = null;
let character = "";
let totalCharacters = null;
let totalPages = null;
let currentPage = 1;

// Listen for page load, retrieve last user search from storage.
window.addEventListener("load", function () {
  character = localStorage.getItem('charName');
  searchCharacter.value = character;
  
  // Obtain total # characters, load all card results from API
  getTotalCharacters();
  searchMultiverse(currentPage, character, gender.value, species.value, lifeStatus.value);
});

// Listen for search button click & call function to connect to API
searchButton.addEventListener('click', function () {
  character = searchCharacter.value;  
  resetQueryString();
  localStorage.setItem("charName", character);  // Store user query for next session
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

// Event listener to reset search variables and reload site page
resetButton.addEventListener('click', function () {
  resetQueryString();
  location.reload();
});

// Previous page button event listener - generate next page of results
prevPage.addEventListener('click', function () {
  if (info.prev) {
    currentPage--;
    searchMultiverse(currentPage, character, gender.value, species.value, lifeStatus.value);
    // Smooth navigation transition to top of site
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
});

// Next page button event listener - generate next page of results
nextPage.addEventListener('click', function () {
  if (info.next) {
    currentPage++;
    searchMultiverse(currentPage, character, gender.value, species.value, lifeStatus.value);
    // Smooth navigation transition to top of site
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
});

// Asynchronous function using query inputs to connect to API and return results
async function searchMultiverse(currentPage, charName, genderType, speciesType, lifeStatus) {
  const response = await fetch(`https://rickandmortyapi.com/api/character?page=${currentPage}&name=${charName}&gender=${genderType}&species=${speciesType}&status=${lifeStatus}`);
  const json = await response.json();

  // Call function to dynamically generate results with json data from API
  displayResults(json);

  // If statement to check error handling for page navigation display
  if (json.error) {
    displayPageNav(currentPage);
  } else {
    info = json.info;
    totalPages = json.info.pages;
    displayPageNav(info.pages);
  }
}

// Function to dynamically generate page results
function displayResults(data) {
  // Clear previous results for new character 'cards'
  noResultsDiv.innerHTML = "";
  resultsDiv.innerHTML = "";

  // If no results found, dynamically generate alert to user
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
    noResultsDiv.append(alertNone);  // Output alert to the page

  } else {
    // For each result, dynamically generate a character 'card'
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

      newCard.className = "d-inline-block trading-card";  // Assign class styles to each 'card'
      resultsDiv.append(newCard);  // Output each 'card' to page
    });

    // Card click flip functionality - for loop creates array for all querySelectors' generated
    var cards = document.querySelectorAll('.flip-card-inner');
    for (let i = 0; i < cards.length; i++) {
      cards[i].addEventListener('click', function () {
        cards[i].classList.toggle('is-flipped');
      });
    }
  }
}

// Function to obtain the total amount of characters to insert on cards
async function getTotalCharacters() {
  const response = await fetch(`https://rickandmortyapi.com/api/character`);
  const json = await response.json();
  totalCharacters = json.info.count;
}

// Function displays / hides pagination buttons & toggles disabled states
function displayPageNav(pages) {
  if (pages > 1) {
    pageNav.style.display = "block";
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
    pageNav.style.display = "none";
  }
}

// Function to clear dynamic loaded page content upon user starting new search
function resetQueryString() {
  resultsDiv.innerHTML = "";
  noResultsDiv.innerHTML = "";
  localStorage.setItem("charName", "");
  gender.value = "";
  species.value = "";
  lifeStatus.value = "";
  refineResults.classList = "collapse";
  currentPage = 1;
}