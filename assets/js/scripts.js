// Assign our DOM elements to variables
const cardContainer = document.querySelector(".card-container");
const favoritesContainer = document.querySelector(".favorites-container");
const movieForm = document.getElementById("movie-form");
const movieTitle = document.getElementById("movie-title");
const movieDirector = document.getElementById("movie-director");
const moviePoster = document.getElementById("movie-poster");
const movieRating = document.getElementById("movie-rating");
const moviePlot = document.getElementById("movie-plot");
const movieId = document.getElementById("movie-id");
const saveFavorite = document.getElementById("save-favorite");
let currentMovie = {};

/**
 * @description - This function deletes the favorite based on id.
 * @param  {string} movieIamDeleting
 */
const deleteFavorite = (movieIamDeleting) => {
  // TODO: grabs the localstorage and parses the string into an array
  const favorites = JSON.parse(localStorage.getItem("favorites"));
  // TODO: checks if the favorites variable is truthy and if the movieId exists
  if (favorites && movieId) {

  // TODO: filter the array and return the array without the movieId
  const newFavorites = favorites.filter((movie) => movie.imdbID !== movieIamDeleting);

  // TODO: set the localstorage to the updated array
  localStorage.setItem("favorites", JSON.stringify(newFavorites));

  // TODO: remove the favorites container
  favoritesContainer.innerHTML = "";

  // TODO: get the favorites again
  getFavorites();
}
};

/**
 * @description - This function saves the favorite to the localstorage.
 * @param  {object} movieObject
 */
const setFavorite = (movieObject) => {
  const favorites = JSON.parse(localStorage.getItem("favorites"));

  if (favorites) {
    // TODO: spreads in the existing favorites array and adds the new favorite object to the array then stringifies it and sets the localstorage
    localStorage.setItem("favorites", JSON.stringify([...favorites, movieObject]))
  } else {
    // TODO: sets the localstorage to the new favorite object if no favorites exist
    localStorage.setItem("favorites", JSON.stringify([movieObject]));
  }

  // TODO: remove the favorites container
  favoritesContainer.innerHTML = "";
  // TODO: get the favorites again
  getFavorites();
};

/**
 * @description - This function gets the favorites from the localstorage, parses and loops through the array to render the UI.
 */
const getFavorites = () => {
  const favorites = JSON.parse(localStorage.getItem("favorites"));
  if (favorites) {
    // loop through the favorites array and render the UI
    favorites.forEach((movie) => {
      // TODO: create a new div element
      const movieCard = document.createElement("div");
      // TODO: use object destructuring to get the movie properties
      const {Title, Director, Poster, Rated, Plot, imdbID} = movie;
      
      movieCard.classList.add("card", "favorites", "m-2");
      movieCard.innerHTML = `
        <div class="card-body text-center">
          <h3 class="card-title">${Title}</h3>
          <img src="${Poster}" alt="${Title} poster" class="card-poster">
          <p class="card-director">Director: ${Director}</p>
          <p class="card-rating">Rating: ${Rated}</p>
          <p class="card-plot text-left">Plot: ${Plot}</p>
          <p class="card-plot text-left">ImdbId: ${imdbID}</p>
          <button class="btn btn-danger" data-movieid="${imdbID}" id="delete-favorite">Delete</button>
        </div>
      `;

      // TODO: append the new div to the favorites container
    favoritesContainer.appendChild(movieCard)
    });
  }
};

/**
 * @description - This function renders the movie data to the UI by injecting the DOM elements.
 * @param  {object} movieObj
 */
const renderMovieData = (movieObj) => {
  console.log(movieObj);

  // TODO: destructure the movieObj object
  const {Title, Director, Poster, Rated, Plot, imdbID} = movieObj;
  // Update the DOM elements with the movie data
  movieTitle.textContent = Title;
  movieDirector.textContent = Director;
  moviePoster.src = Poster;
  moviePoster.alt = Title;
  movieRating.textContent = Rated;
  moviePlot.textContent = Plot;
  movieId.textContent = imdbID;

  // show the movie card
  cardContainer.classList.remove("hidden");
};

/**
 * @description - This async function handles the form submission and calls the API to get the movie data.
 * @param  {string} movie
 */
const queryOMDB = async (movie) => {
  console.log(movie);
  // Async/Await is syntactic sugar for promises and will make working with asyncrhonous code easier.
  try {
    // the await keyword is used to wait for a promise to resolve before continuing.
    // TODO: fetch the data from the API and wait for the response
    const response = await fetch(`https://www.omdbapi.com/?apikey=trilogy&t=${movie}`);

    // TODO: await the response and store it in a variable as an object
    const json = await response.json();
    console.log(json);
    // we are returning the renderMovieData function with the json object as an argument.  The await response.json() parses the response into a JS Object.
    // technically we could just call the renderMovieData function and omit the return statement.
    return renderMovieData(json);
  } catch (error) {
    console.log(error);
    return error;
  }
};

/**
 * @description - This click event handler creates an object from the DOM elements and calls the setFavorite function.
 * @description - As we learn new ways to handle data we'll eventually use JS memory (state) to store the data instead of DOM elements.
 */
saveFavorite.addEventListener("click", (e) => {
  e.preventDefault(); // this prevents the form from refreshing the page

  // TODO: create an object from the DOM elements
  const movie = {
    Title: movieTitle.textContent,
    Director: movieDirector.textContent,
    Poster: moviePoster.src,
    Rated: movieRating.textContent,
    Plot: moviePlot.textContent,
    imdbID: movieId.textContent,
  };
  // TODO: call the setFavorite function with the movie object as an argument
  setFavorite(movie);
});

/**
 * @description - This submit event handler gets the value of the input field and calls the queryOMDB function.
 */
movieForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // gets the value of the input field and store it in a variable
  const movie = e.target.movieSearch;

  // validate input
  if (movie.value.length > 0) {
    console.log(movie.value);

    // remove class if valid
    movie.classList.remove("is-invalid");

    // TODO: call the queryOMDB function with the movie value as an argument
    queryOMDB(movie.value);
    // TODO: clear the input field
    movie.value = "";
  } else {
    // add class if invalid
    movie.classList.add("is-invalid");
  }
});

/**
 * @description - This click event handler deletes the favorite based on the id.
 * @description - Notice we have to use the event delegation pattern to listen for the click event on the favorites container since the data is dynamically rendered.
 */

// TODO: add event listener to delete favorites using event delegation
document.addEventListener("click", function(e){
  if(e.target && e.target.id === "delete-favorite"){
    console.log(e.target.dataset.movieid)
    deleteFavorite(e.target.dataset.movieid);
  }
});
// get the favorites on page load
getFavorites();
