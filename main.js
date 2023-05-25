let mainWrapper = document.getElementById("main-wrapper");
let cartAmount = document.getElementById("cart-amount");
let homeButton = document.getElementById("home-button");

let products = [];
let cart = [];

// Fel: getAllProducts(); saknar parenteser efter funktionen
getAllProducts();
cartAmount.addEventListener("click", () => {
  renderCart(cart);
});

homeButton.addEventListener("click", () => {
  renderProductList(products);
});

// Denna funktion ansvarar för att rita ut en specifik produkt i mer detalj.
function renderProductDetail(product) {
  mainWrapper.innerHTML = "";
  let main = document.createElement("main");

  let article = document.createElement("article");
  article.classList.add("product-detail");

  let title = document.createElement("h3");
  let thumbnail = document.createElement("img");
  let description = document.createElement("p");
  let price = document.createElement("span");
  let rating = document.createElement("span");
  let buyButton = document.createElement("button");

  thumbnail.width = "300";
  thumbnail.height = "300";
  description.innerText = product.description;
  title.innerText = product.title;
  thumbnail.src = product.thumbnail;
  price.innerText = "$" + product.price;
  rating.innerText = product.rating;
  buyButton.innerText = "Lägg i varukorg";

  buyButton.addEventListener("click", () => {
    addProductToCart(product);
    renderCartAmount(cart.length);
  });

  article.append(title, thumbnail, description, price, rating, buyButton);
  main.append(article);

  mainWrapper.append(main);
}

// Denna funktion ansvarar för att rita ut alla produkter som man har i varukorgen.
function renderCart(cart) {
  mainWrapper.innerHTML = "";
  let main = document.createElement("main");
  main.classList.add("cart-list");

  let totalPrice = document.createElement("span");
  let calculateTotalPrice = () => {
    let price = 0;
    for (let cartItem of cart) {
      price += cartItem.amount * cartItem.product.price;
    }
    totalPrice.innerText = "$" + price;
  };

  for (let cartItem of cart) {
    let element = createCartItemElement(cart, cartItem, calculateTotalPrice);
    element.classList.add("cart-item");

    main.append(element);
  }

  let buyButton = document.createElement("button");

  calculateTotalPrice();
  buyButton.innerText = "Beställ";

  main.append(totalPrice, buyButton);
  mainWrapper.append(main);
}

// Denna funktion ansvarar för att skapa varje enskild produkt i varukorgen som sedan ritas ut.
function createCartItemElement(cart, cartItem, calculateTotalPrice) {
  let article = document.createElement("article");

  let title = document.createElement("h6");
  let thumbnail = document.createElement("img");
  let description = document.createElement("p");
  let price = document.createElement("span");
  let incButton = document.createElement("button");
  let decButton = document.createElement("button");
  let amount = document.createElement("span");

  thumbnail.width = "40";
  thumbnail.height = "40";
  description.innerText = cartItem.product.description;
  title.innerText = cartItem.product.title;
  thumbnail.src = cartItem.product.thumbnail;
  price.innerText = "$" + cartItem.amount * cartItem.product.price;
  amount.innerText = cartItem.amount;
  incButton.innerText = "+";
  decButton.innerText = "-";

  let changeAmount = (newAmount) => {
    cartItem.amount = newAmount;
    price.innerText = "$" + cartItem.amount * cartItem.product.price;
    amount.innerText = cartItem.amount;

    if (newAmount === 0) {
      let index = cart.findIndex(
        (all) => all.product.id === cartItem.product.id
      );
      if (index === -1) {
        return;
      }

      cart.splice(index, 1);
      article.remove();
      renderCartAmount(cart.length);
    }
    // Logisk bugg: Glömde att uppdatera totalpriset när mängden ändras
    // calculateTotalPrice();
  };

  incButton.addEventListener("click", () => {
    // Fel: För mycket plus-tecken
    changeAmount(cartItem.amount + 1 + 1);
  });
  decButton.addEventListener("click", () => {
    // Fel: För mycket minus-tecken
    changeAmount(cartItem.amount--);
  });

  article.append(
    title,
    thumbnail,
    price,
    description,
    amount,
    incButton,
    decButton
  );
  return article;
}

// Denna funktion är till för att hämta alla produkter från dummy-api API:et.
function getAllProducts() {
  fetch("https://dummyjson.com/products")
    .then((res) => res.json())
    .then((productsObject) => {
      // Håll koll på alla produkter genom 'products' variabeln.
      products = productsObject.products;

      // Rita ut alla produkter på webbsidan med en funktion.
      renderProductList(products);
    });
}

// Denna funktion ritar ut produkter på webbsidan med titel, bild och pris för varje produkt.
function renderProductList(products) {
  mainWrapper.innerHTML = "";

  let main = document.createElement("main");
  main.classList.add("product-list");
  for (let product of products) {
    let element = createProductItemElement(product);
    element.classList.add("product-item");
    main.append(element);
  }

  mainWrapper.append(main);
}

// Denna funktion ansvarar för att skapa varje enskild produkt artikel (med titel, bild och pris).
function createProductItemElement(product) {
  let article = document.createElement("article");

  let title = document.createElement("h6");
  let thumbnail = document.createElement("img");
  let price = document.createElement("span");
  let buyButton = document.createElement("button");

  thumbnail.width = "40";
  thumbnail.height = "40";
  title.innerText = product.title;
  thumbnail.src = product.thumbnail;
  price.innerText = "$" + product.price;
  buyButton.innerText = "Lägg i varukorg";
  buyButton.classList.add("product-buy-button");

  buyButton.addEventListener("click", (event) => {
    event.stopPropagation();
    addProductToCart(product);
    renderCartAmount(cart.length);
  });

  article.addEventListener("click", (product) => {
    renderProductDetail(product);
  });

  article.append(title, thumbnail, price, buyButton);
  return article;
}

// Denna funktion ansvarar för att lägga till en produkt, med ett antal, i varukorgen.
// Den ansvarar INTE för att rita ut varukorgen eller produkterna.
function addProductToCart(product) {
  let index = cart.findIndex((all) => all.product.id === product.id);
  if (index == -1) {
    cart[index].amount++;
  } else {
    cart.push({
      product: product,
      amount: 1,
    });
  }
}

// Denna funktion ansvarar för att visa upp antalet produkter man har i varukorgen i headern.
function renderCartAmount(amount) {
  cartAmount.innerText = "Produkt: " + amount;
}
