$(document).ready(function(){
  $(".sort .default").click(function(){
    $(".sort .select").toggleClass("active");
  })

  $(".filter .default").click(function(){
    $(".filter .select").toggleClass("active");
  })

  let url = new URL(window.location.href);
  console.log(url);

  $(".sort .select li").click(function(){
    let current = $(this).html();
    let order = $(this).children().attr("key");
    url.searchParams.set('sort', order);
    window.location = url.href;
    console.log(url);
    $(".sort .default li").html(current);
    $(".sort .select").removeClass("active");
  })

  $(".filter .select li").click(function(){
    var current = $(this).html();
    let filter = $(this).children().attr("key");
    url.searchParams.set('filter', filter);
    window.location = url.href;
    console.log(url);
    $(".filter .default li").html(current);
    $(".filter .select").removeClass("active");
  })

  let products;
  let productCounter = 0;

  function compare(order = 'asc') {
    return function innerSort(a, b) {
      console.log(order);
      let comparision = 0;
      if (a.price > b.price) {
        comparision = 1;
      } else if (a.price < b.price) {
        comparision = -1;
      }
      return (
        (order === 'desc') ? (comparision * -1) : comparision
      );
    }
  }

  $.ajax("https://d2t3o0osqtjkex.cloudfront.net/tgTest/prods.json", {
    type: "GET",
    dataType: "json",
    success: function(data) {
      products = data.sort(compare(url.searchParams.get('sort')));
      products.map(item => {
        let wrapper = $(".wrapper");
        let filter = url.searchParams.get('filter') ? url.searchParams.get('filter').toUpperCase() : "";
        if (item.title.toUpperCase().includes(filter)) {
          wrapper.append(`
          <article>
            <img src=${item.image_link_mb} alt=${item.title}>
            <div>
              <p class="title">${item.title}</p>
            </div>
            <div class="prices">
              <p class="crossed">$${item.crossed_price}</p>
              <p>$${item.price}</p>
            </div>
          </article>
          `)
        }
        productCounter++;
      });
      $(".filters > p").html(productCounter + ' Results')
    },
    error: function(req, err, status) {
      console.error("Something went wrong! Status: %s (%s)", status, err)
    }
  })
})