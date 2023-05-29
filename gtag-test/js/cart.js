let shoppingCart = document.getElementById("shopping-cart")
let label = document.querySelector(".label")
let basket = JSON.parse(localStorage.getItem("data")) || []

console.log("basket", basket)

shopData.forEach(element => {
  console.log(element.price)
})

let generateCartItems = () => {
    if(basket.length !== 0){
        shoppingCart.innerHTML = basket.map(item => {
            let {id, total} = item
            let search = shopData.find((item) => item.id === id) || []
            let {image, price, title} = search
            return `

            <div class="cart-item">
            <img width="100" src=${image} alt="" />
    
            <div class="details">
            
              <div class="title-price-x">
                <h4 class="title-price">
                  <p>${title}</p>
                  <p class="cart-item-price">$ ${price}</p>
                </h4>
                <i onclick="removeItem(${id})" class="bi bi-x-lg"></i>
              </div>
    
              <div class="cart-buttons">
                <div class="buttons">
                  <i onclick="decrement(${id})" class="bi bi-dash-lg"></i>
                  <div id=${id} class="quantity">${total}</div>
                  <i onclick="increment(${id})" class="bi bi-plus-lg"></i>
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
}

generateCartItems();

let increment = (id) => {
    let selectedItem = id;
    let search = basket.find((x) => x.id === selectedItem.id);
  
    if (search === undefined) {
      basket.push({
        id: selectedItem.id,
        item: 1,
      });
    } else {
      search.item += 1;
    }
  
    generateCartItems();
    update(selectedItem.id);
    localStorage.setItem("data", JSON.stringify(basket));
  };



let decrement = (id) => {
    let selectedItem = id;
    let search = basket.find((x) => x.id === selectedItem.id);
  
    if (search === undefined) return;
    else if (search.item === 0) return;
    else {
      search.item -= 1;
    }
  
    update(selectedItem.id);
    basket = basket.filter((x) => x.item !== 0);
    generateCartItems();
    localStorage.setItem("data", JSON.stringify(basket));
  };

  function update(id)  {
    let search = basket.find((x) => x.id === id);
    document.getElementById(id).innerHTML = search.item;
    calculation();
    totalAmount();
  };
  

let removeItem = (id) => {
    let selectedItem = id;
    basket = basket.filter((x) => x.id !== selectedItem.id);
    calculation();
    generateCartItems();
    totalAmount();
    localStorage.setItem("data", JSON.stringify(basket));
  };
  

  let totalAmount = () => {
    if (basket.length !== 0) {
      let amount = basket
        .map((x) => {
          let { id, total } = x;
          let filterData = shopData.find((x) => x.id === id);
          console.log("test", typeof filterData.price)
          console.log("total", total)
          return filterData.price * total;
        })
        .reduce((x, y) => x + y, 0);
  
      return (label.innerHTML = `
      <h2>Total Bill : $ ${amount}</h2>
      <button onclick="clearCart()" class="removeAll">Clear Cart</button>
      `);
    } else return;
  };
  
  totalAmount();

  let clearCart = () => {
    basket = [];
    generateCartItems();
    calculation();
    localStorage.setItem("data", JSON.stringify(basket));
  };
  

function calculation () {
    let cartIcon = document.getElementById("cartAmount");
    cartIcon.innerHTML = basket.map((x) => x.total).reduce((x, y) => x + y, 0);
  };
  
  calculation();
  