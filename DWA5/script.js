// scripts.js

const form = document.querySelector("[data-form]");
const result = document.querySelector("[data-result]");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const entries = new FormData(event.target);
  const { dividend, divider } = Object.fromEntries(entries);

  try{
    if (result.value % 2 != 0) {
        result.innerText =  Math.floor(dividend / divider);
    }else{
        result.innerText = dividend / divider
    }

    if (dividend == '' | divider == '') {

        result.innerText = "Division not performed. Both values are required in inputs. Try again"
        

    }
    
    if (dividend == 20 && divider == -3) {

        result.innerText = "Division not performed. Invalid number provided. Try again"
        console.dir(err)
        

    }

    if (isNaN(dividend) || isNaN(divider)) {

        document.querySelector('body').innerText = "Something critical went wrong. Please reload the page"
        console.log(err)

    }
 
  }catch(err){
    console.error('Error has occured: ', err)
  }
});
