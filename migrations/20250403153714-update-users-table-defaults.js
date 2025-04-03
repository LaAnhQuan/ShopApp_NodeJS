'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Cập nhật cột created_at
    await queryInterface.changeColumn('users', 'created_at', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW, // Cập nhật lại giá trị mặc định (hoặc thay bằng giá trị bạn muốn)
    });

    // Cập nhật cột updated_at
    await queryInterface.changeColumn('users', 'updated_at', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW, // Cập nhật lại giá trị mặc định (hoặc thay bằng giá trị bạn muốn)
    });
  },

  async down(queryInterface, Sequelize) {
    // Nếu bạn muốn khôi phục lại giá trị mặc định ban đầu
    await queryInterface.changeColumn('users', 'created_at', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    });

    await queryInterface.changeColumn('users', 'updated_at', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    });
  }
};