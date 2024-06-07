export function markUpSearchImg(arr) {
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
