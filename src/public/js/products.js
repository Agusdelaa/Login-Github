// import Swal from "sweetalert2";

let cartId = sessionStorage.getItem("cartId")

 async function createCart () {
    try {
        const response = await fetch("/api/carts", {method: "POST"}) 
        const data = await response.json()
        if (data.status === 'success') {
            cartId = data.payload._id;
            sessionStorage.setItem('cartId', cartId);
            return cartId;
        }
        else {
            throw new Error(data.error);
        }
    } catch (error) {
        alert(error.message || 'Error al crear el carrito');
    }
}

async function addProductToCart(productId) {
    try {
        if (!cartId) {
            cartId = await createCart();
        }
  
        const response = await fetch(`/api/carts/${cartId}/products/${productId}`, { method: 'POST' });
        const data = await response.json();
        if (data.status === 'success') {
            alert('Producto agregado al carrito');
        }
    } catch (error) {
        alert(error.message || 'Error al agregar el producto al carrito');
    }

}

async function viewCart() {
    try {
        if (!cartId) {
            cartId = await this.createCart()
        }
        window.location.href = `/carts/${cartId}`
    } catch (error) {
        alert(error.message || 'Error al ver el carrito')
    }
}

async function logout() {

    await fetch("/api/session/logout")
    .then((res) => res.json())
    .then((data) => {
        if (data.status === "success") {
            window.location.href = "/login"
        }
    })
    .catch((error) => {
        Swal.fire({
            title: "Error al desloguearse" ,
            icon: "error" ,
            text: error
        })
    })
}