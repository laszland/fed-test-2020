let products = [];
const url = new URL(window.location.href);
const $ = window.$;

function renderProducts (products) {
  let productCounter = 0;
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
    productCounter++;
  });
  $('.filters > p').html(productCounter + ' Results');
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
  console.log(sort, filter);
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

$(document).ready(function () {
  initProducts();
  initFilters();

  $('.toggleDisplay p').click(function () {
    $('article').toggleClass('oneItem');
    const buttonText = $('article').hasClass('oneItem') ? 'Two item in a row' : 'One item in a row';
    $(this).html(buttonText);
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
    url.searchParams.set('sort', order);
    window.history.replaceState(null, null, url.href);
    handleFilter();
    $('.sort .default li').html(current);
    $('.sort .select').removeClass('active');
  });

  $('.filter .select li').click(function () {
    var current = $(this).html();
    const filter = $(this).children().attr('key');
    url.searchParams.set('filter', filter);
    window.history.replaceState(null, null, url.href);
    handleFilter();
    $('.filter .default li').html(current);
    $('.filter .select').removeClass('active');
  });

  $(document).on('click', 'article > img', function (event) {
    const targetID = $(event.target).parent().attr('id');
    let target = {};
    products.map(product => {
      if (product.id === targetID) {
        target = product;
      }
    });
    const height = `${$(document).height()}`;
    const pixelFromTop = `${event.pageY - 150}`;
    $('.pop-up').addClass('visible').css('height', height + 'px');
    $('.pop-up > div').css('top', pixelFromTop + 'px');
    $('#title').html(target.title);
    $('#description').html(target.description);
    $('#button').click(function () {
      window.open(target.link, '_newtab');
    });
  });

  $(document).on('click', '.pop-up > div > i', function () {
    $('.visible').removeClass('visible');
  });
});
