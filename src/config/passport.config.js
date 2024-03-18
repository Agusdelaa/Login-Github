import passport from "passport";
import local from "passport-local"
import github from "passport-github2"

import userModel from "../Dao/models/userModel.js"
import { createHash, isValidPassword } from "../utils.js";

const localStrategy = local.Strategy

const initializePassport = () => {

    passport.use("register", new localStrategy(
        { passReqToCallback: true, usernameField: "email"} ,
        async (req, username , password, done) => {
            try {
                const {first_name, last_name , email } = req.body
                console.log("PEPE",{first_name, last_name , email })
                if (!first_name || !last_name || !email || !password) {
                    return done("Faltan Datos")
                }
                const user = await userModel.findOne({ email: username})
                if (user) {
                    return done('usuario ya registrado')
                }
                const newUser = {
                    first_name ,
                    last_name ,
                    email ,
                    age ,
                    password : createHash(password)
                }
                const result = await userModel.create(newUser)
                return done(null, result)
            } catch (error) {
                return done('error al registrarse', error)
            }
        }
    ))

    passport.use("login", new localStrategy(
        { passReqToCallback: true, usernameField: "email"} ,
        async( req, username, password, done) => {
            try {
               const user = await userModel.findOne({ email: username})
               if (!user) {
                return done('Usuario inexistente')

               }
               if (!isValidPassword(password, user)) {
                    return done("Contraseña Incorrecta")
               } 
               return done(null, user)
            } catch (error) {
                return done("Error al loguearse", error)
            }
        }
    ))

    passport.use("github", new github.Strategy({
        clientID: "Iv1.6eb09b6feda56a8f",
        clientSecret: "e23ce1dc461cf559e0a2e7cbd6aa99043e1d1441",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, 
        async (accessToken, refreshToken , profile, done) => {
            try {
                const user = await userModel.findOne({ email: profile._json.email})
                if (user) {
                    return done(null, user)
                } else {
                    const newUser = {
                        first_name: profile._json.name ,
                        last_name: "" ,
                        email: profile._json.email ,
                        age: 18 ,
                        password: ""
                    }
                    const result = await userModel.create(newUser)
                    return done(null, result)
                }
            } catch (error) {
                return done("Error al loguearse", error)                
            }
        }
    ))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await userModel.findOne({ _id : id })
            done(null, user)
        } catch (error) {
            done("Error al deserializar usuario:", error)
        }
    })
}

export default initializePassport