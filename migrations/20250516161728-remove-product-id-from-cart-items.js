'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const columns = await queryInterface.describeTable('cart_items');
    if (columns.product_id) {
      await queryInterface.removeColumn('cart_items', 'product_id');
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Nếu cần khôi phục lại cột product_id
    await queryInterface.addColumn('cart_items', 'product_id', {
      type: Sequelize.INTEGER,
      allowNull: false
    });
  }
};

