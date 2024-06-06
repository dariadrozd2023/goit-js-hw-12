import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import * as Pixibay from '/js/pixabay-api';
import axios from 'axios';

const refs = {
  formSearch: document.getElementById('formSearch'),
  inputSearch: document.getElementById('inputSearch'),
  btnSearch: document.getElementById('btnSearch'),
  galleryList: document.querySelector('.js-ImagesCart'),
  loader: document.querySelector('.loader'),
  btnLoadMore: document.getElementById('btnLoadMore'),
};

refs.formSearch.addEventListener('submit', onBtnSearch);
refs.btnLoadMore.addEventListener('click', loadImgMore);

const lightbox = new SimpleLightbox('.js-ImagesCart a', {
  captionsData: 'alt',
  captionDelay: 250,
});

const URL_SEARCH_IMAGES = 'https://pixabay.com/api/';
const API_KEY = '43910002-4f8293575df59775d1c0606c1';

let page = 1;
let inputValue = '';

function checkInput() {
  const input = refs.inputSearch.value.trim();
  if (input === '') {
    iziToast.show({
      message: 'Please, enter a search query!',
      timeout: 5000,
      backgroundColor: '#EF4040',
    });
    return false;
  }
  return true;
}

export function onBtnSearch(event) {
  event.preventDefault();

  if (!checkInput()) {
    return;
  }

  inputValue = refs.inputSearch.value.trim();
  refs.galleryList.innerHTML = '';
  refs.loader.style.display = 'block';
  page = 1; 

  getImages();
}

async function getImages() {
  try {
    const response = await axios.get(URL_SEARCH_IMAGES, {
      params: {
        key: API_KEY,
        q: inputValue,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        lang: 'en',
        page: page,
        per_page: 15,
      },
    });

    const data = response.data;

    if (data.hits.length === 0) {
      iziToast.show({
        message: 'Sorry, there are no images matching your search query. Please, try again!',
        timeout: 5000,
        backgroundColor: '#EF4040',
      });
      refs.btnLoadMore.style.display = 'none';
    } else {
    
      if (page === 1) {
        refs.galleryList.innerHTML = markUpSearchImg(data.hits);
      } else {
        refs.galleryList.insertAdjacentHTML('beforeend', markUpSearchImg(data.hits));

        smoothScroll();
      }
      lightbox.refresh();


      if (page * 15 >= data.totalHits) {
        refs.btnLoadMore.style.display = 'none';
      } else {
        refs.btnLoadMore.style.display = 'block';
      }
    }
    return data.hits;
  } catch (error) {
    console.error(error);
    iziToast.show({
      message: 'Something went wrong. Please, try again later.',
      timeout: 5000,
      backgroundColor: '#EF4040',
    });
  } finally {
    refs.loader.style.display = 'none';
    refs.formSearch.reset();
  }
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
function smoothScroll() {
  const { height: cardHeight } = document.querySelector('.js-list').getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}


async function loadImgMore() {
  page += 1;

  try {
    const data = await getImages();
    refs.galleryList.insertAdjacentHTML('beforeend', markUpSearchImg(data));
  } catch (error) {
    console.error(error.message);
    iziToast.show({
      message: 'Something went wrong. Please, try again later.',
      timeout: 5000,
      backgroundColor: '#EF4040',
    });
  }
}
