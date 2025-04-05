module.exports = {
    getOrderDetails: async (req, res) => {
        res.status(200).json({
            message: 'Get order details successfully'
        })
    },

    getOrderDetailById: async (req, res) => {
        res.status(200).json({
            message: 'Get an order detail successfully'
        })
    },

    insertOrderDetail: async (req, res) => {
        res.status(200).json({
            message: 'Insert an order detail successfully'
        })
    },

    deleteOrderDetail: async (req, res) => {
        res.status(200).json({
            message: 'Delete an order detail successfully'
        })
    },

    updateOrderDetail: async (req, res) => {
        res.status(200).json({
            message: 'Update an order detail successfully'
        })
    },
}
