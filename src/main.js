import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { fetchImages } from './js/pixabay-api';
import { markUpSearchImg } from './js/render-functions';


const refs = {
  formSearch: document.getElementById('formSearch'),
  inputSearch: document.getElementById('inputSearch'),
  btnSearch: document.getElementById('btnSearch'),
  galleryList: document.querySelector('.js-ImagesCart'),
  loader: document.querySelector('.loader'),
  btnLoadMore: document.getElementById('btnLoadMore'),
  loaderNoMore: document.querySelector('.loaderNoMore'),
};

refs.formSearch.addEventListener('submit', onBtnSearch);
refs.btnLoadMore.addEventListener('click', loadImgMore);

const lightbox = new SimpleLightbox('.js-ImagesCart a', {
  captionsData: 'alt',
  captionDelay: 250,
});

let page = 1;
let inputValue = '';
let totalLoadedImages = 0;
let totalHits = 0;

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

export async function onBtnSearch(event) {
  event.preventDefault();

  if (!checkInput()) {
    return;
  }

  inputValue = refs.inputSearch.value.trim();
  refs.galleryList.innerHTML = '';
  refs.loader.style.display = 'block';
  refs.loaderNoMore.style.display = 'none';
  refs.btnLoadMore.style.display = 'none';
  totalLoadedImages = 0; // Скидаємо лічильник завантажених зображень
  page = 1; // Починаємо з першої сторінки

  await getImages(15); // Завантажуємо першу сторінку зображень
}

async function getImages(perPage) {
  try {
    const data = await fetchImages(inputValue, page, perPage);

    if (data.hits.length === 0) {
      iziToast.show({
        message: 'Sorry, there are no images matching your search query. Please, try again!',
        timeout: 5000,
        backgroundColor: '#EF4040',
      });
      refs.btnLoadMore.style.display = 'none';
      refs.loaderNoMore.style.display = 'block';
    } else {
      totalLoadedImages += data.hits.length;
      totalHits = data.totalHits;

      if (page === 1) {
        refs.galleryList.innerHTML = markUpSearchImg(data.hits);
      } else {
        refs.galleryList.insertAdjacentHTML('beforeend', markUpSearchImg(data.hits));
        // Прокрутка сторінки після завантаження нової групи зображень
        smoothScroll();
      }
      lightbox.refresh(); // Оновлення lightbox після завантаження нових зображень

      // Якщо немає більше результатів для завантаження, приховуємо кнопку "Load More" та показуємо повідомлення
      if (totalLoadedImages >= totalHits) {
        refs.btnLoadMore.style.display = 'none';
        refs.loaderNoMore.style.display = 'block';
        iziToast.show({
          message: "We're sorry, but you've reached the end of search results.",
          timeout: 5000,
          backgroundColor: '#EF4040',
        });
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
    const data = await getImages(15); // Завантажуємо 15 зображень при кожному натисканні "Load More"
    refs.galleryList.insertAdjacentHTML('beforeend', markUpSearchImg(data));
    lightbox.refresh(); // Оновлення lightbox після завантаження нових зображень
    // Прокрутка сторінки після завантаження нової групи зображень
    smoothScroll();
  } catch (error) {
    console.error(error.message);
    iziToast.show({
      message: 'Something went wrong. Please, try again later.',
      timeout: 5000,
      backgroundColor: '#EF4040',
    });
  }
}
