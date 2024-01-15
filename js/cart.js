import { fetchData } from './api.js';
import { loadBasket } from './basket.js';
import {increment, decrement, calculateTotalAmount} from "./utils.js";

const shoppingCart = document.getElementById("shopping-cart")
const label = document.querySelector(".label")

let basket = loadBasket();

window.addEventListener("DOMContentLoaded", () => {
  loadPageData();

});


async function loadPageData() {
  const data = await fetchData('https://fakestoreapi.com/products');

  console.log("data from cart", data);
  generateCartItems(basket, data);
  const totalAmount = calculateTotalAmount(basket, data);
  updateTotalAmountDisplay(totalAmount);
}


const generateCartItems = (basket, data) => {
    if(basket.length !== 0){
        shoppingCart.innerHTML = basket.map(item => {
            const {id, total} = item
            const search = data.find((item) => item.id === id) || []
            const{image, price, title} = search
            return `
            <div class="cart-item">
            <img width="100" src=${image} alt="" />
    
            <div class="details">
            
              <div class="title-price-x">
                <h4 class="title-price">
                  <p>${title}</p>
                  <p class="cart-item-price">$ ${price}</p>
                </h4>
                <i class="bi bi-x-lg"></i>
              </div>
    
              <div class="cart-buttons">
                <div class="buttons">
                  <i class="bi bi-dash-lg"></i>
                  <div id=${id} class="quantity">${total}</div>
                  <i class="bi bi-plus-lg"></i>
                </div>
              </div>
    
              <h3>$ ${total * price}</h3>
            
            </div>
          </div>
            `;
        })
        .join("");
    } else {
        shoppingCart.innerHTML = "";
        label.innerHTML = `
        <h2>Cart is Empty</h2>
        `;
    }
    attachListeners();
  }
    function attachListeners() {
      const incrementButtons = document.querySelectorAll('.bi.bi-plus-lg');
      incrementButtons.forEach(button => {
        button.addEventListener('click', (event) => {
          const id = Number(event.currentTarget.closest('.cart-item').querySelector('.quantity').id);
          increment(basket, id);
        });
      });
    
      const decrementButtons = document.querySelectorAll('.bi.bi-dash-lg');
      decrementButtons.forEach(button => {
        button.addEventListener('click', (event) => {
          const id = Number(event.currentTarget.closest('.cart-item').querySelector('.quantity').id);
          decrement(basket, id);
        });
      });
    
      const removeItemButtons = document.querySelectorAll('.bi.bi-x-lg');
      removeItemButtons.forEach(button => {
        button.addEventListener('click', (event) => {
          const id = Number(event.currentTarget.closest('.cart-item').querySelector('.quantity').id);
          removeItem(basket, id);
        });
      });
    }

 function updateTotalAmountDisplay(amount) {
  label.innerHTML = amount > 0 ? `
    <h2>Total Bill : $ ${amount}</h2>
    <button id="clearCartButton" class="removeAll">Clear Cart</button>
  ` : '<h2>Cart is Empty</h2>';
  
  const clearCartButton = document.getElementById("clearCartButton");
  if (clearCartButton) {
    clearCartButton.addEventListener('click', clearCart);
  }
}

 function clearCart(basket) {
  basket = []; // Clear the basket array
  generateCartItems(basket); // Regenerate the cart items, which should now be empty
  updateTotalAmountDisplay(0); // Update the total amount display to 0
  localStorage.setItem("data", JSON.stringify(basket)); // Update the local storage
}

function removeItem(basket, id) {

  basket = basket.filter((item) => item.id !== id);
  const totalAmount = calculateTotalAmount(basket);
  generateCartItems(basket);
  updateTotalAmountDisplay(totalAmount);

  localStorage.setItem("data", JSON.stringify(basket));
}



  