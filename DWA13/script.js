import { provinces, names, products } from './data.js';

const unsortedProvinces = [...provinces];



// number 1

names.forEach((name) => {console.log(name)})

//number 2

names.forEach((name, index)=> {console.log(name, provinces[index])})

//number 3

provinces.map((province)=> {console.log(province.toUpperCase())})

//number 4

const ey = names.map((name) => name.length)

console.log(ey)

//number 5

const sortedProvinces = provinces.sort();

console.log(sortedProvinces);

//number 6

const filteredProvinces = provinces.filter((province) => !province.includes('Cape'));
const remainingProvinceCount = filteredProvinces.length;

console.log(remainingProvinceCount);

//number 7
console.log(names)

const containsSArray = names.map(name => name.split('').some(char => char.toLowerCase() === 's'));

console.log(containsSArray);


const containsCharS = names.map(name => /s/.test(name));

console.log(containsCharS);


//number 8

const newObj = names.reduce((obj, current, index) => {
    obj[current] = unsortedProvinces[index];
    return obj;
   }, {});

console.log(newObj);


  // optional

  // number 1

products.forEach((productName) => {console.log(productName.product)});

//number 2

const fitleredProducts = products.filter((productName) => productName.product.length > 5);

console.log(fitleredProducts);

//number 3

//Using both filter and map. Convert all prices that are strings to numbers, and remove all products from the array that do not have prices.
// After this has been done then use reduce to calculate the combined price of all remaining products.

// products.filter((productPrice) => (typeof productPrice.price == 'String' ){

// });

// for (let i=0; i<products.length; i++){

//     console.log(typeof products[0].price)

//     if(typeof products[i].price == 'string' ){

//         console.log(parseInt(products[i].price));

//     } else{
//         console.log(products.price);
//     }

// }


const { highest, lowest } = products.reduce((result, product) => {
    if (typeof parseInt(product.price) == 'number' && !(isNaN(parseInt(product.price)))){
      if (!result.highest || product.price > result.highest.price) {
        result.highest = product;
      }
      if (!result.lowest || product.price < result.lowest.price) {
        result.lowest = product;
      }
    }
    return result;
  }, {});
  console.log(`Highest: ${highest.product}. Lowest: ${lowest.product}`);



for (const item of products){
    for (const [key, value] of Object.entries(item)){

        let count = 0;

        if (typeof item.price == 'string'){

            const newN = parseInt(item.price);
            
            
        }else{
            const newN = item.price;
            console.log(newN * 2)
        }

        // if (typeof item.price == 'number') {
        //     count += item.price
        // }

        

    }
}

// if(typeof products[1].price == 'string' ){
//     console.log('hey')
// }