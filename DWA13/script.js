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


// number 3

const strPriceToNum = products.map((item) => {

  const y = typeof item.price == 'string' ? parseInt(item.price) : item.price

  return y

})

const filteredStrPriceToNum = strPriceToNum.filter((numNowPrice) => !isNaN(numNowPrice))

const totalPrice = filteredStrPriceToNum.reduce((a, b) => a +b)

console.log(totalPrice)


const productNames = products.reduce(((a, b) => a += ` ${b.product}`), '')

console.log(productNames)


// number 5

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


// number 6

const entries = Object.entries(products)

console.log(entries)

const changedEntries = entries.reduce(((a, b) => {

  

  return a

}), {})

console.log(changedEntries)