const shop = document.getElementById('shop');
const allCategories = document.getElementById("categories");
const btnCategory = document.querySelectorAll(".btnCategory");
 
let basket = JSON.parse(localStorage.getItem("data")) || [];


const generateShop = () => {
    // Generera alla produkter här

    const markup = shopData.map(product => {
        let {id, title, description, image, price, category} = product;
        let category_cleaned = category.replaceAll("'", "")
        description = truncateString(description, 40)
        let search = basket.find((item) => item.id === id) || [];
        return `
        <article id=product-id-${id} class="item" data="${category_cleaned}">
          <img width="220" src=${image} alt="">
          <div class="details">
            <h3>${title}</h3>
            <p>${description}</p>
            <div class="price-quantity">
              <h2>$ ${price} </h2>
              <div class="buttons">
                <i onclick="decrement(${id})" class="bi bi-dash-lg"></i>
                <div id=${id} class="quantity">${
                    search.item === undefined ? 0 : search.item
                  }
                </div>
                <i onclick="increment(${id})" class="bi bi-plus-lg"></i>
              </div>
            </div>
          </div>
          </article>`;
    }).join("")

    shop.innerHTML = markup
}

generateShop()

const getCategories = () => {

    const allCategories = shopData.reduce((arr, item) => {
          let  {category}  = item
          category = category.replaceAll("'", "")
          if(!arr.includes(category))
          arr.push(category)
          return arr
    }, [])

    return allCategories
}

const filterProducts = (event) => {

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

const generateCategories = () => {
    const categories = getCategories(shopData)
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

generateCategories()


const increment = (id) => {
    // Om användaren klickar på + på produkten 
    //    - antalet inkrementeras med 1 i objektet för vald produkt
    //    - kundvagnen uppdateras
    let selectedItem = id;

    let search = basket.find(item => item.id === selectedItem)
    if(search === undefined) {
        basket.push({
            id: selectedItem,
            total: 1
        })
    }
    else {
        search.total += 1
    }
    console.log("basket", basket)
     
    update(selectedItem)
    localStorage.setItem("data", JSON.stringify(basket));
}


let decrement = (id) => {
    console.log("decrement")
    let selectedItem = id;
    let search = basket.find((x) => x.id === selectedItem.id);
  
    if (search === undefined) return;
    else if (search.total === 0) return;
    else {
      search.item -= 1;
    }
  
    update(selectedItem.id);
    basket = basket.filter((x) => x.total !== 0);
    console.log(basket);
    localStorage.setItem("data", JSON.stringify(basket));
  };

  
let update = (id) => {
    let search = basket.find((item) => item.id === id)
    document.getElementById(id).innerHTML = search.total   
    calculation()
}

let calculation = () => {
    let cartIcon = document.getElementById("cartAmount")
    const basketItems = basket.map(basketItem => basketItem.total)
    const basketTotal = basketItems.reduce((acc, item) => acc + item, 0)
    cartIcon.innerHTML = basketTotal
 }

 calculation()

 function truncateString(str, num) {
  // If the length of str is less than or equal to num
  // just return str--don't truncate it.
  if (str.length <= num) {
    return str
  }
  // Return str truncated with '...' concatenated to the end of str.
  return str.slice(0, num) + '...'
}