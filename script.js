$(document).ready(function(){
  $(".sort .default").click(function(){
    $(".sort .select").toggleClass("active");
  })

  $(".filter .default").click(function(){
    $(".filter .select").toggleClass("active");
  })

  $(".sort .select li").click(function(){
    var currentele = $(this).html();
    $(".sort .default li").html(currentele);
    $(".sort .select").removeClass("active");
  })

  $(".filter .select li").click(function(){
    var currentele = $(this).html();
    $(".filter .default li").html(currentele);
    $(".filter .select").removeClass("active");
  })

  let products;

  $.ajax("https://d2t3o0osqtjkex.cloudfront.net/tgTest/prods.json", {
    type: "GET",
    dataType: "json",
    success: function(data) {
      products = data;
      products.map(item => {
        let wrapper = $(".wrapper");
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
      });
    },
    error: function(req, err, status) {
      console.error("Something went wrong! Status: %s (%s)", status, err)
    }
  })
})