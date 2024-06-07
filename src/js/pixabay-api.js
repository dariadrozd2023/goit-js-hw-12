import axios from 'axios';

const URL_SEARCH_IMAGES = 'https://pixabay.com/api/';
const API_KEY = '43910002-4f8293575df59775d1c0606c1';

export async function fetchImages(query, page, perPage) {
  try {
    const response = await axios.get(URL_SEARCH_IMAGES, {
      params: {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        lang: 'en',
        page: page,
        per_page: perPage,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
