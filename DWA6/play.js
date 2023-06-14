import { books, authors, genres, BOOKS_PER_PAGE } from './data.js';

const App = {
  page: 1,
  matches: [],

  initialize() {
    this.matches = books;
    this.renderInitialItems();
    this.renderGenres();
    this.renderAuthors();
    this.setupTheme();
    this.updateListButton();
    this.bindEventListeners();
  },

  renderInitialItems() {
    const fragment = document.createDocumentFragment();
    const initialItems = this.matches.slice(0, BOOKS_PER_PAGE);

    for (const book of initialItems) {
      const element = this.createPreviewElement(book);
      fragment.appendChild(element);
    }

    this.getListItemsElement().appendChild(fragment);
  },

  renderGenres() {
    const fragment = document.createDocumentFragment();
    const firstGenreElement = this.createOptionElement('any', 'All Genres');
    fragment.appendChild(firstGenreElement);

    for (const [id, name] of Object.entries(genres)) {
      const element = this.createOptionElement(id, name);
      fragment.appendChild(element);
    }

    this.getSearchGenresElement().appendChild(fragment);
  },

  renderAuthors() {
    const fragment = document.createDocumentFragment();
    const firstAuthorElement = this.createOptionElement('any', 'All Authors');
    fragment.appendChild(firstAuthorElement);

    for (const [id, name] of Object.entries(authors)) {
      const element = this.createOptionElement(id, name);
      fragment.appendChild(element);
    }

    this.getSearchAuthorsElement().appendChild(fragment);
  },

  setupTheme() {
    const prefersDarkTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = prefersDarkTheme ? 'night' : 'day';
    this.setTheme(theme);
  },

  setTheme(theme) {
    const { style } = document.documentElement;
    const colorDark = theme === 'night' ? '255, 255, 255' : '10, 10, 20';
    const colorLight = theme === 'night' ? '10, 10, 20' : '255, 255, 255';

    style.setProperty('--color-dark', colorDark);
    style.setProperty('--color-light', colorLight);

    this.getSettingsThemeElement().value = theme;
  },

  updateListButton() {
    const remainingBooks = this.matches.length - (this.page * BOOKS_PER_PAGE);
    const buttonElement = this.getListButtonElement();

    buttonElement.innerText = `Show more (${remainingBooks})`;
    buttonElement.disabled = remainingBooks <= 0;
  },

  bindEventListeners() {
    this.getSearchCancelElement().addEventListener('click', () => {
      this.getSearchOverlayElement().open = false;
    });

    this.getSettingsCancelElement().addEventListener('click', () => {
      this.getSettingsOverlayElement().open = false;
    });

    this.getHeaderSearchElement().addEventListener('click', () => {
      this.getSearchOverlayElement().open = true;
      this.getSearchTitleElement().focus();
    });

    this.getHeaderSettingsElement().addEventListener('click', () => {
      this.getSettingsOverlayElement().open = true;
    });

    this.getSettingsFormElement().addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);
      const { theme } = Object.fromEntries(formData);
      this.setTheme(theme);
      this.getSettingsOverlayElement().open = false;
    });

    this.getSearchFormElement().addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);
      const filters = Object.fromEntries(formData);
      const result = this.filterBooks(filters);
      this.page = 1;
      this.matches = result;
      this.updateListItems(result);
      this.updateListButton();
      this.scrollToTop();
      this.getSearchOverlayElement().open = false;
    });

    this.getListButtonElement().addEventListener('click', () => {
      this.loadMoreBooks();
    });

    this.getListItemsElement().addEventListener('click', (event) => {
      const previewElement = this.findPreviewElement(event.target);
      if (previewElement) {
        const bookId = previewElement.getAttribute('data-preview');
        const book = this.findBookById(bookId);
        if (book) {
          this.showBookDetails(book);
        }
      }
    });
  },

  createPreviewElement(book) {
    const element = document.createElement('button');
    element.classList = 'preview';
    element.setAttribute('data-preview', book.id);

    element.innerHTML = `
      <img class="preview__image" src="${book.image}" />
      <div class="preview__info">
        <h3 class="preview__title">${book.title}</h3>
        <div class="preview__author">${authors[book.author]}</div>
      </div>
    `;

    return element;
  },

  createOptionElement(value, text) {
    const element = document.createElement('option');
    element.value = value;
    element.innerText = text;
    return element;
  },

  filterBooks(filters) {
    return books.filter((book) => {
      const { genre, title, author } = filters;
      const genreMatch = genre === 'any' || book.genres.includes(genre);
      const titleMatch = title.trim() === '' || book.title.toLowerCase().includes(title.toLowerCase());
      const authorMatch = author === 'any' || book.author === author;
      return genreMatch && titleMatch && authorMatch;
    });
  },

  updateListItems(books) {
    const fragment = document.createDocumentFragment();

    for (const book of books.slice(0, BOOKS_PER_PAGE)) {
      const element = this.createPreviewElement(book);
      fragment.appendChild(element);
    }

    const listItemsElement = this.getListItemsElement();
    listItemsElement.innerHTML = '';
    listItemsElement.appendChild(fragment);
  },

  loadMoreBooks() {
    const fragment = document.createDocumentFragment();
    const start = this.page * BOOKS_PER_PAGE;
    const end = (this.page + 1) * BOOKS_PER_PAGE;

    for (const book of this.matches.slice(start, end)) {
      const element = this.createPreviewElement(book);
      fragment.appendChild(element);
    }

    this.getListItemsElement().appendChild(fragment);
    this.page++;
    this.updateListButton();
  },

  showBookDetails(book) {
    const activeListElement = this.getListActiveElement();
    const blurElement = this.getListBlurElement();
    const imageElement = this.getListImageElement();
    const titleElement = this.getListTitleElement();
    const subtitleElement = this.getListSubtitleElement();
    const descriptionElement = this.getListDescriptionElement();

    activeListElement.open = true;
    blurElement.src = book.image;
    imageElement.src = book.image;
    titleElement.innerText = book.title;
    subtitleElement.innerText = `${authors[book.author]} (${new Date(book.published).getFullYear()})`;
    descriptionElement.innerText = book.description;
  },

  findPreviewElement(target) {
    const pathArray = Array.from(target?.path || target?.composedPath());
    return pathArray.find((node) => node?.dataset?.preview);
  },

  findBookById(bookId) {
    return books.find((book) => book.id === bookId);
  },

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  // Helper functions to retrieve DOM elements

  getListItemsElement() {
    return document.querySelector('[data-list-items]');
  },

  getListButtonElement() {
    return document.querySelector('[data-list-button]');
  },

  getSearchGenresElement() {
    return document.querySelector('[data-search-genres]');
  },

  getSearchAuthorsElement() {
    return document.querySelector('[data-search-authors]');
  },

  getSearchOverlayElement() {
    return document.querySelector('[data-search-overlay]');
  },

  getSearchTitleElement() {
    return document.querySelector('[data-search-title]');
  },

  getSearchCancelElement() {
    return document.querySelector('[data-search-cancel]');
  },

  getSettingsOverlayElement() {
    return document.querySelector('[data-settings-overlay]');
  },

  getSettingsFormElement() {
    return document.querySelector('[data-settings-form]');
  },

  getSettingsCancelElement() {
    return document.querySelector('[data-settings-cancel]');
  },

  getSettingsThemeElement() {
    return document.querySelector('[data-settings-theme]');
  },

  getHeaderSearchElement() {
    return document.querySelector('[data-header-search]');
  },

  getHeaderSettingsElement() {
    return document.querySelector('[data-header-settings]');
  },

  getListActiveElement() {
    return document.querySelector('[data-list-active]');
  },

  getListBlurElement() {
    return document.querySelector('[data-list-blur]');
  },

  getListImageElement() {
    return document.querySelector('[data-list-image]');
  },

  getListTitleElement() {
    return document.querySelector('[data-list-title]');
  },

  getListSubtitleElement() {
    return document.querySelector('[data-list-subtitle]');
  },

  getListDescriptionElement() {
    return document.querySelector('[data-list-description]');
  },
};

// Initialize the application
App.initialize();
