function productosEnElCarrito() {
  return localStorage.carrito ? JSON.parse(localStorage.carrito).length:0;

}

window.addEventListener("load", function () {
  /*  Animations initialization */
  new WOW().init();

  /* Toastr Initialization */
  toastr.options = {
    positionClass: "toast-bottom-right",
    fadeIn: 300,
    fadeOut: 1000,
    timeOut: 5000,
    extendedTimeOut: 1000,
  };

let botonesComprar = document.querySelectorAll(".agregar_carrito")
let cartNumber = document.querySelector(".cart-number")
cartNumber.innerText = productosEnElCarrito();

botonesComprar.forEach((boton)=>{
  //escuchar click
  boton.addEventListener("click",(e)=> { 
    //console.log(e.target.dataset.id);

    /*Hay carrito en local storage */
    if (localStorage.carrito) {
      let carrito = JSON.parse(localStorage.carrito);
      let index = carrito.findIndex((prod) => prod.id == e.target.dataset.id);
      if (index != -1) {
        carrito[index].quantity = carrito[index].quantity + 1;
      } else {
        carrito.push({ id: e.target.dataset.id, quantity: 1 });
      }
      localStorage.setItem("carrito", JSON.stringify(carrito));
    } else {
      localStorage.setItem(
        "carrito",
        JSON.stringify([{ id: e.target.dataset.id, quantity: 1 }])
      );
    }
    toastr.success("Se agregó el producto al pedido");
   

  });
});
});
