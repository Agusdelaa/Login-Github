import { Router } from "express"
import productController from "../Dao/controllers/productController.js"
//model

const router = Router()

router.get("/", async (req, res) =>{
    try {
        const products = await productController.getProducts(req)
        res.json({
            status: 'success',
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.prevLink,
            nextLink: products.nextLink
        });
    } catch (error) {
        res.send({ status: "ERROR", error: error })
    }
})

router.get("/:pid", async(req, res) => {
    try {
        const pid = req.params
        const findedProduct = await productController.getProductById(pid)
        res.json({ status: 'success', payload: findedProduct })
    } catch (error) {
        res.send({ status: "ERROR", error: error })
        
    }
})

router.post("/" , async (req, res) => {
    try {
        const product = req.body
        const createdProduct = await productController.addProduct(product)
        res.json({ status: 'success', payload: createdProduct })
    } catch (error) {
        res.send({ status: "ERROR", error: error })
    }
})

router.put("/:pid", async (req, res) => {
    try {
        const pid = req.params.pid
        const product = req.body
        const updatedProduct = await productController.updateProduct(pid, product)
        res.json({ status: 'success', payload: updatedProduct })
    } catch (error) {
        res.send({ status: "ERROR", error: error })
        
    }
})

router.delete("/:pid", async (req,res) => {
    try {
        const pid = req.params.pid
        const deletedProduct = await  productController.deleteProduct(pid)
        res.json({ status: 'success', payload: deletedProduct })
    } catch (error) {
        res.send({ status: "ERROR", error: error })
    }
})

export default router