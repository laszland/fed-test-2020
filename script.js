let products = [];
const url = new URL(window.location.href);
const $ = window.$;
const filters = {
  sort: [{ option: 'Sort By', key: '' }, { option: 'Price Hight To Low', key: 'desc' }, { option: 'Proce Low to High', key: 'asc' }],
  filter: [{ option: 'Filters', key: '' }, { option: 'Gold', key: 'gold' }, { option: 'Silver', key: 'silver' }]
};

function renderProducts (products) {
  const productCounter = products.length;
  $('.wrapper').empty();
  products.map(item => {
    const wrapper = $('.wrapper');
    wrapper.append(`
      <article id=${item.id}>
        <img src=${item.image_link_mb} alt=${item.title} class="photo">
        <div>
          <p class="title">${item.title}</p>
        </div>
        <div class="prices">
          <p class="crossed">$${item.crossed_price}</p>
          <p>$${item.price}</p>
        </div>
      </article>
    `);
  });
  $('.filters > p').html(productCounter + ' Results');
}

function renderFilters (filters) {
  const sort = $('.filters .sort .select');
  const filter = $('.filters .filter .select');
  filters.sort.map(item => {
    sort.append(`
      <li>
        <div key=${item.key}>
          <p>${item.option}</p>
        </div>
      </li>
    `);
  });
  filters.filter.map(item => {
    filter.append(`
      <li>
        <div key=${item.key}>
          <p>${item.option}</p>
        </div>
      </li>
    `);
  });
}

function filterProducts (products, filter) {
  return products.filter(product => product.title.toUpperCase().includes(filter));
}

function handleFilter () {
  const filter = url.searchParams.get('filter') ? url.searchParams.get('filter').toUpperCase() : '';
  const sort = url.searchParams.get('sort') ? url.searchParams.get('sort') : 'asc';
  const filteredProducts = filterProducts(products, filter).sort(compare(sort));
  renderProducts(filteredProducts);
}

async function initProducts () {
  products = await $.ajax('https://d2t3o0osqtjkex.cloudfront.net/tgTest/prods.json');
  handleFilter();
}

function initFilters () {
  const sort = url.searchParams.get('sort');
  const filter = url.searchParams.get('filter');
  if (sort) {
    const selected = $(`[key=${sort}]`).parent().html();
    $('.sort .default li').html(selected);
  }
  if (filter) {
    const selected = $(`[key=${filter}]`).parent().html();
    $('.filter .default li').html(selected);
  }
}

function compare (order) {
  return function innerSort (a, b) {
    let comparision = 0;
    if (a.price > b.price) {
      comparision = 1;
    } else if (a.price < b.price) {
      comparision = -1;
    }
    return (
      (order === 'desc') ? (comparision * -1) : comparision
    );
  };
}

function toggleDisplay () {
  $('article').toggleClass('oneItem');
  const buttonText = $('article').hasClass('oneItem') ? 'Two item in a row' : 'One item in a row';
  $(this).html(buttonText);
}

function handleSelectDropDown (filter, value, current) {
  url.searchParams.set(filter, value);
  window.history.replaceState(null, null, url.href);
  handleFilter();
  $(`.${filter} .default li`).html(current);
  $(`.${filter} .select`).removeClass('active');
}

function handleSelectProduct (productID, event) {
  let selectedProduct = {};
  products.map(product => {
    if (product.id === productID) {
      selectedProduct = product;
    }
  });
  const height = `${$(document).height()}`;
  const pixelFromTop = `${event.pageY - 150}`;
  $('.pop-up').addClass('visible').css('height', height + 'px');
  $('.pop-up > div').css('top', pixelFromTop + 'px');
  $('#title').html(selectedProduct.title);
  $('#description').html(selectedProduct.description);
  $('#button').click(function () {
    window.open(selectedProduct.link, '_newtab');
  });
}

$(document).ready(function () {
  initProducts();
  renderFilters(filters);
  initFilters();

  $('.toggleDisplay p').click(function () {
    toggleDisplay();
  });

  $('.sort .default').click(function () {
    $('.sort .select').toggleClass('active');
  });

  $('.filter .default').click(function () {
    $('.filter .select').toggleClass('active');
  });

  $('.sort .select li').click(function () {
    const current = $(this).html();
    const order = $(this).children().attr('key');
    handleSelectDropDown('sort', order, current);
  });

  $('.filter .select li').click(function () {
    var current = $(this).html();
    const filter = $(this).children().attr('key');
    handleSelectDropDown('filter', filter, current);
  });

  $(document).on('click', 'article > img', function (event) {
    const targetID = $(event.target).parent().attr('id');
    handleSelectProduct(targetID, event);
  });

  $(document).on('click', '.pop-up > div > i', function () {
    $('.visible').removeClass('visible');
  });
});
