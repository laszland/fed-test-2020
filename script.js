$(document).ready(function(){
  let products;
  let productCounter = 0;
  let url = new URL(window.location.href);

  $(".sort .default").click(function(){
    $(".sort .select").toggleClass("active");
  })

  $(".filter .default").click(function(){
    $(".filter .select").toggleClass("active");
  })

  $(".sort .select li").click(function(){
    let current = $(this).html();
    let order = $(this).children().attr("key");
    url.searchParams.set('sort', order);
    window.location = url.href;
    $(".sort .default li").html(current);
    $(".sort .select").removeClass("active");
  })

  $(".filter .select li").click(function(){
    var current = $(this).html();
    let filter = $(this).children().attr("key");
    url.searchParams.set('filter', filter);
    window.location = url.href;
    $(".filter .default li").html(current);
    $(".filter .select").removeClass("active");
  })

  function compare(order = 'asc') {
    return function innerSort(a, b) {
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
            <img src=${item.image_link_mb} alt=${item.title} class="photo">
            <div>
              <p class="title">${item.title}</p>
            </div>
            <div class="prices">
              <p class="crossed">$${item.crossed_price}</p>
              <p>$${item.price}</p>
            </div>
            <div class="pop-up">
              <i class="fas fa-times"></i>
              <p class="title">${item.title}</p>
              <p class="description">${item.description}</p>
              <div id="button">BUY NOW</div>
            </div>
          </article>
          `)
          productCounter++;
          $("article").click(function(){
            let popUp = $(this).children('.pop-up');
            popUp.addClass('visible');

          })
        }
      });
      $(".filters > p").html(productCounter + ' Results')
    },
    error: function(req, err, status) {
      console.error("Something went wrong! Status: %s (%s)", status, err)
    }
  })
  $(document).on("click", ".pop-up i", function(){
    $(".visible").removeClass("visible");
  })
})