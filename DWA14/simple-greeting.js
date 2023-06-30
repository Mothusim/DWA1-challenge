import {LitElement, html, css} from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';



export class SimpleGreeting extends LitElement {
  static properties = {
    name: {},
    count: { type: Number },
    max_number: { type: Number},
    min_number: { type: Number}
  };

  static get properties(){
    return {
      isDisabled: { type: Boolean }
    };
  }
  // Define scoped styles right with your component, in plain CSS
  static styles = css`
  * {

  box-sizing: border-box;

}

li {

  list-style: none;

}

:root {

  --primary: #424250;
  --color-green: #32c48d;
  --color-white: #ffffff;
  --color-dark-grey: #33333d;
  --color-medium-grey: #424250;
  --color-light-grey: #9ca3ae;

}

body {

  padding: 0;
  margin: 0;

  background-color: var(--primary);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;

}

button {

  margin: 5em 0 0 21em;
  width: 10em;
  height: 3em;

}

/* Styling */

html {

  height: 100vh;

}

h1 {

  font-size: 3rem;
  font-weight: 900;
  color: var(--color-light-grey)

}


nav img {

  width: 100px;
  height: 50px;

}

nav {

  background-color: #333;
  overflow: hidden;
  font-size: 1.2em;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

}

nav ul {

  list-style-type: none;

}

nav li {

  float: left;

}

nav li a {

  color: white;
  text-decoration: none;
  text-align: center;
  padding: 0px 10px 0px 10px;

}

main {

  background-color: transparent;

}

/* Controls */

.controls {

  background-color: yellow;

}

/* Counter */

.counter {

  background-color: #424250;

}

.counter_value {

  width: 100%;
  height: 15rem;
  text-align: center;
  font-size: 8rem;
  font-weight: 900;
  color: white;
  background: none;
  border-width: 0;
  border-bottom: 1px solid lightgray;

}

.counter_button {

  background: none;
  width: 50%;
  border-width: 0;
  color: lightgray;
  font-size: 3rem;
  height: 10rem;
  border-bottom: 1px solid lightgray;
  transition: transform 0.3s;
  transform: translateY(0);

}

.counter_button:active {

  background: var(--color-medium-grey);
  transform: translateY(2%);

}

.counter_button:disabled {

  background-color: red;

}

.counter_actions {

  display: flex;

}

.counter_button_first {

  border-right: 1px solid lightgray;

}


sl-button {

  margin-left:16em;
  margin-top: 5em;

}

/* Footer */

footer {

  background-color: #424250;
  color: lightgray;
  padding: 2rem;
  font-size: 0.8rem;
  text-align: center;
}

.footer_link {

  color: white;

}
  `;

  constructor() {
    super();
    // Declare reactive properties
    this.count = 0;
    this.max_number = 15;
    this.min_number = -5;
  }

 

  // Render the UI as a function of component state
  render() {
    return html`<div class="container">

    <nav>

        
        <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Services</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Contact</a></li>
        </ul>
        <img src="./tally-count-online-logo.svg" alt="Logo" class="logo">
        
    </nav>

    <header>

        <h1>Tally Count</h1>

    </header>

    <aside class="controls">

        <label>

            <span>Display</span>

            <select>

                <option>Single</option>
                <option>Multiple</option>

            </select>

        </label>

        <label>

            <span>Counter</span>

            <select>

                <option>Counter 1</option>
                <option>Counter 2</option>
                <option>Counter 3</option>

            </select>

        </label>

        <button>Settings</button>

    </aside>

    <main class="counter">

        <input class="counter_value" data-key="number" readonly value="${this.count}">
      
        <div class="counter_actions">

            <button data-key="subtract" ?disabled=${this.isDisabled} @click="${this.subtract}">-</button>
            <button data-key="reset" ?disabled=${this.isDisabled} @click="${this.reset}">RESET</button>
            <button data-key="add" ?disabled=${this.isDisabled} @click="${this.add}">+</button>

        </div>

    </main>

    <footer>

        Inspired by <a href="https://tallycount.app/" class="footer_link">Tally Count</a>.


    </footer>

</div>`
  }

 
    
  add(){

    this.count++;
    
  }

  subtract(){
    
    this.count--;

  }
  
  reset(){

    this.count = 0;

  }

}
customElements.define('simple-greeting', SimpleGreeting);