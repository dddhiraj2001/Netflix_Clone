const global = {
    currentPage : window.location.pathname,
    search : {
        term : '',
        type: '',
        page:1,
        totalPages:1,
        totalResults:0,
    },
    api:{
        apiKey: '82c585f6b361456076f09b7f31d3ebe0',
        apiUrl: 'https://api.themoviedb.org/3/'
    }
};

const displayPopularMovies = async()=>{

    const {results} = await fetchDataFromAPI('movie/popular');
    
    results.forEach(movie => {
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = ` 
        <a href="movie-details.html?id=${movie.id}">
        ${movie.poster_path? `<img
        src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
        class="card-img-top"
        alt="${movie.title}"
      />`:`<img
      src="images/no-image.jpg"
      class="card-img-top"
      alt="${movie.title}"
    />`}
      </a>
      <div class="card-body">
        <h5 class="card-title">${movie.title}</h5>
        <p class="card-text">
          <small class="text-muted">Release:${movie.release_date}</small>
        </p>
      </div>`
      document.getElementById('popular-movies').appendChild(div)
    })
    

    // console.log(results)
}
const displayPopularShows = async()=>{

    const {results} = await fetchDataFromAPI('tv/popular');
    
    results.forEach(show => {
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = ` 
        <a href="tv-details.html?id=${show.id}">
        ${show.id? `<img
        src="https://image.tmdb.org/t/p/w500${show.poster_path}"
        class="card-img-top"
        alt="${show.name}"
      />`:`<img
      src="images/no-image.jpg"
      class="card-img-top"
      alt="${show.name}"
    />`}
      </a>
      <div class="card-body">
        <h5 class="card-title">${show.name}</h5>
        <p class="card-text">
          <small class="text-muted">Air Date:${show.first_air_date}</small>
        </p>
      </div>`
      document.getElementById('popular-shows').appendChild(div)
    })
    

    // console.log(results)
}
const search = async ()=>{
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    global.search.type = urlParams.get('type');
    global.search.term = urlParams.get('search-term');


    if(global.search.term!=='' && global.search.term!==null){
        const {results,total_pages,page, total_results} = await searchDataFromAPI();

        global.search.page = page;
        global.search.totalPages = total_pages
        global.search.totalResults = total_results
        if(results.length===0){
            showAlert('There are No results');
            return;
        }

        displaySearchResults(results);
        document.querySelector('#search-term').value = '';
        
    }else{
        showAlert('PLease enter a search term','error');
    }
    
}

const displaySearchResults = (results) =>{
    document.getElementById('search-results').innerHTML = '';
    document.getElementById('search-results-heading').innerHTML = '';
    document.getElementById('pagination').innerHTML = '';

    console.log(results)
    results.forEach(result => {
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = ` 
        <a href="${global.search.type}-details.html?id=${result.id}">
        ${result.poster_path? `<img
        src="https://image.tmdb.org/t/p/w500/${result.poster_path}"
        class="card-img-top"
        alt="${global.search.type === 'movie'? result.title : result.name}"
      />`:`<img
      src="images/no-image.jpg"
      class="card-img-top"
      alt="${global.search.type === 'movie'? result.title : result.name}"
    />`}
      </a>
      <div class="card-body">
        <h5 class="card-title">${global.search.type === 'movie'? result.title : result.name}</h5>
        <p class="card-text">
          <small class="text-muted">Release:${global.search.type === 'movie'? result.release_date : result.first_air_date}</small>
        </p>
      </div>`
      document.querySelector('#search-results-heading').innerHTML = `
      <h2>${results.length} of ${global.search.totalResults}</h2>
      Results for ${global.search.term}`
      document.getElementById('search-results').appendChild(div)
    })
    displayPagination()


}

const displayPagination = () => {
    const div = document.createElement('div');
    div.classList.add('pagination');
    div.innerHTML = `
    <button class="btn btn-primary" id="prev">Prev</button>
    <button class="btn btn-primary" id="next">Next</button>
    <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>`
    document.getElementById('pagination').appendChild(div);

    if(global.search.page === 1){
        document.querySelector('#prev').disabled = true;
    }
    if(global.search.page === global.search.totalPages){
        document.querySelector('#next').disabled = true;
    }

    document.querySelector('#next').addEventListener('click', async () =>{
        global.search.page++;
        const {results,total_pages} = await searchDataFromAPI();
        displaySearchResults(results);
    })
    document.querySelector('#prev').addEventListener('click', async () =>{
        global.search.page--;
        const {results,total_pages} = await searchDataFromAPI();
        displaySearchResults(results);
    })
}
const displaySlider = async ()=>{
    const {results} = await fetchDataFromAPI('movie/now_playing');
    results.forEach((movie)=>{
        const div = document.createElement('div');
        div.classList.add('swiper-slide');
        div.innerHTML = `
        <a href="movie-details.html?id=${movie.id}">
          <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
        </a>
        <h4 class="swiper-rating">
          <i class="fas fa-star text-secondary"></i>  ${movie.vote_average.toFixed(1)}/ 10
        </h4>
      `;
      document.querySelector('.swiper-wrapper').appendChild(div);
      initSwiper();
    })
    
    
    
}

function initSwiper(){
    const swiper = new Swiper('.swiper',{slidesPerView:1,spaceBetween : 30,
    freeMode:true,loop:true,autoplay:{
        delay:4000,
        disableOnInteraction : false
    },breakpoints:{500:{slidesPerView:2},700:{slidesPerView:3},1200:{slidesPerView:4},}}
    );
}

const showTVDetails = async () =>{
    const showID = window.location.search.split('=')[1]
    const showDetails = await fetchDataFromAPI(`tv/${showID}`);
    console.log(showDetails)
    displayBackgroundImage('tv',showDetails.backdrop_path);
    const div = document.createElement('div');
    
    div.innerHTML = `<div class="details-top">
    <div>
    ${showDetails.poster_path? `<img
    src="https://image.tmdb.org/t/p/w500${showDetails.poster_path}"
    class="card-img-top"
    alt="${showDetails.name}"
  />`:`<img
  src="images/no-image.jpg"
  class="card-img-top"
  alt="${showDetails.name}"
/>`}
    </div>
    <div>
      <h2>${showDetails.name}</h2>
      <p>
        <i class="fas fa-star text-primary"></i>
        ${showDetails.vote_average.toFixed(1)}/ 10
      </p>
      <p class="text-muted">Last Air Date: ${showDetails.last_air_date}</p>
      <p>
        ${showDetails.overview}
      </p>
      <h5>Genres</h5>
      <ul class="list-group">
        ${showDetails.genres.map((genre)=>`<li>${genre.name}</li>`).join('')}
      </ul>
      <a href="${showDetails.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
    </div>
  </div>
  <div class="details-bottom">
    <h2>Show Info</h2>
    <ul>
      <li><span class="text-secondary">Number of Episodes:</span> ${showDetails.number_of_episodes}</li>
      <li><span class="text-secondary">Last Episode to Air:</span> ${showDetails.last_episode_to_air.name}</li>
      <li><span class="text-secondary">Status:</span> ${showDetails.status}</li>
    </ul>
    <h4>Production Companies</h4>
    <div class="list-group">${showDetails.production_companies.map((company)=>`${company.name}, `).join('')}</div>
  </div>`
  console.log(div.innerHTML)
  document.querySelector('#show-details').appendChild(div);
}

const showMovieDetails = async () =>{
    const movieID = window.location.search.split('=')[1]
    const movieDetails = await fetchDataFromAPI(`movie/${movieID}`);
    console.log(movieDetails)
    displayBackgroundImage('movie',movieDetails.backdrop_path);
    const div = document.createElement('div');
    
    div.innerHTML = `<div class="details-top">
    <div>
    ${movieDetails.poster_path? `<img
    src="https://image.tmdb.org/t/p/w500${movieDetails.poster_path}"
    class="card-img-top"
    alt="${movieDetails.title}"
  />`:`<img
  src="images/no-image.jpg"
  class="card-img-top"
  alt="${movieDetails.title}"
/>`}
    </div>
    <div>
      <h2>${movieDetails.title}</h2>
      <p>
        <i class="fas fa-star text-primary"></i>
        ${movieDetails.vote_average.toFixed(1)}/ 10
      </p>
      <p class="text-muted">Release Date: ${movieDetails.release_date}</p>
      <p>
        ${movieDetails.overview}
      </p>
      <h5>Genres</h5>
      <ul class="list-group">
        ${movieDetails.genres.map((genre)=>`<li>${genre.name}</li>`).join('')}
      </ul>
      <a href="${movieDetails.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
    </div>
  </div>
  <div class="details-bottom">
    <h2>Movie Info</h2>
    <ul>
      <li><span class="text-secondary">Budget:</span> $${addCommas(movieDetails.budget)}</li>
      <li><span class="text-secondary">Revenue:</span> $${addCommas(movieDetails.revenue)}</li>
      <li><span class="text-secondary">Runtime:</span> ${movieDetails.runtime}</li>
      <li><span class="text-secondary">Status:</span> ${movieDetails.release_date}</li>
    </ul>
    <h4>Production Companies</h4>
    <div class="list-group">${movieDetails.production_companies.map((company)=>`${company.name}, `).join('')}</div>
  </div>`
  console.log(div.innerHTML)
  document.querySelector('#movie-details').appendChild(div);
    
}
const displayBackgroundImage = (type,backdrop_path) =>{
    const overLayDiv = document.createElement('div');
    overLayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backdrop_path})`;
    overLayDiv.style.backgroundSize = 'cover';
    overLayDiv.style.backgroundPosition = 'center';
    overLayDiv.style.backgroundRepeat = 'no-repeat';
    overLayDiv.style.height = '100vh';
    overLayDiv.style.width = '100vw';
    overLayDiv.style.position = 'absolute';
    overLayDiv.style.top = '0';
    overLayDiv.style.left = '0';
    overLayDiv.style.zIndex = '-1';
    overLayDiv.style.opacity = '0.1';

    if(type === 'movie'){
        document.querySelector('#movie-details').appendChild(overLayDiv);
    }else{
        document.querySelector('#show-details').appendChild(overLayDiv);
    }
}


const showSpinner = () =>{
    document.querySelector('.spinner').classList.add('show')
}
const hideSpinner = () =>{
    document.querySelector('.spinner').classList.remove('show')
}

const searchDataFromAPI = async () => {
    const API_KEY = global.api.apiKey;
    const API_URL = global.api.apiUrl;
    showSpinner();

    const response = await fetch(`${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-US&query=${global.search.term}&page=${global.search.page}`);

    const data = await response.json();

    hideSpinner();

    return data;


}
const fetchDataFromAPI = async (endpoint) => {
    const API_KEY = global.api.apiKey;
    const API_URL = global.api.apiUrl;
    showSpinner();

    const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`);

    const data = await response.json();

    hideSpinner();

    return data;


}

const highlightActiveLink = () =>{
    const headerTabs = document.querySelectorAll('.nav-link')
    headerTabs.forEach((item)=>{
        if(item.getAttribute('href')===global.currentPage){
            item.classList.add('.active');
        }
    })

}
function showAlert(message,className='error'){
    const alertEl = document.createElement('div');
    alertEl.classList.add('alert',className)
    alertEl.appendChild(document.createTextNode(message));
    document.getElementById('alert').appendChild(alertEl)
    setTimeout(()=>{alertEl.remove()},3000)

}

const addCommas = (number) =>{
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

}

function init(){
    
    switch(global.currentPage){
        case '/':
        case '/index.html':
            displaySlider();
            displayPopularMovies();
            break;
        case '/shows.html':
            displayPopularShows();
            break;
        case '/movie-details.html':
            showMovieDetails();
            break;
        case '/tv-details.html':
            showTVDetails();
            break
        case '/search.html':
            search();
            break
        
        
    }
    highlightActiveLink();
    
}

document.addEventListener('DOMContentLoaded',init)
