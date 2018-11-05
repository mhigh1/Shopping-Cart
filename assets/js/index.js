// Create an array of unique values from array of objects;
//const categories = [...new Set(catalog.map(item => item.category))]
// Document Ready
$(function(){
    renderCatalog();
    renderCart();
});

const arrCart = [];

const lookupItemByProperty = function(array, property, value) {
    for (let i = 0; i < array.length; i++) {
        if (array[i][property] === value) {
            return array[i];
        }
    }
    return null;
}

const tmplFilterCard = function() {
    return `

    `
}

const tmplProductCard = function(itemId, name, description, photo) {
    return `
    <div class="col-sm-12 col-md-6 col-lg-4">
        <div class="card mb-3">
            <img class="card-img-top" src="./assets/images/${photo}" alt="Product">
            <div class="card-body">
                <h5 class="card-title">${name}</h5>
                <p class="card-text">${description}</p>
            </div>
            <div class="card-footer">
                <button type="button" class="btn btn-primary float-right" data-item-id="${itemId}">Add to Cart</button>
            </div>
        </div>
    </div>
    `
}

const renderCatalog = function(array) {
    if (!array) {
        array = catalog;
    }

    for (let i = 0; i < array.length; i++) {
        let itemNo = array[i].itemNo;
        let itemName = array[i].name;
        let itemDesc = array[i].description;
        let itemPhoto = array[i].photo;
        $('#catalog').append(tmplProductCard(itemNo,itemName,itemDesc,itemPhoto));
    }
}


// Render Shopping Cart
const renderCart = function(array) {
    if (!array) {
        array = arrCart;
    }
    $('#cart').empty();
    if(!array.length) {
        $('#cart').html(`<span class="font-italic">Your cart is empty.</span>`);
    } else {
        for(let i = 0; i < array.length; i++) {
            $('#cart').append(`<button class="btn btn-outline-primary" data-item-id="${array[i].itemNo}">${array[i].name}</buttion>`);
        }
    }
}

// Add an Item to Cart
const addItemToCart = function(itemId) {
    let item = catalog.find(item => item.itemNo === String(itemId));
    arrCart.push(item);
    renderCart();
}

// Remove an Item from the Cart
const removeItemFromCart = function(itemId) {
    let pos = arrCart.findIndex(item => item.itemNo === String(itemId));
    arrCart.splice(pos, 1);
    renderCart();
}

// CALLBACK FUNCTIONS //
$('#catalog').on('click', 'button', function() {
    addItemToCart($(this).data('itemId'));
    if($('#cart').hasClass('show') === false) {
        $('#btnCart').trigger('click');
    }
});

$('#cart').on('click', 'button', function() {
    removeItemFromCart($(this).data('itemId'));
});

