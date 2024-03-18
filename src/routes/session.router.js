import express from "express"
import passport from "passport"
import userModel from "../Dao/models/userModel.js"
import { createHash } from "../utils.js"

const router = express.Router()

router.post("/register", passport.authenticate("register", { failureRedirect: "/api/sessions/fail" }),
    async (req, res) => res.redirect("/login"))

router.post("/login", passport.authenticate("login", {failureRedirect: "/api/sessions/fail"}),
    async (req, res) => {
        const { user } = req
        if(user) {
            req.session.user = {
                first_name: user.first_name ,
                last_name: user.last_name ,
                email: user.email ,
                age: user.age ,
                role: "user"
            }
            res.redirect("/products")
        }
    })

router.get("/github", passport.authenticate("github", { scope: ["user:email"]}), async (req, res) => {})

router.get("/githubcallback", passport.authenticate("github", {failureRedirect: "/api/sessions/fail"}) ,
    async (req, res) => {
        const { user } = req
        if (user) {
            req.session.user = {
                first_name: user.first_name ,
                last_name: user.last_name ,
                email : user.email ,
                age : user.email ,
                role: "user"
            }
            res.redirect("/products")
        }
    }
)

router.get("/fail", (req, res) => {
    const errorMessage = res.send("Error al Iniciar o Registrarse")
    res.status(401).json({ error: errorMessage})
})


router.post("/restore", async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ error: "Faltan Credenciales"})
        }
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(400).json({ error: "Usuario Inexistente"})
        }
        user.password = createHash(password)
        await user.save()
        res.redirect("/login")
    } catch (error) {
        res.status(500).json({ error: error.message})
    }
})

router.post("/logout", (req, res) => {
    req.session.destroy()
    res.redirect("/login")
})

export default router