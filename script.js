const formatFoodItem = (item, type = "meal" | "dessert" | "beverage") => {
  if (type === "meal" || type === "dessert") {
    return {
      foodId: item.idMeal,
      foodName: item.strMeal,
      foodImage: item.strMealThumb,
      foodPrice: item.price,
      type,
    };
  } else if (type === "beverage") {
    return {
      foodId: item.idDrink,
      foodName: item.strDrink,
      foodImage: item.strDrinkThumb,
      foodPrice: item.price,
      type,
    };
  }
};

const globalFoods = [];
const cartItem = [];

let cartTotalItemHTML = document.getElementById("cartTotalAmount");

let listCartHTML = document.querySelector(".listCart");
let iconSpanCart = document.querySelector(".shopping span");

let shopping = document.querySelector(".shopping");
let closeCart = document.querySelector(".close");
let body = document.querySelector("body");
const openCart = document.getElementById("open-cart");
shopping.addEventListener("click", () => {
  openCart.classList.toggle("none");
});

closeCart.addEventListener("click", () => {
  openCart.classList.toggle("none");
});

function getPin() {
  const pin = Math.round(Math.random() * 1000);
  const pinString = pin + "";
  if (pinString.length == 3) {
    return pin;
  } else {
    return getPin();
  }
}

const searchFood = () => {
  const searchError = document.getElementById("search-error");
  const displayText = document.getElementById("display-text");
  const searchField = document.getElementById("search-field");
  const searchText = searchField.value;
  searchField.value = "";

  if (searchText) {
    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchText}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.meals) {
          globalFoods.splice(0, globalFoods.length);

          displaySearchResult(data.meals);
          const removeMain = document.getElementById("remove-main");
          removeMain.remove();
          const removeDessert = document.getElementById("remove-dessert");
          removeDessert.remove();
          const removeBeverage = document.getElementById("remove-beverage");
          removeBeverage.remove();
        } else {
          displayText.style.display = "block";
          searchError.style.display = "none";
        }
      });
  } else {
    displayText.style.display = "none";
    searchError.style.display = "block";
  }
};

const mainMeal = () => {
  const mainMealContent = document.getElementById("main-meal-content");

  fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=Pork`)
    .then((res) => res.json())
    .then((data) => {
      for (let i = 0; i < 3; i++) {
        const price = getPin();
        const meal = data.meals[i];
        globalFoods.push(formatFoodItem({ ...meal, price }, "meal"));
        const div = document.createElement("div");
        div.classList.add("col");
        div.innerHTML = `
                <div class="card border-0 shadow-lg h-70">
                <img src="${meal.strMealThumb}" class="card-img-top" alt="...">
                <div class="card-body">
                <h5 class="card-title">${meal.strMeal}</h5>
                <h5>${price}Tk</h5>
                </div>
                <div class="m-3">
                <button
                    class="foodZone-btn-orderNow"
                    onclick="orderNow(${meal.idMeal})"
                >
                    Order Now
                </button>
                </div>
            </div>`;
        mainMealContent.appendChild(div);
      }
    });
};
mainMeal();

const dessertItem = () => {
  const dessertItemContainer = document.getElementById(
    "dessert-item-container"
  );

  fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=Dessert`)
    .then((res) => res.json())
    .then((data) => {
      for (let i = 0; i < 3; i++) {
        const price = getPin();
        const meal = data.meals[i];
        globalFoods.push(formatFoodItem({ ...meal, price }, "dessert"));
        const div = document.createElement("div");
        div.classList.add("col");
        div.innerHTML = `
                <div class="card border-0 shadow-lg h-70">
                <img src="${meal.strMealThumb}" class="card-img-top" alt="...">
                <div class="card-body">
                <h5 class="card-title">${meal.strMeal}</h5>
                <h5>${price}Tk</h5>
                </div>
                <div class="m-3">
                <button
                    class="foodZone-btn-orderNow"
                    onclick="orderNow(${meal.idMeal})"
                >
                    Order Now
                </button>
                </div>
            </div>`;
        dessertItemContainer.appendChild(div);
      }
    });
};
dessertItem();

const beverageItem = () => {
  const beverageItemContainer = document.getElementById(
    "beverage-item-container"
  );

  fetch(
    `https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic`
  )
    .then((res) => res.json())
    .then((data) => {
      for (let i = 0; i < 3; i++) {
        const price = getPin();
        const drink = data.drinks[i];
        globalFoods.push(formatFoodItem({ ...drink, price }, "beverage"));
        const div = document.createElement("div");
        div.classList.add("col");
        div.innerHTML = `
                <div class="card border-0 shadow-lg h-70">
                <img src="${drink.strDrinkThumb}" class="card-img-top" alt="...">
                <div class="card-body">
                <h5 class="card-title">${drink.strDrink}</h5>
                <h5>${price}Tk</h5>
                </div>
                <div class="m-3">
                <button
                    class="foodZone-btn-orderNow"
                    onclick="orderNow(${drink.idDrink})"
                >
                    Order Now
                </button>
                </div>
            </div>`;
        beverageItemContainer.appendChild(div);
      }
    });
};
beverageItem();

const orderNow = (foodId) => {
  const foodItem = globalFoods.find((i) => i.foodId == foodId);

  const orderIndex = cartItem.findIndex((i) => i.foodId == foodId);

  if (orderIndex !== -1) {
    cartItem[orderIndex].count += 1;
  } else {
    cartItem.push({ ...foodItem, count: 1 });
  }
  orderNowHTML();
};

const addToCart = (foodId, type = "inc" | "dec") => {
  const orderIndex = cartItem.findIndex((i) => i.foodId == foodId);

  if (orderIndex !== -1) {
    switch (type) {
      case "inc":
        cartItem[orderIndex].count += 1;
        break;
      case "dec":
        const latestCount = cartItem[orderIndex].count - 1;
        if (latestCount > 0) {
          cartItem[orderIndex].count = latestCount;
        } else if (latestCount === 0) {
          cartItem.splice(orderIndex, 1);
        }
        break;
      default:
        break;
    }
  }

  orderNowHTML();
};

const orderNowHTML = () => {
  let cartTotalItem = 0;
  listCartHTML.innerHTML = "";
  if (cartItem.length > 0) {
    cartItem.forEach((cart) => {
      cartTotalItem += cart.count;
      let newCart = document.createElement("div");
      newCart.classList.add("item");
      newCart.innerHTML = `
            <div class="image">
            <img src="${cart.foodImage}" alt="">
          </div>
          <div class="name">
            ${cart.foodName}
          </div>
          <div class="totalPrice">
          ${cart.foodPrice * cart.count}Tk
          </div>
          <div class="quantity">
            <span class="minus" onclick="addToCart(${
              cart.foodId
            }, 'dec')">-</span>
            <span>${cart.count}</span>
            <span class="plus" onclick="addToCart(${
              cart.foodId
            }, 'inc')">+</span>
          </div>`;
      listCartHTML.appendChild(newCart);
    });
  }
  cartTotalItemHTML.innerHTML = cartTotalItem;
};

const displaySearchResult = (meals) => {
  const searchResult = document.getElementById("search-result");

  meals.forEach((meal) => {
    const price = getPin();
    globalFoods.push(formatFoodItem({ ...meal, price }, "meal"));
    const div = document.createElement("div");
    div.classList.add("col");
    div.innerHTML = `
            <div class="card h-100">
            <img src="${meal.strMealThumb}" class="card-img-top" alt="...">
            <div class="card-body">
            <h5 class="card-title">${meal.strMeal}</h5>
            <h5>${price}TK</h5>
            </div>
            <div class="m-3">
            <button
                class="foodZone-btn-orderNow"
                onclick="orderNow(${meal.idMeal})"
            >
                Order Now
            </button>
            </div>
        </div>`;
    searchResult.appendChild(div);
  });
};
