import { Sequelize } from "sequelize"
import db from "../models"

module.exports = {
    getOrders: async (req, res) => {
        res.status(200).json({
            message: 'Get orders successfully'
        })
    },

    getOrderById: async (req, res) => {
        res.status(200).json({
            message: 'Get an order successfully'
        })
    },

    insertOrder: async (req, res) => {
        res.status(200).json({
            message: 'Insert an order successfully'
        })
    },

    deleteOrder: async (req, res) => {
        res.status(200).json({
            message: 'Delete an order successfully'
        })
    },

    updateOrder: async (req, res) => {
        res.status(200).json({
            message: 'Update an order successfully'
        })
    },
}
