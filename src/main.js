import * as Render from './js/render-functions';
import * as Pixibay from './js/pixabay-api';

const refs = {
  formSearch: document.getElementById('formSearch'),
  inputSearch: document.getElementById('inputSearch'),
  btnSearch: document.getElementById('btnSearch'),
  galleryList: document.querySelector('.js-ImagesCart'),
  loader: document.querySelector('.loader'),

};

refs.formSearch.addEventListener('submit', Pixibay.submitSearch);
refs.inputSearch.addEventListener('input', Pixibay.checkInput);
refs.btnSearch.addEventListener('click', Render.onBtnSearch);
