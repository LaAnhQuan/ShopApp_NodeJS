module.exports = {
    getCategories: async (req, res) => {
        res.status(200).json({
            message: 'Get categories successfully'
        })
    },

    getCategoryById: async (req, res) => {
        res.status(200).json({
            message: 'Get a category successfully'
        })
    },

    insertCategory: async (req, res) => {
        res.status(200).json({
            message: 'Insert a category successfully'
        })
    },

    deleteCategory: async (req, res) => {
        res.status(200).json({
            message: 'Delete a category successfully'
        })
    },

    updateCategory: async (req, res) => {
        res.status(200).json({
            message: 'Update a category successfully'
        })
    },
}
