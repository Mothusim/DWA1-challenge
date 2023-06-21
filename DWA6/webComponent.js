import { books, authors, genres, BOOKS_PER_PAGE } from "./data.js";

/**
 * @type {number} page - page number
 */

/**
 * @type {number} BOOKS_PER_PAGE - Number of books that will be displayed per page
 */

let page = 1;
let matches = books;
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
  const element = document.createElement("button");
  element.classList = "preview";
  element.setAttribute("data-preview", id);

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

document.querySelector("[data-list-items]").appendChild(fragment);

/**
 * The optionsFragment function creates the first or default option on the search bars for both genres search option and authors search option.
 * @param {Object} items - Takes in an object containing a list of author names or types of genres.
 * @param {String} firstOptionText - The default text that should be displayed on the genres search option or authors search option.
 * @returns {fragment}
 */

function optionsFragment(items, firstOptionText) {
  const fragment = document.createDocumentFragment();

  const defaultOptionElement = document.createElement("option");

  defaultOptionElement.innerText = firstOptionText;
  fragment.appendChild(defaultOptionElement);

  for (const [id, name] of Object.entries(items)) {
    const element = document.createElement("option");
    element.value = id;
    element.innerText = name;
    fragment.appendChild(element);
  }

  return fragment;
}

const genreOptions = optionsFragment(genres, "All Genres");
document.querySelector("[data-search-genres]").appendChild(genreOptions);

const authorsOptions = optionsFragment(authors, "All Authors");
document.querySelector("[data-search-authors]").appendChild(authorsOptions);

/**
 * This function sets the theme of the website based on the user preference.
 * @returns {void}
 */

function setThemeBasedOnColorScheme() {
  const prefersDarkMode =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const themeValue = prefersDarkMode ? "night" : "day";
  const darkColor = prefersDarkMode ? "255, 255, 255" : "10, 10, 20";
  const lightColor = prefersDarkMode ? "10, 10, 20" : "255, 255, 255";

  document.querySelector("[data-settings-theme]").value = themeValue;
  document.documentElement.style.setProperty("--color-dark", darkColor);
  document.documentElement.style.setProperty("--color-light", lightColor);
}

setThemeBasedOnColorScheme();

document.querySelector("[data-list-button]").innerText = `Show more (${
  books.length - BOOKS_PER_PAGE
})`;
document.querySelector("[data-list-button]").disabled =
  matches.length - page * BOOKS_PER_PAGE <= 0;

document.querySelector("[data-list-button]").innerHTML = `
    <span>Show more</span>
    <span class="list__remaining"> (${
      matches.length - [page * BOOKS_PER_PAGE] > 0
        ? matches.length - [page * BOOKS_PER_PAGE]
        : 0
    })</span>
`;
document.querySelector("[data-search-cancel]").addEventListener("click", () => {
  document.querySelector("[data-search-overlay]").open = false;
});

document
  .querySelector("[data-settings-cancel]")
  .addEventListener("click", () => {
    document.querySelector("[data-settings-overlay]").open = false;
  });

document.querySelector("[data-header-search]").addEventListener("click", () => {
  document.querySelector("[data-search-overlay]").open = true;
  document.querySelector("[data-search-title]").focus();
});

document
  .querySelector("[data-header-settings]")
  .addEventListener("click", () => {
    document.querySelector("[data-settings-overlay]").open = true;
  });

// document.querySelector("[data-list-close]").addEventListener("click", () => {
//   document.querySelector("[data-list-active]").open = false;
// });

document
  .querySelector("[data-settings-form]")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const { theme } = Object.fromEntries(formData);

    if (theme === "night") {
      document.documentElement.style.setProperty(
        "--color-dark",
        "255, 255, 255"
      );
      document.documentElement.style.setProperty("--color-light", "10, 10, 20");
    } else {
      document.documentElement.style.setProperty("--color-dark", "10, 10, 20");
      document.documentElement.style.setProperty(
        "--color-light",
        "255, 255, 255"
      );
    }

    document.querySelector("[data-settings-overlay]").open = false;
  });

document
  .querySelector("[data-search-form]")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const filters = Object.fromEntries(formData);
    const result = [];

    for (const book of books) {
      let genreMatch = filters.genre === "any";

      for (const singleGenre of book.genres) {
        if (genreMatch) break;
        if (singleGenre === filters.genre) {
          genreMatch = true;
        }
      }

      if (
        (filters.title.trim() === "" ||
          book.title.toLowerCase().includes(filters.title.toLowerCase())) &&
        (filters.author === "any" || book.author === filters.author) &&
        genreMatch
      ) {
        result.push(book);
      }
    }

    page = 1;
    matches = result;

    if (result.length < 1) {
      document
        .querySelector("[data-list-message]")
        .classList.add("list__message_show");
    } else {
      document
        .querySelector("[data-list-message]")
        .classList.remove("list__message_show");
    }

    document.querySelector("[data-list-items]").innerHTML = "";
    const newItems = document.createDocumentFragment();

    for (const { author, id, image, title } of result.slice(
      0,
      BOOKS_PER_PAGE
    )) {
      const element = document.createElement("button");
      element.classList = "preview";
      element.setAttribute("data-preview", id);

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

      newItems.appendChild(element);
    }

    document.querySelector("[data-list-items]").appendChild(newItems);
    document.querySelector("[data-list-button]").disabled =
      matches.length - page * BOOKS_PER_PAGE < 1;

    document.querySelector("[data-list-button]").innerHTML = `
        <span>Show more</span>
        <span class="list__remaining"> (${
          matches.length - page * BOOKS_PER_PAGE > 0
            ? matches.length - page * BOOKS_PER_PAGE
            : 0
        })</span>
    `;

    window.scrollTo({ top: 0, behavior: "smooth" });
    document.querySelector("[data-search-overlay]").open = false;
  });

document.querySelector("[data-list-button]").addEventListener("click", () => {
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

  document.querySelector("[data-list-items]").appendChild(fragment);

  page++;

  const remaining = matches.length - endIndex;
  document.querySelector("[data-list-button]").disabled =
    endIndex >= matches.length;
  document.querySelector(
    "[data-list-button]"
  ).textContent = `Show more (${remaining})`;
});


// class BookDetailsModal extends HTMLElement {
//   constructor() {
//     super();

//     // Create shadow DOM
//     this.attachShadow({ mode: 'open' });

//     // Initialize properties
//     this.open = false;
//     this.matches = books;
//     this.authors = authors;

//     // Create the modal content
//     this.shadowRoot.innerHTML = `
//       <style>

//       .overlay {
//         position: fixed;
//         bottom: 0;
//         left: 0;
//         width: 100%;
//         border-width: 0;
//         box-shadow: 0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12);
//         animation-name: enter;
//         animation-duration: 0.6s;
//         z-index: 10;
//         background-color: rgba(var(--color-light), 1);
//       }
  
//       .overlay__button {
//         font-family: Roboto, sans-serif;
//         background-color: rgba(var(--color-blue), 0.1);
//         transition: background-color 0.1s;
//         border-width: 0;
//         border-radius: 6px;
//         height: 2.75rem;
//         cursor: pointer;
//         width: 50%;
//         color: rgba(var(--color-blue), 1);
//         font-size: 1rem;
//         border: 1px solid rgba(var(--color-blue), 1);
//       }
  
//       .overlay__button_primary {
//         background-color: rgba(var(--color-blue), 1);
//         color: rgba(var(--color-force-light), 1);
//       }
  
//       .overlay__button:hover {
//         background-color: rgba(var((var(--color-blue))), 0.2);
//       }
  
//       .overlay__button_primary:hover {
//         background-color: rgba(var(--color-blue), 0.8);
//         color: rgba(var(--color-force-light), 1);
//       }
    
//       .overlay__title {
//         padding: 1rem 0 0.25rem;
//         font-size: 1.25rem;
//         font-weight: bold;
//         line-height: 1;
//         letter-spacing: -0.1px;
//         max-width: 25rem;
//         margin: 0 auto;
//         color: rgba(var(--color-dark), 0.8)
//       }
  
//       .overlay__blur {
//         width: 100%;
//         height: 200px;
//         filter: blur(10px);
//         opacity: 0.5;
//         transform: scale(2);
//       }
      
//       .overlay__image {
//         max-width: 10rem;
//         position: absolute;
//         top: 1.5m;
//         left: calc(50% - 5rem);
//         border-radius: 2px;
//         box-shadow: 0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12);
//       }
      
//       .overlay__data {
//         font-size: 0.9rem;
//         display: -webkit-box;
//         -webkit-line-clamp: 6;
//         -webkit-box-orient: vertical;  
//         overflow: hidden;
//         color: rgba(var(--color-dark), 0.8)
//       }
      
//       .overlay__data_secondary {
//         color: rgba(var(--color-dark), 0.6)
//       }
      
//       .overlay__content {
//         padding: 2rem 1.5rem;
//         text-align: center;
//         padding-top: 3rem;
//       }
      
//       @media (min-width: 30rem) {
//         .overlay {
//           max-width: 30rem;
//           left: 0%;
//           top: 0;
//           border-radius: 8px;;
//         }
//       }
  
//       .overlay__preview {
//         overflow: hidden;
//         margin: -1rem;
//         display: flex;
//         align-items: center;
//         justify-content: center;
//       }
  
//       .overlay__row {
//         display: flex;
//         gap: 0.5rem;
//         margin: 0 auto;
//         justify-content: center;
//       }
  
//       .overlay__background {
//         background: rgba(var(--color-dark), 0.6);
//         position: fixed;
//         top: 0;
//         left: 0;
//         height: 100vh;
//         width: 100vw;
//       }
  
//       .backdrop {
//         display: none;
//         background: rgba(var(--color-dark), 0.3);
//         position: fixed;
//         top: 0;
//         left: 0;
//         height: 100vh;
//         width: 100vw;
//       }
  
//       .overlay[open] ~ .backdrop {
//         display: block;
//       }
        
//       </style>
      
//       <dialog  class="overlay" data-list-active>
//       <div class="overlay__preview"><img class="overlay__blur" data-list-blur src=""/><img class="overlay__image" data-list-image src=""/></div>
//           <div class="overlay__content">
//             <h3 class="overlay__title" data-list-title></h3>
//             <div class="overlay__data" data-list-subtitle></div>
//             <p class="overlay__data overlay__data_secondary" data-list-description></p>
//           </div>
      
//           <div class="overlay__row">
//             <button class="overlay__button overlay__button_primary" data-list-close>Close</button>
//           </div>
//       </dialog>
//     `;
//   }

//   connectedCallback() {
//     // Add event listener to handle item click
//     this.addEventListener('click', this.handleItemClick);
//   }

//   disconnectedCallback() {
//     // Clean up event listener when element is removed from the DOM
//     this.removeEventListener('click', this.handleItemClick);
//   }

//   handleItemClick(event) {
//     const pathArray = Array.from(event.composedPath());
//     let active = null;

//     for (const node of pathArray) {
//       if (active) break;

//       if (node?.dataset?.preview) {
//         let result = null;

//         for (const singleBook of this.matches) {
//           if (singleBook.id === node?.dataset?.preview) {
//             result = singleBook;
//             break;
//           }
//         }

//         active = result;
//       }
//     }

//     if (active) {
//       this.open = true;
//       // Update the modal content with the book details
//       const modalContent = `
//         <img src="${active.image}" alt="Book Cover" />
//         <h2>${active.title}</h2>
//         <p>${this.authors[active.author]}</p>
//         <p>${active.description}</p>
//       `;
//       this.shadowRoot.querySelector('[data-list-active]').innerHTML = modalContent;
//     }
//   }
// }

// customElements.define('book-details-modal', BookDetailsModal);









const temp = document.querySelector("div");

temp.innerHTML = `

  <style>

   

    .overlay {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      border-width: 0;
      box-shadow: 0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12);
      animation-name: enter;
      animation-duration: 0.6s;
      z-index: 10;
      background-color: rgba(var(--color-light), 1);
    }

    .overlay__button {
      font-family: Roboto, sans-serif;
      background-color: rgba(var(--color-blue), 0.1);
      transition: background-color 0.1s;
      border-width: 0;
      border-radius: 6px;
      height: 2.75rem;
      cursor: pointer;
      width: 50%;
      color: rgba(var(--color-blue), 1);
      font-size: 1rem;
      border: 1px solid rgba(var(--color-blue), 1);
    }

    .overlay__button_primary {
      background-color: rgba(var(--color-blue), 1);
      color: rgba(var(--color-force-light), 1);
    }

    .overlay__button:hover {
      background-color: rgba(var((var(--color-blue))), 0.2);
    }

    .overlay__button_primary:hover {
      background-color: rgba(var(--color-blue), 0.8);
      color: rgba(var(--color-force-light), 1);
    }
  
    .overlay__title {
      padding: 1rem 0 0.25rem;
      font-size: 1.25rem;
      font-weight: bold;
      line-height: 1;
      letter-spacing: -0.1px;
      max-width: 25rem;
      margin: 0 auto;
      color: rgba(var(--color-dark), 0.8)
    }

    .overlay__blur {
      width: 100%;
      height: 200px;
      filter: blur(10px);
      opacity: 0.5;
      transform: scale(2);
    }
    
    .overlay__image {
      max-width: 10rem;
      position: absolute;
      top: 1.5m;
      left: calc(50% - 5rem);
      border-radius: 2px;
      box-shadow: 0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12);
    }
    
    .overlay__data {
      font-size: 0.9rem;
      display: -webkit-box;
      -webkit-line-clamp: 6;
      -webkit-box-orient: vertical;  
      overflow: hidden;
      color: rgba(var(--color-dark), 0.8)
    }
    
    .overlay__data_secondary {
      color: rgba(var(--color-dark), 0.6)
    }
    
    .overlay__content {
      padding: 2rem 1.5rem;
      text-align: center;
      padding-top: 3rem;
    }
    
    @media (min-width: 30rem) {
      .overlay {
        max-width: 30rem;
        left: 0%;
        top: 0;
        border-radius: 8px;;
      }
    }

    .overlay__preview {
      overflow: hidden;
      margin: -1rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .overlay__row {
      display: flex;
      gap: 0.5rem;
      margin: 0 auto;
      justify-content: center;
    }

    .overlay__background {
      background: rgba(var(--color-dark), 0.6);
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      width: 100vw;
    }

    .backdrop {
      display: none;
      background: rgba(var(--color-dark), 0.3);
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      width: 100vw;
    }

    .overlay[open] ~ .backdrop {
      display: block;
    }

  </style>

  <button data-btn-press>Press me</button>
  <dialog class="overlay" data-list-active>
    <div class="overlay__preview"><img class="overlay__blur" data-list-blur src=""/><img class="overlay__image" data-list-image src=""/></div>
    <div class="overlay__content">
      <h3 class="overlay__title" data-list-title></h3>
      <div class="overlay__data" data-list-subtitle></div>
      <p class="overlay__data overlay__data_secondary" data-list-description></p>
    </div>

    <div class="overlay__row">
      <button class="overlay__button overlay__button_primary" data-list-close>Close</button>
    </div>
  </dialog>
  

  
`;

class Bk extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(temp.cloneNode(true));
  }

  connectedCallback() {
    // const matches = window.matches

    this.shadowRoot
      .querySelector("[data-btn-press]")
      .addEventListener("click", () => {

        const activeListElement = this.shadowRoot.querySelector("[data-list-active]");
        const imageElement = this.shadowRoot.querySelector("[data-list-image]");
        const blurElement = this.shadowRoot.querySelector("[data-list-blur]");

        const titleElement = this.shadowRoot.querySelector("[data-list-title]");
        const subtitleElement = this.shadowRoot.querySelector("[data-list-subtitle]");
        const descriptionElement = this.shadowRoot.querySelector("[data-list-description]");

        activeListElement.open = true;
        blurElement.src = matches[0].image;
        imageElement.src = matches[0].image;
        titleElement.innerText = matches[0].title;
        subtitleElement.innerText = `${authors["6b092ae7-283c-45db-80f1-f0cc7e0d4921"]} (${new Date(
          matches[0].published
        ).getFullYear()})`;
        descriptionElement.innerText = matches[0].description;
      });

    this.shadowRoot
      .querySelector("[data-list-close]")
      .addEventListener(
        "click",
        () => (this.shadowRoot.querySelector("[data-list-active]").open = false)
      );
  }

  disconnectedCallback() {
    this.shadowRoot
      .querySelector("[data-btn-press]")
      .removeEventListener(
        "click",
        () => (this.shadowRoot.querySelector("[data-list-active]").open = true)
      );
  }

  
}

customElements.define("b-k", Bk);





// choose() {
//   const activeListElement =
//     this.shadowRoot.querySelector("[data-list-active]");
//   const imageElement = this.shadowRoot.querySelector("[data-list-image]");
//   const blurElement = this.shadowRoot.querySelector("[data-list-blur]");

//   const titleElement = this.shadowRoot.querySelector("[data-list-title]");
//   const subtitleElement = this.shadowRoot.querySelector(
//     "[data-list-subtitle]"
//   );
//   const descriptionElement = this.shadowRoot.querySelector(
//     "[data-list-description]"
//   );

//   activeListElement.open = true;
//   blurElement.src = matches[0].image;
//   imageElement.src = matches[0].image;
//   titleElement.innerText = matches[0].title;
//   subtitleElement.innerText = `${authors[2]} (${new Date(
//     matches[0].published
//   ).getFullYear()})`;
//   descriptionElement.innerText = matches[0].description;

  
// }