const searchCharacter = document.getElementById('searchCharacter');
const searchButton = document.getElementById('searchButton');
const resultsDiv = document.getElementById('results');
const pageNav = document.getElementById('page-nav');

const prevLink = document.getElementById('prev-link');
const nextLink = document.getElementById('next-link');

searchButton.addEventListener('click', function(){
  const character = searchCharacter.value;
  resultsDiv.innerHTML = "";
  searchMultiverse(character);
});

async function searchMultiverse(enquiry){
  let pageNum = 1;
  const response = await fetch(`https://rickandmortyapi.com/api/character?page=${pageNum}&name=${enquiry}`);
  const json = await response.json();

  displayResults(json);
}

function displayResults(data){
  data.results.forEach(characterAvatar => {
    let newCard = document.createElement('div');
    newCard.innerHTML = `
    <img src="${characterAvatar.image}" class="card-img-top" alt="${characterAvatar.name}">
    <div class="card-body">
    <h5 class="card-title">${characterAvatar.name}</h5>
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
    </div>
    `;
    
    newCard.className = "card d-inline-block trading-card";
    resultsDiv.append(newCard);
  });
}
