import express from "express"
import mongoose from "mongoose"
import handlebars from "express-handlebars"
import session from "express-session"
import MongoStore from "connect-mongo"
import { __dirname } from "./utils.js"
import passport from "passport"

//routes
import productsRouter from "./routes/products.router.js"
import viewsRouter from "./routes/views.router.js"
import cartRouter from "./routes/cart.router.js"
import sessionRouter from "./routes/session.router.js"
import initializePassport from "./config/passport.config.js"


const app = express()
const PORT = 8080
const urlMongo = "mongodb+srv://dagustin001:robertito2210@clusterentregaintegrado.eed0qzq.mongodb.net/entregaLogin?retryWrites=true&w=majority"


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + "/views"))
app.use(express.static(__dirname + "/public"))

app.use(
    session({
        store: MongoStore.create({mongoUrl:urlMongo, ttl:1000}),
        secret: "m!Secr3t",
        resave:false,
        saveUninitialized:true
    })
)

app.engine("handlebars", handlebars.engine())
app.set("views", __dirname + "/views")
app.set("view engine", "handlebars")


app.use("/api/products", productsRouter)
app.use("/api/carts", cartRouter)
app.use("/api/sessions", sessionRouter)
app.use("/", viewsRouter)

//Middlewars para passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());


app.listen(PORT, () => {
    console.log(`Server Online on Port ${PORT}`)
})

mongoose.connect(urlMongo)
.then(()=> {
    console.log("Conectado a la Base de Datos")
})
.catch(error => {
    console.log("Error al conectarse a la Base de Datos", error)
})