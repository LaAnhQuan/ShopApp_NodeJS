'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'orders', // Tên bảng bạn muốn thêm cột
      'session_id', // Tên cột bạn muốn thêm
      {
        type: Sequelize.STRING, // Kiểu dữ liệu của cột là chuỗi (STRING)
        allowNull: true // Cho phép giá trị null trong cột này
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('orders', 'session_id');
  }
};
