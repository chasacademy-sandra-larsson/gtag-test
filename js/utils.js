export function loadBasket() {
    try {
      const storedBasket = localStorage.getItem("data");
      return storedBasket ? JSON.parse(storedBasket) : [];
    } catch (error) {
      console.error("Failed to load basket from localStorage:", error);
      return [];
    }
  }

export function updateItemQuantity(basket, id, increment = true) {
    let search = basket.find(item => item.id === id);
  
    if (search) {
       // Öka antalet med 1 (produkten finns redan i kundvagnen). 
        search.total += increment ? 1 : -1;
    } else if (increment) {
        // Öka befintligt produkt med 1
        search = { id: id, total: 1 };
        basket.push(search);
    }
  
    // Ta bort produkten om antalet är 0
    if (search.total === 0) {
        basket = basket.filter(item => item.id !== id);
    }
  
    updateBasket(basket, id);
    return basket;
  }
  
  export function increment(basket, id) {
    gtag('event', 'button_click', {
        'event_category': 'interactions on products',
        'event_label': 'adding products to cart',
        'value': 1,
        'debug_mode': true
      });
    updateItemQuantity(basket, id, true);
  }
  
  export function decrement(basket, id) {
    updateItemQuantity(basket, id, false);
  }
  
  export function updateBasket(basket, id) {
    const search = basket.find(item => item.id === id);
    if (search) {
        // Uppdatera antalet i DOM:en
        document.getElementById(id).innerHTML = search.total;
    }
    calculateBasket(basket);
    localStorage.setItem("data", JSON.stringify(basket));
  }
  
  
    
  export function calculateBasket(basket) {
      const cartIcon = document.getElementById("cartAmount")
      const basketItems = basket.map(basketItem => basketItem.total)
      const basketTotal = basketItems.reduce((acc, item) => acc + item, 0)
      cartIcon.innerHTML = basketTotal;
   }
  
  
   export function truncateString(str, num) {
  
    if (str.length <= num) {
      return str
    }
    return str.slice(0, num) + '...'
  }
  
  


export function calculateTotalAmount(basket, products) {
    if (basket.length === 0) {
      return 0;
    }
  
    let amount = basket
      .map(({ id, total }) => {
        let filterData = products.find((item) => item.id === id);
        if (!filterData) {
          console.warn(`Product with ID ${id} not found.`);
          return 0;
        }
        return filterData.price * total;
      })
      .reduce((acc, y) => acc + y, 0);
  
    return amount;
  }
  

  export function clearCart(basket) {
    basket = []; // Clear the basket array
    generateCartItems(basket); // Regenerate the cart items, which should now be empty
    updateTotalAmountDisplay(0); // Update the total amount display to 0
    localStorage.setItem("data", JSON.stringify(basket)); // Update the local storage
  }
