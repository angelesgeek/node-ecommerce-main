function removeItem(index) {
  if (carrito.length > 1) {
    carrito.splice(index, 1);
    products.splice(index, 1);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    document.getElementById(`row${index}`).remove();
  } else {
    localStorage.removeItem("carrito");
    products = [];
    setCarritoVacio();
  }

  let cartNumber = document.querySelector(".cart-number");
  cartNumber.innerText = productosEnElCarrito();
  let cartRows = document.querySelector(".cartRows");
  document.querySelector(".totalAmount").innerText = `$ ${calcularTotal(
    products
  )}`;

  toastr.success("Se borro el item del pedido");
}

function setCarritoVacio() {
  cartRows.innerHTML = `
  <tr>     
      <td colspan="5"><div class="alert alert-warning my-2 text-center">No tienes productos en el pedido</div></td>
  </tr>            
  `;
}
function vaciarCarrito() {
  localStorage.removeItem("carrito");
}

function calcularTotal(products) {
  return products.reduce(
    (acum, product) => (acum += product.price * product.quantity),
    0
  );
}


let products = [];
let cartRows = document.querySelector(".cartRows");

if (localStorage.carrito && localStorage.carrito != "[]") {

  carrito = JSON.parse(localStorage.carrito);

  carrito.forEach((item, index) => {

    fetch(`/api/product/${item.id}`)
      .then((res) => res.json())
      .then((product) => {

        if (product && cartRows) {

          cartRows.innerHTML += `
            <tr id="row${index}">
                <th scope="row">${index + 1}</th>
                <td>${product.name}</td>
                <td>$ ${product.price}</td>
                <td class="text-center">${item.quantity}</td>
                <td class="text-center">$ ${parseFloat(
            product.price * item.quantity,
            2
          ).toFixed(2)}</td>
                <td><button class="btn btn-danger btn-sm" onclick=removeItem(${index})><i class="fas fa-trash"></i></button></td>
            </tr>            
            `;

          products.push({
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: item.quantity,

          });

        } else {

          carrito.splice(index, 1);
          localStorage.setItem("carrito", JSON.stringify(carrito));

        }
      })

      .then(() => {

        if (document.querySelector(".totalAmount")) {
          document.querySelector(".totalAmount").innerText = `$ ${calcularTotal(
            products

          )}`;

        }

      });
  });
} else {
  setCarritoVacio();
}

let checkoutCart = document.querySelector('#checkoutCart');
if (checkoutCart) {


  checkoutCart.onsubmit = (e) => {

    e.preventDefault();

    console.log("formData ")

    const formData = {

      orderItems: products,
      paymentMethod: checkoutCart.paymentMethod.value,
      shippingMethod: checkoutCart.shippingMethod.value,
      bill_type: checkoutCart.bill_type.value,
      order_status: checkoutCart.order_status.value,
      comments: checkoutCart.comments.value,
      id_app: checkoutCart.id_app.value,
      userId: userId,
      total: calcularTotal(products),

    };

    console.log("id_app formData " + formData.id_app)

    fetch("/api/checkout", {

      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(formData),
    })

      .then((r) => r.json())
      .then((res) => {

        if (res.ok) {


          vaciarCarrito();

          location.href = `/order/${res.order.id}?creado=true`;

        } else {

          toastr.error("No se pudo realizar la compra, intente mas tarde");

        }

      })

      .catch((error) => console.log(error));

  };

}
