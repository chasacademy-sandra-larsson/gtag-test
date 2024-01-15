import { fetchData } from './api.js';
import { loadBasket } from './basket.js';
import { increment, decrement, calculateBasket, truncateString} from "./utils.js";

const shop = document.getElementById('shop');
const allCategories = document.getElementById("categories");

let basket = loadBasket();

window.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded")
  loadPageData()
});

async function loadPageData() {
  const data = await fetchData('https://fakestoreapi.com/products');
  console.log("data from main", data);
  renderShop(basket, data)
  generateCategories(data)
  calculateBasket(basket)
}

const renderShop = (basket, products) => {
    // Generera alla produkter här
    const renderedProducts = products.map(product => {

        const {id, title, description, image, price, category} = product;
        const category_cleaned = category.replaceAll("'", "")
        truncateString(description, 40)
        const search = basket.find((item) => item.id === id) || [];

        return `
        <article id=product-id-${id} class="item" data="${category_cleaned}">
          <img width="220" src=${image} alt="">
          <div class="details">
            <h3>${title}</h3>
            <p>${description}</p>
            <div class="price-quantity">
              <h2>$ ${price} </h2>
              <div class="buttons">
                <i class="bi bi-dash-lg"></i>
                <div id=${id} class="quantity">${
                    search.item === undefined ? 0 : search.item
                  }
                </div>
                <i class="bi bi-plus-lg"></i>
              </div>
            </div>
          </div>
          </article>`;
    }).join("")

    shop.innerHTML = renderedProducts
    attachEventListeners()

}


function attachEventListeners() {
  // Select all increment buttons and attach event listeners
  const incrementButtons = shop.querySelectorAll('.bi.bi-plus-lg');
  incrementButtons.forEach(button => {
      button.addEventListener('click', (event) => {
          const id = Number(event.currentTarget.closest('.item').getAttribute('id').replace('product-id-', ''));
          increment(basket, id);
      });
  });

  // Select all decrement buttons and attach event listeners
  const decrementButtons = shop.querySelectorAll('.bi.bi-dash-lg');
  decrementButtons.forEach(button => {
      button.addEventListener('click', (event) => {
          const id = Number(event.currentTarget.closest('.item').getAttribute('id').replace('product-id-', ''));
          decrement(basket, id);
      });
  });
}

function getCategories(data) {

    const allCategories = data.reduce((arr, item) => {
          let  {category}  = item
          category = category.replaceAll("'", "")
          if(!arr.includes(category))
          arr.push(category)
          return arr
    }, [])

    return allCategories
}

function filterProducts(event) {

  const category = event.target.innerText

  const storeProducts = document.getElementById("shop");
  const productItems = storeProducts.querySelectorAll(".item")
  Array.from(productItems).forEach(element => {
      if(category === element.getAttribute("data"))
       element.classList.remove("hide")
      else
       element.classList.add("hide") 
  })
  

}

function generateCategories(products) {
    const categories = getCategories(products)
    console.log(categories)
    const markup = categories.map((category) => {
       return `<div class="categories">
            <button class="btnCategory">
                 ${category}
            </button
            </div>`;
    }).join("");

    allCategories.innerHTML = markup

    document.querySelectorAll(".btnCategory").forEach( (element) => {
            element.addEventListener("click", filterProducts)
    });
   
}

