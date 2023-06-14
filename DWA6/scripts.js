

import { books, authors, genres, BOOKS_PER_PAGE } from './data.js'

/**
 * @type {number} page - page number
 */

/**
 * @type {number} BOOKS_PER_PAGE - Number of books that will be displayed per page
 */

let page = 1;
let matches = books
let range = [0, 36];

/**
 * The createBookPreview function takes in an object as a string and returns an element. 
 * This element contains the name of the author, the id, the image of the book, and title of the book and they will be displayed in the web page.
 * 
 * @param {Object} book - object containing details of a book
 * @param {String} book.author - This is the name of the author.
 * @param {String} book.id - This is the id of the author.
 * @param {String} book.image - This is the url of the image of the book.
 * @param {String} book.title - This is the title of the book.
 * @returns {element}
 */

function createBookPreview({ author, id, image, title }) {
  const element = document.createElement('button');
  element.classList = 'preview';
  element.setAttribute('data-preview', id);

  element.innerHTML = `
    <img
      class="preview__image"
      src="${image}"
    />
    
    <div class="preview__info">
      <h3 class="preview__title">${title}</h3>
      <div class="preview__author">${authors[author]}</div>
    </div>
  `;

  return element;
}

let fragment = document.createDocumentFragment();
let extracted = matches.slice(range[0], range[1]);
  
for (const { author, image, title, id } of extracted) {
  const preview = createBookPreview({
    author,
    id,
    image,
    title,
  });

  fragment.appendChild(preview);

}

document.querySelector('[data-list-items]').appendChild(fragment)



/**
 * The optionsFragment function creates the first or default option on the search bars for both genres search option and authors search option.
 * @param {Object} items - Takes in an object containing a list of author names or types of genres. 
 * @param {String} firstOptionText - The default text that should be displayed on the genres search option or authors search option.
 * @returns {fragment}
 */

function optionsFragment(items, firstOptionText) {
  const fragment = document.createDocumentFragment();

  const defaultOptionElement = document.createElement('option');
  
  defaultOptionElement.innerText = firstOptionText;
  fragment.appendChild(defaultOptionElement);

  for (const [id, name] of Object.entries(items)) {
    const element = document.createElement('option');
    element.value = id;
    element.innerText = name;
    fragment.appendChild(element);
  }

  return fragment;
}

const genreOptions = optionsFragment(genres, 'All Genres');
document.querySelector('[data-search-genres]').appendChild(genreOptions);

const authorsOptions = optionsFragment(authors, 'All Authors');
document.querySelector('[data-search-authors]').appendChild(authorsOptions);


/**
 * This function sets the theme of the website based on the user preference.
 * @returns {void}
 */

function setThemeBasedOnColorScheme() {
  const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  const themeValue = prefersDarkMode ? 'night' : 'day';
  const darkColor = prefersDarkMode ? '255, 255, 255' : '10, 10, 20';
  const lightColor = prefersDarkMode ? '10, 10, 20' : '255, 255, 255';

  document.querySelector('[data-settings-theme]').value = themeValue;
  document.documentElement.style.setProperty('--color-dark', darkColor);
  document.documentElement.style.setProperty('--color-light', lightColor);
}

setThemeBasedOnColorScheme();

document.querySelector('[data-list-button]').innerText = `Show more (${books.length - BOOKS_PER_PAGE})`
document.querySelector('[data-list-button]').disabled = (matches.length - (page * BOOKS_PER_PAGE)) <= 0

document.querySelector('[data-list-button]').innerHTML = `
    <span>Show more</span>
    <span class="list__remaining"> (${matches.length - [page * BOOKS_PER_PAGE] > 0 ? matches.length - [page * BOOKS_PER_PAGE] : 0})</span>
`
document.querySelector('[data-search-cancel]').addEventListener('click', () => {
    document.querySelector('[data-search-overlay]').open = false
})

document.querySelector('[data-settings-cancel]').addEventListener('click', () => {
    document.querySelector('[data-settings-overlay]').open = false
})

document.querySelector('[data-header-search]').addEventListener('click', () => {
    document.querySelector('[data-search-overlay]').open = true 
    document.querySelector('[data-search-title]').focus()
})

document.querySelector('[data-header-settings]').addEventListener('click', () => {
    document.querySelector('[data-settings-overlay]').open = true 
})

document.querySelector('[data-list-close]').addEventListener('click', () => {
    document.querySelector('[data-list-active]').open = false
})

document.querySelector('[data-settings-form]').addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const { theme } = Object.fromEntries(formData)

    if (theme === 'night') {
        document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
        document.documentElement.style.setProperty('--color-light', '10, 10, 20');
    } else {
        document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
        document.documentElement.style.setProperty('--color-light', '255, 255, 255');
    }
    
    document.querySelector('[data-settings-overlay]').open = false
})

document.querySelector('[data-search-form]').addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const filters = Object.fromEntries(formData)
    const result = []

    for (const book of books) {
        let genreMatch = filters.genre === 'any'

        for (const singleGenre of book.genres) {
            if (genreMatch) break;
            if (singleGenre === filters.genre) { genreMatch = true }
        }

        if (
            (filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase())) && 
            (filters.author === 'any' || book.author === filters.author) && 
            genreMatch
        ) {
            result.push(book)
        }
    }

    page = 1;
    matches = result

    if (result.length < 1) {
        document.querySelector('[data-list-message]').classList.add('list__message_show')
    } else {
        document.querySelector('[data-list-message]').classList.remove('list__message_show')
    }

    document.querySelector('[data-list-items]').innerHTML = ''
    const newItems = document.createDocumentFragment()

    for (const { author, id, image, title } of result.slice(0, BOOKS_PER_PAGE)) {
        const element = document.createElement('button')
        element.classList = 'preview'
        element.setAttribute('data-preview', id)
    
        element.innerHTML = `
            <img
                class="preview__image"
                src="${image}"
            />
            
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[author]}</div>
            </div>
        `

        newItems.appendChild(element)
    }

    document.querySelector('[data-list-items]').appendChild(newItems)
    document.querySelector('[data-list-button]').disabled = (matches.length - (page * BOOKS_PER_PAGE)) < 1

    document.querySelector('[data-list-button]').innerHTML = `
        <span>Show more</span>
        <span class="list__remaining"> (${(matches.length - (page * BOOKS_PER_PAGE)) > 0 ? (matches.length - (page * BOOKS_PER_PAGE)) : 0})</span>
    `

    window.scrollTo({top: 0, behavior: 'smooth'});
    document.querySelector('[data-search-overlay]').open = false
})


document.querySelector('[data-list-button]').addEventListener('click', () => {
    
    const startIndex = page * BOOKS_PER_PAGE;
    const endIndex = (page + 1) * BOOKS_PER_PAGE;
    const fragment = document.createDocumentFragment();
  
    for (let i = startIndex; i < endIndex && i < matches.length; i++) {
      const book = matches[i];
  
      const { author, image, title, id } = book;
  
      const preview = createBookPreview({
        author,
        id,
        image,
        title,
      });

      fragment.appendChild(preview);
    }
  
    document.querySelector('[data-list-items]').appendChild(fragment);
  
    page++;
  
    const remaining = matches.length - endIndex;
    document.querySelector('[data-list-button]').disabled = endIndex >= matches.length;
    document.querySelector('[data-list-button]').textContent = `Show more (${remaining})`;
  });


  function listItemClick(books, authors) {

    const activeListElement = document.querySelector('[data-list-active]');
    const blurElement = document.querySelector('[data-list-blur]');
    const imageElement = document.querySelector('[data-list-image]');
    const titleElement = document.querySelector('[data-list-title]');
    const subtitleElement = document.querySelector('[data-list-subtitle]');
    const descriptionElement = document.querySelector('[data-list-description]');

    return function(event) {
      const pathArray = Array.from(event.path || event.composedPath())
      let active = null
  
      for (const node of pathArray) {
        if (active) break
  
        if (node?.dataset?.preview) {
          let result = null
  
          for (const singleBook of books) {
            if (result) break;
            if (singleBook.id === node?.dataset?.preview) result = singleBook
          }
  
          active = result
        }
      }
  
      if (active) {
        activeListElement.open = true
        blurElement.src = active.image
        imageElement.src = active.image
        titleElement.innerText = active.title
        subtitleElement.innerText = `${authors[active.author]} (${new Date(active.published).getFullYear()})`
        descriptionElement.innerText = active.description
      }
    }
  }
  
  const listItemClickListener = listItemClick(books, authors);
  document.querySelector('[data-list-items]').addEventListener('click', listItemClickListener);
  
  