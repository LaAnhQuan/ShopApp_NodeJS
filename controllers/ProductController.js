
module.exports = {
    getProducts: async (req, res) => {
        res.status(200).json({
            message: 'Get products successfully'
        })
    },
    getProductById: async (req, res) => {
        res.status(200).json({
            message: 'Get a product successfully'
        })
    },

    insertProduct: async (req, res) => {
        res.status(200).json({
            message: 'Insert a product successfully'
        })
    },

    deleteProduct: async (req, res) => {
        res.status(200).json({
            message: 'Delete a product successfully'
        })
    },

    updateProduct: async (req, res) => {
        res.status(200).json({
            message: 'Update a product successfully'
        })
    },

}


