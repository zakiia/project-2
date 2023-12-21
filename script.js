let globalFoods = []
let cartItem = []
let listCartHTML = document.querySelector('.listCart')
let iconSpanCart = document.querySelector('.shopping span')

let shopping = document.querySelector('.shopping');
let closeCart = document.querySelector('.close')
let body = document.querySelector('body')
const openCart = document.getElementById('open-cart')
shopping.addEventListener('click', () =>{
    openCart.classList.toggle('none')
})

closeCart.addEventListener('click',() =>{
    console.log(`??????????`);
    openCart.classList.toggle('none')
})

function getPin(){
    const pin = Math.round(Math.random() * 1000)
    const pinString = pin + '';
    if(pinString.length == 3){
        return pin;
    }
    else{
        return getPin();
    }
}

const searchFood = () => {
    const searchError = document.getElementById('search-error')
    const displayText = document.getElementById('display-text')
    const searchField = document.getElementById('search-field')
    const searchText = searchField.value;
    searchField.value = '';
    
    if (searchText) {
        const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchText}`
        fetch (url)
        .then (res => res.json())
        .then (data => {
            if (data.meals) {
                globalFoods.splice(0, globalFoods.length)
                globalFoods.push(...data.meals)

                displaySearchResult(data.meals)
                const removeMain = document.getElementById('remove-main')
                removeMain.remove()
                const removeDessert = document.getElementById('remove-dessert')
                removeDessert.remove()
                const removeBeverage = document.getElementById('remove-beverage')
                removeBeverage.remove()
            } else {
                displayText.style.display = 'block';
                searchError.style.display = 'none';
            }
        })
    } else {
        displayText.style.display = 'none';
        searchError.style.display = 'block';
    }
}

const mainMeal = () => {
    const mainMealContent = document.getElementById('main-meal-content')
   
    fetch (`https://www.themealdb.com/api/json/v1/1/filter.php?c=Pork`)
    .then (res => res.json())
    .then (data => {
        for (let i = 0; i < 3; i++) {
            const price = getPin();
            const meal = data.meals[i];
            globalFoods.push(meal)
            const div = document.createElement('div')
            div.classList.add('col')
            div.innerHTML =`
                <div class="card border-0 shadow-lg h-70">
                <img src="${meal.strMealThumb}" class="card-img-top" alt="...">
                <div class="card-body">
                <h5 class="card-title">${meal.strMeal}</h5>
                <h5>${price}Tk</h5>
                </div>
                <div class="m-3">
                <button
                    class="foodZone-btn-orderNow"
                    onclick='orderNow("idMeal", ${meal.idMeal})'
                >
                    Order Now
                </button>
                </div>
            </div>`
            mainMealContent.appendChild(div)
        }
    })

}
mainMeal()

const dessertItem = () => {
    const dessertItemContainer = document.getElementById('dessert-item-container')
   
    fetch (`https://www.themealdb.com/api/json/v1/1/filter.php?c=Dessert`)
    .then (res => res.json())
    .then (data => {
        for (let i = 0; i < 3; i++) {
            const price = getPin();
            const meal = data.meals[i];
            globalFoods.push(meal)
            const div = document.createElement('div')
            div.classList.add('col')
            div.innerHTML =`
                <div class="card border-0 shadow-lg h-70">
                <img src="${meal.strMealThumb}" class="card-img-top" alt="...">
                <div class="card-body">
                <h5 class="card-title">${meal.strMeal}</h5>
                <h5>${price}Tk</h5>
                </div>
                <div class="m-3">
                <button
                    class="foodZone-btn-orderNow"
                    onclick='orderNow("idMeal", ${meal.idMeal})'
                >
                    Order Now
                </button>
                </div>
            </div>`
            dessertItemContainer.appendChild(div)
        }
    })

}
dessertItem()

const beverageItem = () => {
    const beverageItemContainer = document.getElementById('beverage-item-container')
   
    fetch (`https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic`)
    .then (res => res.json())
    .then (data => {
        for (let i = 0; i < 3; i++) {
            const price = getPin();
            const drink = data.drinks[i];
            globalFoods.push(drink)
            const div = document.createElement('div')
            div.classList.add('col')
            div.innerHTML =`
                <div class="card border-0 shadow-lg h-70">
                <img src="${drink.strDrinkThumb}" class="card-img-top" alt="...">
                <div class="card-body">
                <h5 class="card-title">${drink.strDrink}</h5>
                <h5>${price}Tk</h5>
                </div>
                <div class="m-3">
                <button
                    class="foodZone-btn-orderNow"
                    onclick='orderNow("idDrink", ${drink.idDrink})'
                >
                    Order Now
                </button>
                </div>
            </div>`
            beverageItemContainer.appendChild(div)
        }
    })
}
beverageItem()



const orderNow = (key, mealId) => {
    
    const item = globalFoods.find((i) => i[key] == mealId)
    cartItem.push(item)
    orderNowHTML()
}

const orderNowHTML = () => {
    listCartHTML.innerHTML = '';
    if (cartItem.length > 0){
        cartItem.forEach(cart =>{
            const price = getPin();
            let newCart = document.createElement('div');
            newCart.classList.add('item');
            newCart.innerHTML = `
            <div class="image">
            <img src="${cart.strMealThumb}" alt="">
          </div>
          <div class="name">
            Name
          </div>
          <div class="totalPrice">
          ${price}Tk
          </div>
          <div class="quantity">
            <span class="minus">-</span>
            <span>1</span>
            <span class="plus">+</span>
          </div>`;
          listCartHTML.appendChild(newCart)
        })
    }
}


const displaySearchResult = meals => {
    const searchResult = document.getElementById('search-result')
    
    meals.forEach(meal => {
        const price = getPin()
        const div = document.createElement('div')
        div.classList.add('col')
        div.innerHTML =`
            <div class="card h-100">
            <img src="${meal.strMealThumb}" class="card-img-top" alt="...">
            <div class="card-body">
            <h5 class="card-title">${meal.strMeal}</h5>
            <h5>${price}TK</h5>
            </div>
            <div class="m-3">
            <button
                class="foodZone-btn-orderNow"
                onclick='orderNow("idMeal", ${meal.idMeal})'
            >
                Order Now
            </button>
            </div>
        </div>`
        searchResult.appendChild(div)
    })
}
