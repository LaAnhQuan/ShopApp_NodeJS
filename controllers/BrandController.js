module.exports = {
    getBrands: async (req, res) => {
        res.status(200).json({
            message: 'Get brands successfully'
        })
    },

    getBrandById: async (req, res) => {
        res.status(200).json({
            message: 'Get a brand successfully'
        })
    },

    insertBrand: async (req, res) => {
        res.status(200).json({
            message: 'Insert a brand successfully'
        })
    },

    deleteBrand: async (req, res) => {
        res.status(200).json({
            message: 'Delete a brand successfully'
        })
    },

    updateBrand: async (req, res) => {
        res.status(200).json({
            message: 'Update a brand successfully'
        })
    },
}
