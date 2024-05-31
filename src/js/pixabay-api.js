import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';


const refs = {
    formSearch: document.getElementById('formSearch'),
    inputSearch: document.getElementById('inputSearch'),
    btnSearch: document.getElementById('btnSearch'),
    galleryList: document.querySelector('.js-ImagesCart'),
    loader: document.querySelector('.loader'),

  };

  
  export function checkInput() {
    const inputValue = refs.inputSearch.value.trim();
    const placeholderValue = refs.inputSearch.placeholder;
  
    if (inputValue === '' || inputValue === placeholderValue) {
      iziToast.show({
        message: 'Please, enter the name of the picture you are looking for',
        timeout: 5000,
        backgroundColor: '#a0cdde',
      });
  
      refs.btnSearch.disabled = true; // робимо кнопку неактивною
      return false;
    } else {
      refs.btnSearch.disabled = false; // робимо кнопку активною у разі успіху
      return true;
    }
  }
  // Додаємо обробники подій до інпуту для очищення та відновлення placeholder
refs.inputSearch.addEventListener('focus', () => {
  refs.inputSearch.placeholder = ''; // Очищаємо placeholder при фокусі
});

refs.inputSearch.addEventListener('blur', () => {
  if (refs.inputSearch.value.trim() === '') {
    refs.inputSearch.placeholder = 'Search images...'; // Відновлюємо placeholder при втраті фокуса, якщо інпут порожній
  }
});
 