// Interaction for slider-dots

let dots = document.querySelectorAll("section.slider .slider-dots ul.dots li button");

let dotsScreens = document.querySelectorAll("section.slider .slider-dots div.img");

for (let i = 0; i < dots.length; i++) {

	dots[i].addEventListener("click", () => {
		dots.forEach(dot => {
			dot.classList.remove("active");
		});
		dotsScreens.forEach(screen => {
			screen.classList.remove("active");
		});

		dots[i].classList.add("active");
		dotsScreens[i].classList.add("active");
	});

}

// Interaction for slider-arrows
let arrows = document.querySelectorAll("section.feat-prod .slider-arrows .arrows button");

let arrowScreens = document.querySelectorAll("section.feat-prod .slider-arrows .items .screen");

// Initial states
let focus = 1;
arrowScreens[focus].classList.add("active");

arrows[0].addEventListener("click", () => {

	focus--;
	if (focus < 0) {
		focus = 0;
	}

	arrowScreens.forEach(screen => {
		screen.classList.remove("active");
	});

	arrowScreens[focus].classList.add("active");
});

arrows[1].addEventListener("click", () => {

	focus++;
	if (focus > arrowScreens.length - 1) {
		focus = arrowScreens.length - 1;
	}

	arrowScreens.forEach(screen => {
		screen.classList.remove("active");
	});

	arrowScreens[focus].classList.add("active");
});

// Buy now button .
const buyNow = document.querySelector("section.pop-items div.items div.item div.paired button");

buyNow.addEventListener("click",() => {
    addItem("cart");
  },
  true
);

// Add to cart buttons
let addToCart = document.querySelectorAll("section.pop-items button.addToCart");

addToCart.forEach(button => {

	button.addEventListener("click", () => {
		addItem("cart");
	}, true);

});



// Add to wishlist buttons
const wishlist = document.querySelector("header nav ul.nav-manage a#wishlist > span");
getData("../json/amounts.json", (data) => {
	wishlist.innerText = data.amounts.wishlistAmount;
});

let addToWishlist = document.querySelectorAll("section.pop-items button.addToWishlist");

addToWishlist.forEach(button => {

	button.addEventListener("click", () => {
		addItem("wishlist");
	}, true);

});

// Load more .................................................
const loadMoreBtn = document.getElementById("loadMore");

let itemsLoaded = 0;

loadMoreBtn.addEventListener("click" , () => {

	// Find the item box
	const popItems = document.querySelector("section.pop-items div.items");

	// Load JSON
	firebase.database().ref("/items")
	.once('value', snap => {

		// How many items are loaded already
		if (itemsLoaded < snap.val().length) {

			for (let i = itemsLoaded; i < itemsLoaded + 4; i++) {

				if (i < snap.val().length) {
					// Form HTML
					let newItem = createItem(
						snap.val()[i].image,
						snap.val()[i].name,
						snap.val()[i].price
					);

					popItems.append(newItem);
				} else {
					loadMoreBtn.innerText = "All items are loaded"
					loadMoreBtn.classList.remove("enabled");
					break;
				}
			}

			itemsLoaded += 4;
		}

	});

}, true);


function addItem (branchName) {

	// Get items count to form new id
	firebase.database().ref(`/amounts/${branchName}`)
	.once('value', snap => {

		let newID = snap.val().length;

		firebase.database().ref(`/amounts/${branchName}/${newID}`)
		.update({
			image: "https://firebasestorage.googleapis.com/v0/b/osf-academy-frontend.appspot.com/o/items%2Fitem2.jpg?alt=media&token=765a5d78-8358-43dc-baa0-438b4570f127",
			name: "Hay - About A Lounge Chair AAL 93",
			price: "659.55"
		});

		// Update HTML
		firebase.database().ref(`/amounts/${branchName}`)
		.once('value', snap => {
			if (branchName === "cart") {
				cartSpan.innerText = snap.val().length;
			} else if (branchName === "wishlist") {
				wishlistSpan.innerText = snap.val().length;
			}
		});

	});

}

// Create item
function createItem (imageURL, name, price) {

	let item = document.createElement("div");
	item.classList.add("item");

	let itemImage = document.createElement("div");
	itemImage.classList.add("img");
	itemImage.style.backgroundImage = `url(${imageURL})`;
	item.append(itemImage);

	let itemName = document.createElement("h4");
	itemName.classList.add("name");
	itemName.innerText = name;
	item.append(itemName);

	let itemPrice = document.createElement("span");
	itemPrice.innerText = "$ " + price;
	item.append(itemPrice);


	let itemOverlay = document.createElement("div");
	itemOverlay.classList.add("overlay");

	let itemCart = document.createElement("button");
	itemCart.classList.add("addToCart");
	let cartImage =  document.createElement("img");
	cartImage.src = "img/icons/plus.svg";
	itemCart.append(cartImage);
	itemOverlay.append(itemCart);

	let itemWishlist = document.createElement("button");
	itemWishlist.classList.add("addToWishlist");
	let wishlistImage =  document.createElement("img");
	wishlistImage.src = "img/icons/heart-filled.svg";
	itemWishlist.append(wishlistImage);
	itemOverlay.append(itemWishlist);

	item.append(itemOverlay);

	return item;
}