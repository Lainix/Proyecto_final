$(document).ready(() => {

  $('#ejecutar').on('click', function (event) {
    event.preventDefault();
    $('.caja').show();
    $('.caja2').hide();
  });

  $('#ejecutar2').on('click', function (event) {
    event.preventDefault();
    $('.caja2').show();
    $('.caja').hide();
  });

  $('#cart').on('click', function (event) {
    event.preventDefault();
    $('#cart-items').show();
  });

  $('#close').on('click', function (event) {
    event.preventDefault();
    $('#cart-items').hide();
  });

  const mercado = () => {
    $.ajax({
      url: `https://api.mercadolibre.com/sites/MLA/search?q=organico`,
      type: 'GET',
      crossDomain: true,
      datatype: 'json',
      success: function (response) {
        for (var i = 0; i <= 5; i++) {
          var photo = response.results[i].thumbnail;
          console.log(photo);

          var titleProduct = response.results[i].title;
          var priceProduct = '$' + '' + response.results[i].price;
          var template = `<div class="card" style="width: 18rem;">
                        <div class="card-body">
                            <img class="card-img-top" style="width: 10rem;" src="${photo}" alt="Card image cap">
                            <h5 class="card-title">${titleProduct}</h5>
                            <p class="card-text">${priceProduct}</p>
                            <a href="#" class="btn btn-primary" style="background-color:#77a8a8">Agregar al carro</a> 
                            <div id="paypal-button"></div>                        
                        </div>
                     </div>`;

          $('#product').append(template);
        };
      }
    }).done((response) => {
      console.log(response);
      console.log(response.results["0"].thumbnail);
    });
  }
  mercado();

  const porductosOrganicos = () => {
    $.ajax({
      url: `https://api.mercadolibre.com/sites/MLA/search?q=productos%20organico`,
      type: 'GET',
      crossDomain: true,
      datatype: 'json',
      success: function (response) {
        for (var i = 0; i <= 5; i++) {
          var photo = response.results[i].thumbnail;
          console.log(photo);

          var titleProduct = response.results[i].title;
          var priceProduct = '$' + '' + response.results[i].price;
          var template = `<div class="card" style="width: 18rem;">
                        <div class="card-body">
                            <img class="card-img-top" style="width: 10rem;" src="${photo}" alt="Card image cap">
                            <h5 class="card-title">${titleProduct}</h5>
                            <p class="card-text">${priceProduct}</p>
                            <a href="#" class="btn btn-primary" style="background-color:#77a8a8">Agregar al carro</a>  
                            <div id="paypal-button"></div>                          
                        </div>
                     </div>`;

          $('#productOrganic').append(template);
        };
      }
    }).done((response) => {
      console.log(response);
      console.log(response.results["0"].thumbnail);
    });
  }
  porductosOrganicos();


  paypal.Button.render({
    env: 'sandbox',
    client: {
      sandbox: 'AeXSfeSjCOFR8f0nEcVRxbIaI8g9TBWGMMBGHE-2PfFwa0TFoU0t40zltz0FBpw6K73t_7HfMEJ3DOBE',
      production: '<insert production client id>'
    },
    payment: function () {
      var env = this.props.env;
      var client = this.props.client;
      return paypal.rest.payment.create(env, client, {
        transactions: [
          {
            amount: { total: '1.00', currency: 'USD' }
          }
        ]
      });
    },
    commit: true,
    onAuthorize: function (data, actions) {
      return actions.payment.execute()
        .then(function () {
          window.alert('Gracias por tu compra!');
        });
    }
  }, '#paypal-button');



  $(".add-to-cart").click(function (event) {
    event.preventDefault();
    var name = $(this).attr("data-name");
    var price = Number($(this).attr("data-price"));

    addItemToCart(name, price, 1);
    displayCart()
  });


  function displayCart() {
    var cartArray = listCart();
    var output = "";
    for (var i in cartArray) {
      output += "<li>" + cartArray[i].name + " " + cartArray[i].count + "</li>"
    }
    $("#show-cart").html(output);
    $("#total-cart").html(totalCart());
  }

  var cart = [];

  var Item = function (name, price, count) {
    this.name = name
    this.price = price
    this.count = count
  }

  function addItemToCart(name, price, count) {
    for (var i in cart) {
      if (cart[i].name == name) {
        cart[i].count += count;
        saveCart();
        return;
      }
    }
    var item = new Item(name, price, count);
    cart.push(item);
    saveCart();
  }


  function removeItemFromCart(name) {
    for (var i in cart) {
      if (cart[i].name === name) {
        cart[i].count--;
        if (cart[i].count === 0) {
          cart.splice(i, 1);
        }
        break;
      }
    }
    saveCart();
  }

  function removeItemFromCartAll(name) {
    for (var i in cart) {
      if (cart[i].name === name) {
        cart.splice(i, 1);
        break;
      }
    }
    saveCart();
  }

  function clearCart() {
    cart = [];
    saveCart();
  }


  function countCart() {
    var totalCount = 0;
    for (var i in cart) {
      totalCount += cart[i].count;
    }
    return totalCount;
  }

  console.log(countCart());

  function totalCart() {
    var totalCost = 0;
    for (var i in cart) {
      totalCost += cart[i].price * cart[i].count;
    }
    return totalCost;
  }

  function listCart() {
    var cartCopy = [];
    for (var i in cart) {
      var item = cart[i];
      var itemCopy = {};
      for (var p in item) {
        itemCopy[p] = item[p];
      }
      cartCopy.push(itemCopy);
    }
    return cartCopy;
  }

  function saveCart() {
    localStorage.setItem("shoppingCart", JSON.stringify(cart));
  }


  function loadCart() {
    cart = JSON.parse(localStorage.getItem("shoppingCart"));
  }

  loadCart();

  displayCart();

});




