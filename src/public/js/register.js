
const form = document.querySelector("#form-register")

form.addEventListener("submit", (e) => {
    e.preventDefault()

    const data = new FormData(form)
    const obj = {}


    data.forEach((value, key) => (obj[key] = value))

    fetch("/api/session/register", {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
          "Content-Type": "application/json",
        },
      })
    .then((res) => res.json())
    .then((result) => {
        if (result.status === "success") {
            Swal.fire({
                title: "Usuario creado correctamente",
                icon: "success" ,
                confirmButtonText: "LOGIN" 

            }).then((result) => {
                if (result.isConfirmed) window.location.href = "/login"
            })
        } else {
            Swal.fire({
                title: "Error en el registro" ,
                icon: "error" ,
                text: result.status 
            })
        }
    }) 
    .catch((error) => {
        Swal.fire({ 
            title: "Error al Registrarse" ,
            icon: "error" ,
            text: `ERROR ${error}` 
        })
    })
})