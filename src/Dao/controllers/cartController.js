import cartModel from "../models/cartModel.js"
import productController from "./productController.js"

class  CartController {

    async addCart() {
        try {
            let  cart = {
                products : []
            }
            cart = await cartModel.create(cart)
            return  cart
        } catch (error) {
            throw  error
        }
    }

     async getCartById(cid) {
        try {
            let findedCart = await cartModel.findOne({_id : cid}).populate("products.productId").lean()
            if (!findedCart) {
                throw `No se encontro el carrito con el ${cid}`
            }
            return findedCart
        } catch (error) {
            throw error
        }
    }

    async addProductToCart(cid, pid, qty) {
        try {
            await productController.getProductById(pid)
            let cart = await this.getCartById(cid)
           
            const productIndex = cart.products.findIndex(product => product.productId._id.toString() === pid) 
            // console.log("Soy Boolean", product.productId._id.toString() === pid )})
            //console.log(productIndex, "SOY INDEX")
            if (productIndex !== -1) {
                cart.products[productIndex].quantity += 1
            } else {
                cart.products.push({ productId: pid, quantity: 1 });
                
            }

            await cartModel.updateOne({_id:cid},{$set: {products: cart.products}})
            return await this.getCartById(cid)
        } catch (error) {
            throw error
        }
    }

    async deleteProduct(cid, pid) {
        try {
            await productController.getProductById(pid)
            let cart = await this.getCartById(cid)
            let productIndex = cart.products.findIndex(product => product.productId._id.toString()  === pid)
            if (productIndex === -1){
                throw `Error no se encontro el producto con id: ${pid} en el carrito de id: ${cid}`
            } else {
                cart.products.splice(productIndex, 1)
            }
            cart = await cartModel.updateOne({_id:cid}, {products: cart.products})
            return  cart
        } catch (error) {
            throw  error
        }
    }

    async updateCart(id, products) {
        try {
            let cart = await this.getCartById(id)
            let changes = false
            for (let product of products) {
                for (let cartProduct of cart.products) {
                    if (product.product === cartProduct._id.toString()) {
                        cartProduct.quantity = product.quantity;
                        changes = true;
                    }
                }
                if (!changes) {
                    cart.products.push(product);
                }
                changes = false;
            }
            cart = await cartModel.updateOne({_id: id}, {products: cart.products})
            return cart
        } catch (error) {
            throw  error
            
        }
    }

    async updateQuantityOfProduct(cid, pid, qty) {
        try {
            let cart = await this.getCartById(cid)
            let productIndex = cart.products.findIndex(product => product.productId._id.toString()  = pid)
            if (productIndex === -1){
                throw `No se encontro el producto con id ${pid} en el carrito de id ${cid}`
            } else {
                cart.products[productIndex].quantity = qty
            }
            cart = await cartModel.updateOne({_id: cid}, {products: cart.products})
            return cart
        } catch (error) {
            throw error
        }
    }

    async emptyCart(cid) {
        try {
            let cart = await this.getCartById(cid)
            await cartModel.updateOne({_id:cid}, {products: [] })
            cart = await this.getCartById(cid)
            return  cart
        } catch (error) {
            throw error
        }
    }

    async removeProductOfOneCart(cid, pid) {
        try {
            let cart = await this.getCartById(cid)
            let productIndex = cart.products.findIndex(product => product.productId._id.toString()  = pid)
            if (productIndex === -1){
                throw `No se encontro el producto con id ${pid} en el carrito de id ${cid}`
            } else {
                cart.products.splice(productIndex, 1)
            }
            await cartModel.updateOne({_id: cid}, {products: cart.products})
            cart = await this.getCartById(cid)
            return cart
        } catch (error) {
            throw error
        }
    }

}

const cartController = new CartController()

export default cartController