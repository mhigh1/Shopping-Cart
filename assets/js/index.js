// $('#btnCart').on('click', function() {
//     $('#cart').toggle('d-none');
// });

// Create an array of unique values from array of objects;
//const categories = [...new Set(catalog.map(item => item.category))]


$(function(){
    renderCatalog();
});


const arrCart = [];


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

const addItemToCart = function(itemId) {
    let pos = catalog.map(item => item.itemNo).indexOf(itemId)
    let item = catalog[pos];
    $('#cart').append(`<button>${item.name}</buttion>`);
}


// CALLBACK FUNCTIONS //

$('button').on('click', function() {
    console.log('click');
});