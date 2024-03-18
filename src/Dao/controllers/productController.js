import productModel from "../models/productModel.js"

class ProductController {
    constructor() {
        //nada x ahora
    }



    async getProducts(req) {
        const limit = req.query.limit ? parseInt(req.query.limit) : 10
        const page = req.query.page ? parseInt(req.query.page) : 1
        const status = req.query.status ? req.query.status : null
        const  category = req.query.category ? req.query.category : null
        let sort  = req.query.sort
        const filter = {}
        if (status) {
            filter.status = status
        }
        if (category) {
            filter.category = category
        }
        if(sort === "asc") {
            sort = { price: 1}
        } else if (sort == "desc") {
            sort = { price : -1}
        } else {
            sort = null
        }

        try {
            const products = await productModel.paginate(filter, {limit, page, sort, lean:true})
            if (page > products.totalPages || page <= 0 || isNaN(page)) {
                throw new Error('Página inexistente');
            }
            products.prevLink = products.page > 1 ? `/products?page=${products.page - 1}` : null
            products.nextLink = products.page < products.totalPages ? `/products?page=${products.page + 1}` : null
            return products
        } catch (error) {
            throw error
        }
    }


    async getProductById(id) {
        try {
            let product = await productModel.findOne({_id: id})
            return product
        } catch (error) {
            throw error
        }
    } 

    async addProduct(product) {
        try {
            if (!product.title || ! product.code|| ! product.stock|| !product.price ){
                throw "Error debe llenar todos los campos"
            }
            let response = await productModel.create(product)
            return response
        } catch (error) {
            throw error
        }
    
    }

    async deleteProduct(id) {
        try {
            let response = await productModel.deleteOne({_id: id})
            return response
        } catch (error) {
            throw error
        }
    } 

    async updateProduct(id, product) {
        try {
            if (!product.title || ! product.code|| ! product.stock|| !product.price ){
                throw "Error debe llenar todos los campos"
            }
            let response = await productModel.updateOne({_id: id} , product )
            return response
        } catch (error) {
            throw error
        }
    }

    async
}

const productController = new ProductController()

export default productController