// Document Ready
$(function(){
    renderFilterCards();
    renderCatalog();
    renderCart();
});

const arrCart = [];

const tmplFilterCard = function(groupId, label) {
    return `<div class="border border-top-0">
                    <div class="p-2 text-primary font-weight-bold">
                        <a data-toggle="collapse" data-target="#filterGroup${groupId}">${label}</a>
                    </div>
                    <div id="filterGroup${groupId}" class="collapse show">
                        <ul class="list-unstyled pl-3">
                        </ul>
                    </div>
                </div>`
}

const tmplProductCard = function(itemId, name, manufacturer, photo) {
    return `
    <div class="col-sm-12 col-md-6 col-lg-4">
        <div class="card mb-3">
            <img class="card-img-top" src="./assets/images/${photo}" alt="Product">
            <div class="card-body">
                <h5 class="card-title">${name}</h5>
                <p class="card-text">${manufacturer}</p>
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
    $('#catalog').empty();
    for (let i = 0; i < array.length; i++) {
        let itemNo = array[i].itemNo;
        let itemName = array[i].name;
        let itemMfg = array[i].manufacturer;
        let itemPhoto = array[i].photo;
        $('#catalog').append(tmplProductCard(itemNo,itemName,itemMfg,itemPhoto));
    }
}

const renderFilterCards = function() {
    // Create arrays of unique values from catalog object array
    const categories = [...new Set(catalog.map(item => item.category))].sort();
    const manufacturers = [...new Set(catalog.map(item => item.manufacturer))].sort();
    
    $('#refinements').append(`<div class="bg-light p-2 border">Refine Selection:</div>`);
    $('#refinements').append(tmplFilterCard('1','Instruments'));
    for(let i=0; i < categories.length; i++) {
        $('#filterGroup1 ul').append(`<li><input type="checkbox" value="${categories[i]}" data-id="cat${i}"><span class="pl-1">${categories[i]}</span></li>`);
    }
    $('#refinements').append(tmplFilterCard('2','Manufacturers'));
    for(let i=0; i < manufacturers.length; i++) {
        $('#filterGroup2 ul').append(`<li><input type="checkbox" value="${manufacturers[i]}" data-id="mfg${i}"><span class="pl-1">${manufacturers[i]}</span></li>`);
    }
}

const renderRefiners = function() {
    let activeRefiners = $('#refinements').find("input[type='checkbox']:checked");

    if(activeRefiners.length !== 0) {
        $('#refiners').removeClass('d-none');
    } else {
        $('#refiners').addClass('d-none');
    }
    
    $('#refiners').empty();
    activeRefiners.each(function(){
        $('#refiners').append(`<a class="refiner px-2 text-muted" data-id="${$(this).data('id')}"><span class="pr-1">${$(this).val()}</span><i class="far fa-times-circle"></i></a>`);
    });
    
}

// create an object of filter criteria
// Get inputs from refinement section, for each group add the property and selected values, then create the object.
const getRefinements = function() {
    let arrCategory = [];
    let arrManufacturer = [];

    if($('#filterGroup1').find("input[type='checkbox']:checked").length === 0) {
        $('#filterGroup1').find("input[type='checkbox']").each( function() {
            arrCategory.push($(this).val());
        });
    } else {
        $('#filterGroup1').find("input[type='checkbox']:checked").each( function() {
            arrCategory.push($(this).val());
        });
    }

    if($('#filterGroup2').find("input[type='checkbox']:checked").length === 0) {
        $('#filterGroup2').find("input[type='checkbox']").each( function(){
            arrManufacturer.push($(this).val());
        });
    } else {
        $('#filterGroup2').find("input[type='checkbox']:checked").each( function() {
            arrManufacturer.push($(this).val());
        });
    }
    return objFilters = {
        category: arrCategory,
        manufacturer: arrManufacturer
    }
}

// Filter the catalog using a criteria object
const filterCatalog = function(array, filters) {
    const filterKeys = Object.keys(filters);
    return array.filter((item) => {
        return filterKeys.every(key => !!~filters[key].indexOf(item[key]));
    });
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
            $('#cart').append(`<button class="btn btn-outline-primary m-1" data-item-id="${array[i].itemNo}">${array[i].name}</buttion>`);
        }
    }
}

// Add an Item to Cart
const addItemToCart = function(itemId) {
    let item = catalog.find(item => item.itemNo === String(itemId));
    if(!arrCart.includes(item)) {
        arrCart.push(item);
        renderCart();
    } else {
     $('#message-center').html(`<div class="px-3 pb-3 font-italic text-danger small">Customers are limited to 1 of each item. Please make another selection.</div>`);
    }
}

// Remove an Item from the Cart
const removeItemFromCart = function(itemId) {
    let pos = arrCart.findIndex(item => item.itemNo === String(itemId));
    arrCart.splice(pos, 1);
    renderCart();
}

// CALLBACK FUNCTIONS //
$('#catalog').on('click', 'button', function() {
    $('#message-center').empty();
    addItemToCart($(this).data('itemId'));
    if($('#cart').hasClass('show') === false) {
        $('#btnCart').trigger('click');
    }
});

$('#cart').on('click', 'button', function() {
    $('#message-center').empty();
    removeItemFromCart($(this).data('itemId'));
});

$("#refinements").on('change',"input[type='checkbox']", function() {
    $('#message-center').empty();
    objFilters = getRefinements();
    renderRefiners();
    renderCatalog(filterCatalog(catalog, objFilters));
});

$('#refiners').on('click', ".refiner", function(){
    $('#message-center').empty();
    let elTarget = `#refinements input[data-id='${$(this).data('id')}']`;
    $(elTarget).prop('checked', false).trigger('change');
});

// fix to clear message-center when Cart button is clicked
$('#btnCart').click(function(){
    $('#message-center').empty();
});
