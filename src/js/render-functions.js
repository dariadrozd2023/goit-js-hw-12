import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import * as Pixibay from '/js/pixabay-api';

const refs = {
  formSearch: document.getElementById('formSearch'),
  inputSearch: document.getElementById('inputSearch'),
  btnSearch: document.getElementById('btnSearch'),
  galleryList: document.querySelector('.js-ImagesCart'),
  loader: document.querySelector('.loader'),
};

refs.formSearch.addEventListener('submit', onBtnSearch);

const lightbox = new SimpleLightbox('.js-ImagesCart a', {
  captionsData: 'alt',
  captionDelay: 250,
});


export function onBtnSearch(event) {
  event.preventDefault();

  if (!Pixibay.checkInput()) {
    return;
  }
refs.galleryList.innerHTML = '';
  const URL_SEARCH_IMAGES = 'https://pixabay.com/api/';
  const API_KEY = '43910002-4f8293575df59775d1c0606c1';
  const inputValue = refs.inputSearch.value.trim();
  

  const params = new URLSearchParams({
    key: API_KEY,
    q: inputValue,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    lang: 'en',
  });
  
  refs.loader.style.display = 'block';

  fetch(`${URL_SEARCH_IMAGES}?${params}`)
    .then(res => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.json();
    })
    .then(data => {
      if (data.hits.length === 0) {
        iziToast.show({
          message: 'Sorry, there are no images matching your search query. Please, try again!',
          timeout: 5000,
          backgroundColor: '#EF4040',
        });
        return;
      }
      refs.galleryList.innerHTML = markUpSearchImg(data.hits);
      lightbox.refresh();
    })
    .catch(error => {
      console.log(error);
      iziToast.show({
        message: 'Something went wrong. Please, try again later.',
        timeout: 5000,
        backgroundColor: '#EF4040',
      });
    })
    .finally(() => {
      refs.loader.style.display = 'none';
      refs.formSearch.reset()
    });
}

function markUpSearchImg(arr) {
  return arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `
          <li class="js-list">
              <a href="${largeImageURL}"><img class="js-image" src="${webformatURL}" alt="${tags}" /></a>
              <ul class="js-dates">
                  <li class="js-likes">Likes: ${likes}</li>
                  <li class="js-views">Views: ${views}</li>
                  <li class="js-comments">Comments: ${comments}</li>
                  <li class="js-downloads">Downloads: ${downloads}</li>
              </ul>
          </li>
      `
    )
    .join('');
}


