import Products from '../models/Products.js';
// Create a new product

const createProductService = async (data , userId) => {
    try {
        const { name, description, price, category } = data;
        const newProduct = await Products.create({
            name,
            description,
            price,
            category,
            createdBy: userId
        });
        return newProduct;
    } catch (err) { 
        throw new Error("Error creating product: " + err.message);
    }      
}

const getProductsService = async () => {
    try {
        const products = await Products.find({ isActive: true });
        return products;
    } catch (err) {
        throw new Error("Error fetching products: " + err.message);
    }
}
const getProductByIdService = async (id) => {
    try {
        const product = await Products.findById(id);
        if (!product || !product.isActive) {
            throw new Error("Product not found");
        }
        return product;
    } catch (err) {
        throw new Error("Error fetching product: " + err.message);
    }   
}

const updateProductService = async (id, data) => {
    try {
        const updatedProduct = await Products.findByIdAndUpdate(id, data, { new: true });
        if (!updatedProduct) {
            throw new Error("Product not found");
        }
        return updatedProduct;
    }
    catch (err) {
        throw new Error("Error updating product: " + err.message);
    }
}

const deleteProductService = async (id) => {
    try {
        const deletedProduct = await Products.findByIdAndUpdate(id, { isActive: false }, { new: true });
        if (!deletedProduct) {
            throw new Error("Product not found");
        }
        return deletedProduct;
    } catch (err) {
        throw new Error("Error deleting product: " + err.message);
    }
}    




export { createProductService , getProductsService, getProductByIdService, updateProductService, deleteProductService };