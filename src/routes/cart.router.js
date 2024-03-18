import express from "express"
import productController from "../Dao/controllers/productController.js"
import cartController from "../Dao/controllers/cartController.js"

const router = express.Router()

router.get("/:cid", async (req, res) => {
    try {
        const cid = req.params.cid
        const findedCart = await cartController.getCartById(cid)
        res.json({ status: 'success', payload: findedCart })
    } catch (error) {
        res.send({ status: "ERROR", error: error })
    }
})

router.post("/", async (req, res) => {
    try {
        const createdCart = await cartController.addCart()
        res.json({ status: 'success', payload: createdCart })
    } catch (error) {
        res.send({ status: "ERROR", error: error })
    }
})

router.post("/:cid/products/:pid", async (req, res) => {
    try {
        const cid = req.params.cid
        const pid = req.params.pid
        const quantity = req.body.quantity ?? 1
        const cart = await cartController.addProductToCart(cid, pid, quantity)
        res.json({ status: 'success', payload: cart })
    } catch (error) {
        res.send({ status: "ERROR", error: error })

    }
})

router.put("/:cid", async (req, res) => {
    try {
        const cid  = req.params.cid
        const products = req.body ?? []
        const updatedCart = await cartController.updateCart(cid,products)
        res.json({ status: 'success', payload: updatedCart })
    } catch (error) {
        res.send({ status: "ERROR", error: error })   
        console.log(error)   
    }
})

router.put ("/:cid/products/:pid" , async (req, res) => {
    try {
        const cid = req.params.cid
        const pid = req.params.pid
        const quantity = req.body.quantity ?? 1
        await productController.getProductById(pid)
        const updatedQtysCart = await cartController.updateQuantityOfProduct(cid, pid, quantity)
        res.json({ status: 'success', payload: updatedQtysCart })
    } catch (error) {
        res.send({ status: "ERROR", error: error })    

    }
})

router.delete("/:cid", async (req, res) => {
    try {
        const cid = req.params.cid
        const fullEmptyCart = await cartController.emptyCart(cid)
        res.json({status: "Sucess", payload: fullEmptyCart})
    } catch (error) {
        res.send({ status: "ERROR", error: error })      
    }
})

router.delete("/:cid/products/:pid", async (req, res) =>{
    try {
        const cid = req.params.cid
        const pid = req.params.pid
        const cartWithRemovedProd = await  cartController.removeProductOfOneCart(cid, pid)
        res.json({status: "Sucess", payload: cartWithRemovedProd})
    } catch (error) {
        res.send({ status: "ERROR", error: error })      
    }
})


export default router