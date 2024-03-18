
const form = document.querySelector("#form-login")

form.addEventListener("submit", (e) => {
    e.preventDefault()

    const data = new FormData(form)
    const obj = {}

    data.forEach((value, key) => (obj[key] = value))

    fetch("/api/session/login", {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
          "Content-Type": "application/json",
        },
    })
    
    .then((res) => res.json())
    .then ((result) => {
        if (result.status === "success"){
            window.location.href = "/products"  
        }  else {
            Swal.fire ({
                title: "Error al iniciar sesion" ,
                icon: "error",
                text: result.status,
                timer: 3000
            })
        }
    })

    .catch ((error) => {
        Swal.fire({
            title: "Error en el ingreso",
            icon: "error" ,
            text: error ,
            timer: 4000
        })
    })
})
